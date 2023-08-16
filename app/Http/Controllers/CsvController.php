<?php

namespace App\Http\Controllers;

use Exception;
use ZipArchive;
use App\Jobs\ReadCsvJob;
use App\Jobs\DeleteCsvJob;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\CsvFileStatus;
use App\Jobs\ExportProductsJob;
use App\Http\Traits\CommonTrait;
use App\Http\Traits\CsvFileTrait;
use App\Models\ShopProductVariant;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\GoogleApiTrait;
use App\Mail\AppInstalledEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;


class CsvController extends Controller
{
    use CsvFileTrait;
    use GoogleApiTrait;

    private $rows = [];
    protected $products;

    /*---------Function For Creating CSV File Only  [Final Tested and Optimized]-----------*/
    public function createCsv(Request $request)
    {
        $feedSettingId = $request->post('feedSettingId');
        if (empty($request->post('tabsValue'))) :
            return response()->json(["status" => false, "message" => "Please Select A Tab to Export Products From."]);
        endif;
        $tabValue = $request->post('tabsValue');
        if (empty($request->post('selectedIds')) && empty($request->post('feedSettingId'))) :
            return response()->json(["status" => false, "message" => "Something Went Wrong"], 404);
        endif;
        $productsCount = DB::table("shop_product_variants")->where(['user_id' => auth()->user()->id])->count();
        if ($productsCount === 0) :
            return response()->json(["status" => false, "message" => "No Product Found Please Add Products First"], 404);
        endif;

        $unitValues = [
            "shippingHeight",
            "shippingLength",
            "shippingWeight",
            "shippingWidth",
            "productHeight",
            "productLength",
            "productWeight",
            "productWidth",
            "unitPricingMeasure",
            "unitPricingBaseMeasure",
            "costOfGoodsSold",
            "loyaltyPoints"
        ];

        $fields = [
            'country',
            'price.value',
            'price.currency',
            'service',
            'locationId',
            'locationGroupName',
            'minHandlingTime',
            'maxHandlingTime',
            'minTransitTime',
            'maxTransitTime'
        ];
        //  "productHighlights"
        /*----- CSV File Headers Names------*/
        $defaultColums = config('CsvFile.headerFieldsName');
        if (!$request->has('fieldsToExport') || !in_array($request->post("fieldsToExport"), ['Custom Fields', 'All Fields'])) :
            return response()->json(['status' => false, 'message' => 'Please Choose A Field To Export Products.']);
        endif;
        if ($request->post("fieldsToExport") === "Custom Fields") :
            $columsCount = sizeof($request->post("selectedFields"));
            if (($columsCount > 3 && $columsCount < 68) || $columsCount === 68) :
                $columns = $columsCount === 68 ? $defaultColums : $request->post("selectedFields");
            endif;
        else :
            $columns = $defaultColums;
        endif;
        $columns = array_unique($columns);
        $fieldsToExport = $this->verifyHeaderFieldsofCreateCsv($columns);
        if (isset($fieldsToExport["status"]) && $fieldsToExport["status"] === "error") :
            return response()->json(["status" => false, "message" => $fieldsToExport['message']], 422);
        endif;
        // Query To Get Fields
        $indexToReplace = array_search("Product Highlights (1,2,3,4,5,6)", $columns);
        if ($indexToReplace !== false) :
            array_splice($columns, $indexToReplace, 1, [
                "Product Highlight 1",
                "Product Highlight 2",
                "Product Highlight 3",
                "Product Highlight 4",
                "Product Highlight 5",
                "Product Highlight 6"
            ]);
        endif;
        $mappedKeys = $this->renameCsvHeader($columns);
        $mappedKeys = array_unique($mappedKeys);
        $mappedKeys = array_diff($mappedKeys, ['feed_setting_id', 'productId', 'variantId']);
        array_unshift($mappedKeys, 'easyFeedId');
        // File Name For CSV
        $csvFileName = auth()->user()->name . "_" . uniqid() . ".csv";
        $file = fopen($csvFileName, "w");
        // Failure of opening the CSV File
        if ($file === false) :
            return response()->json(["status" => false, "message" => "An Error Occurred. Error: Fialed to open" . $csvFileName,]);
        endif;
        $requiredFields = $this->addSelectToQuery($fieldsToExport);
        //Put Csv Header Colums Fields
        $columns = array_diff($columns, ['Feed Id', 'Product Id', 'Variant Id']);
        array_unshift($columns, "App Id");

        fputcsv($file, $columns);
        $query = ShopProductVariant::query();
        $query->select('shop_product_variants.*');

        $query->when(isset($requiredFields['edited_products']) || isset($requiredFields['images']) || isset($requiredFields['labels']), function ($q) use ($requiredFields) {
            $relations = [];
            if (isset($requiredFields['edited_products']) && count($requiredFields['edited_products']) > 0) :
                $selectedEditedFields = implode(',', $requiredFields['edited_products']);
                $relations[] = 'editedProduct:shop_product_variant_id,' . $selectedEditedFields;
            endif;
            if (isset($requiredFields['images']) && count($requiredFields['images']) > 0) :
                $selectedImages = implode(',', $requiredFields['images']);
                $relations[] = 'productImage:shop_product_variant_id,' . $selectedImages;
            endif;
            if (isset($requiredFields['labels']) && count($requiredFields['labels']) > 0) :
                $selectedLabels = implode(',', $requiredFields['labels']);
                $relations[] = 'productLabel:shop_product_variant_id,' . $selectedLabels;
            endif;
            return $q->with($relations);
        });
        if (!empty($request->post('selectedIds'))) :
            $variantIds = $request->post('selectedIds');
            if ($request->post('selectedIds') !== 'all') :
                $query->whereIn('shop_product_variants.id', $variantIds);
            endif;
        else :
            $query->where('shop_product_variants.status', ucfirst($tabValue));
        endif;
        if ($tabValue !== null) :
            if ($tabValue !== 'all') :
                $query->where('shop_product_variants.status', ucfirst($tabValue));
            endif;
        endif;
        // Execute the query
        $results = $query
            ->where([
                "shop_product_variants.user_id" => auth()->user()->id,
                "shop_product_variants.feed_setting_id" => $feedSettingId,
            ])
            ->orderBy('shop_product_variants.id')
            ->chunk(300, function ($products) use ($fields, $mappedKeys, $requiredFields, $unitValues, $file, $fieldsToExport) {
                if (count($products) == 0) :
                    return response()->json(["status" => false, "message" => "Invalid Variants Or Feed Setting Id"], 422);
                endif;
                // Process each chunk of 300 products
                $this->writeProductToCsv($products,$fields,$mappedKeys,$requiredFields,$file,$unitValues,$fieldsToExport);

            });

        // Close the File
        // fclose($file);
        //Headers To Trigger Download Of File
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename={$csvFileName}",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];
        $download_path = public_path($csvFileName);
        DeleteCsvJob::dispatch($csvFileName);
        return response()->download($download_path, $csvFileName, $headers);
    }


    /*---------Function For Sending  Zip File To Mail [Final Tested and Optimized]-----------*/
    public function exportProductsViaMail(Request $request)
    {
        $tabValue = null;
        $productsCount = DB::table("shop_product_variants")->where(['user_id' => auth()->user()->id])->count();
        if ($productsCount === 0) :
            return response()->json(["status" => false, "message" => "No Product Found Please Add Products First"], 404);
        endif;
        //Feed Seeting Id
        if (!$request->post('feedSettingId')) :
            return response()->json(["status" => false, "message" => "Invalid Feed Setting Id"], 404);
        endif;
        if (!empty($request->post('tabsValue'))) :
            $tabValue = $request->post('tabsValue');
        endif;
        $feedSettingId = $request->post('feedSettingId');
        /*------Header Name( Colums Name) For CSV Files-----*/
        $defaultColums = config('CsvFile.headerFieldsName');
        if (!$request->has('fieldsToExport') || !in_array($request->post("fieldsToExport"), ['Custom Fields', 'All Fields'])) :
            return response()->json(['status' => false, 'message' => 'Please Choose A Field To Export Products.']);
        endif;

        if (strtolower($request->post("fieldsToExport")) === "custom fields") :
            $columsCount = sizeof($request->post("selectedFields"));
            if (($columsCount > 3 && $columsCount < 68) || $columsCount === 68) :
                $columns = $columsCount === 68 ? $defaultColums : $request->post("selectedFields");
            endif;
        else :
            $columns = $defaultColums;
        endif;

        $columns = array_unique($columns);

        if (empty($tabValue)) :
            return response()->json(["status" => false, "message" => "Please Select A Tab to Export Products From."]);
        endif;
        $storeEmail = $request->post('storeEmail', auth()->user()->settings->store_email);
        ExportProductsJob::dispatch(auth()->user(), $feedSettingId, $columns, $tabValue, $storeEmail);
        // return response()->json(["status" => true, "message" => "Your Export Will be Delivered by email To $storeEmail"]);
        return response()->json([
            "status" => true,
            "message" => "Your export will be delivered to $storeEmail via email."
        ]);
    }

    /*---------Function For Reading  CSV File When User Click Upload And Continue [Final Tested and Optimized ]-----------*/
    public function readCsv(Request $request)
    {
        $filesUploaded = CsvFileStatus::where('user_id', auth()->user()->id)
            ->where('isDispached', true)
            ->first();
        if ($filesUploaded && $filesUploaded->isCompleted == false) :
            return response()->json(["status" => "error", "message" => "Already File Uploaded Please Wait To Finish it First"], 422);
        endif;
        if ($request->hasFile("file")) :
            $file = $request->file('file');
            $originalFilename = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $Uuid = Str::uuid()->toString();
            try {
                $records = [];
                $tempFilePath = $file->getPathname();
                // Open the zip file for reading
                $zip = new ZipArchive;
                $res = $zip->open($tempFilePath);

                // New Code Started 1 end
                if ($res === true) :
                    // Get the name of the first file in the zip archive
                    $csvFilePath = $zip->getNameIndex(0);
                    // Get the size of the CSV file
                    $csvSize = $zip->statName($csvFilePath)['size'];
                    // Validate that the file in the zip archive is a CSV file
                    if (strtolower(pathinfo($csvFilePath, PATHINFO_EXTENSION)) !== 'csv') :
                        return response()->json(["status" => "error", "message" => "File Must Be A Csv File"], 422);

                    endif;
                    $csvSizeInKb = floor($csvSize / 1024);
                    // if ($csvSizeInKb < 2) :
                    //     return response()->json(["status" => "error", "message" => "Csv File Size Must Be Atleast 2 KB."], 422);
                    // else
                    if ($csvSizeInKb > 100000) :

                        return response()->json(["status" => "error", "message" => "Csv File Size Must Be Less than 100 MB."], 422);
                    endif;
                    $csvStream = $zip->getStream($csvFilePath);
                    $header = fgetcsv($csvStream);
                    $returnedFields = $this->verifyHeaderFieldsOfReadCsv($header);
                    if (isset($returnedFields["status"]) && $returnedFields["status"] === "error") :
                        return response()->json($returnedFields, 422);
                    endif;
                    /*  $rowCount = 0;
                    $batchSize = 1000;

                    while (($data = fgetcsv($csvStream)) !== false) :
                        $rowCount++;
                        $records[] = $data;
                        if ($rowCount % $batchSize === 0) :

                            // Process the batch of data
                            $match = $this->matchHeadersCountWithBodyCount($returnedFields, $records);
                            $records = [];
                            if ($match === false) :
                                return response()->json(["status" => "error", "message" => "Invalid Data of CSV Column Count No Matched"], 422);
                            endif;
                        endif;
                    endwhile;
                    // Process any remaining data
                    if (count($records)>0) :
                        // $this->count++;
                        $match = $this->matchHeadersCountWithBodyCount($returnedFields, $records);
                        $records = [];
                        if ($match === false) :
                            return response()->json(["status" => "error", "message" => "Invalid Data of CSV Column Count No Matched"]);
                        endif;
                    endif;
                */

                    // fclose($csvStream);
                    $zip->close();
                    $fileUploaded = CsvFileStatus::updateOrCreate(
                        ['user_id' => auth()->user()->id],
                        ['uuid' => $Uuid, 'isChecked' => true, 'isCompleted' => false, 'isDispached' => false, 'hasError' => false]
                    );
                    return response()->json(["status" => "success", "message" => "Please Continue To Import Products", 'uuid' => $Uuid]);
                else :
                    return response()->json(["status" => "error", "message" => "Unable To Open The file"]);
                endif;
            } catch (\Throwable $th) {
                info($th);
                return $th;
            }
        endif;
    }

    /*---------Function For Reading  CSV File With Eloquent and Uploding the File  [Final And Tested]-----------*/
    public function uploadCompleteCsv(Request $request)
    {
        $uuid = $request->post("uuid");
        if (empty($uuid)) :
            return response()->json(["status" => "error", "message" => "Invalid Request"], 409);
        endif;
        $isChecked = CsvFileStatus::where('user_id', auth()->user()->id)
            ->where('uuid', $uuid)
            ->first();
        if (!$isChecked) :
            return response()->json(["status" => "error", "message" => "File Not Validated"], 422);
        endif;

        // $products=ShopProduct::query();
        if ($request->hasfile("file")) :

            $file = $request->file('file');
            $filename = $file->getClientOriginalName();
            // Get the path to the temporary file
            $tempFilePath = $file->getPathname();
            // Open the zip file for reading
            $zip = new ZipArchive;
            $res = $zip->open($tempFilePath);

            if ($res === true) :
                // Get the name of the first file in the zip archive
                $csvFilePath = $zip->getNameIndex(0);

                $exists = Storage::exists("public/media/" . $csvFilePath);
                if ($exists === false) :
                    // $uploadedFile = $file->storeAs("/public/media", $csvFilePath);
                    $uploadedFile =   $zip->extractTo(storage_path('app/public/media'));
                    $uploadedFileName =  'public/media/' . $csvFilePath;
                else :
                    info(json_encode(["status" => "error", "message" => "File Already Exists in Storage {$filename}"]));
                    return response()->json(["status" => "error", "message" => "File Already Exists"], 409);
                endif;
            endif;
            // $storedPath = Storage::putFileAs('uploads', $tempFilePath, $filename);
            $zip->close();
            ReadCsvJob::dispatch(auth()->user(), $uploadedFileName);

            $jobDispached = CsvFileStatus::where('user_id', auth()->user()->id)
                ->where('uuid', $uuid)
                ->update(['isDispached' => true]);
            return response()->json(["status" => "success", "message" => "Your Products Will be Updated Shortly", "isDispached" => true]);
        endif;
        return response()->json(["status" => "error", "message" => "Please Select A file To Upload"], 400);
    }

    public function uploadedCsvDetail()
    {
        $haveFiles = CsvFileStatus::where('user_id', auth()->user()->id)
            ->where('isDispached', true)
            ->where('isChecked', true)
            ->where('isCompleted', false)
            ->count();
        if ($haveFiles > 0) :
            return response()->json(['status' => true, 'message' => "Processing Already Uploaded File"]);
        else :
            return response()->json(['status' => false, 'message' => "No File Exists For Processing"]);
        endif;
    }
}
