<?php

namespace App\Jobs;

use ZipArchive;
use Illuminate\Support\Arr;
use Illuminate\Bus\Queueable;
use App\Http\Traits\CsvFileTrait;
use App\Models\ShopProductVariant;
use Illuminate\Support\Facades\File;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class ExportProductsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    use CsvFileTrait;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public $timeout = 9000;
    public $tries = 1;
    protected $user;
    protected $feedSettingId;
    protected $variantIds;
    protected $columns;
    protected $tabsValue;
    protected $storeEmail;

    public function __construct($user, $feedSettingId, $columnsName, $tabsValue, $storeEmail)
    {
        $this->user = $user;
        $this->feedSettingId = $feedSettingId;
        $this->columns = $columnsName;
        $this->tabsValue = $tabsValue;
        $this->storeEmail = $storeEmail;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
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
            "loyaltyPoints",
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
        $fieldsToExport = $this->verifyHeaderFieldsOfCreateCsv($this->columns);

        if (isset($fieldsToExport["status"]) && $fieldsToExport["status"] === "error") :
            info(json_encode(["status" => false, "message" => $fieldsToExport]));
        endif;
        // Query To Get Fields
        $indexToReplace = array_search("Product Highlights (1,2,3,4,5,6)", $this->columns);
        if ($indexToReplace !== false) :
            array_splice($this->columns, $indexToReplace, 1, [
                "Product Highlight 1",
                "Product Highlight 2",
                "Product Highlight 3",
                "Product Highlight 4",
                "Product Highlight 5",
                "Product Highlight 6"
            ]);
        endif;
        $mappedKeys = $this->renameCsvHeader($this->columns);
        $mappedKeys = array_unique($mappedKeys);
        $mappedKeys = array_diff($mappedKeys, ['feed_setting_id', 'productId', 'variantId']);
        array_unshift($mappedKeys, 'easyFeedId');

        // File Name For CSV
        $publicDir = public_path();
        $csvFileName = $this->user->name . "_" . uniqid() . ".csv";
        // $filename = auth()->user()->name . "_" . uniqid() . "." . $fileExtention;
        $file = fopen($publicDir . "/" . $csvFileName, "w");
        // Failure of opening the CSV File
        if ($file === false) :
            info(json_encode(["status" => false, "message" => "An Error Occurred.Fialed to open" . $csvFileName . "For Shop" . auth()->user()->name]));
        endif;
        $requiredFields = $this->addSelectToQuery($fieldsToExport);
        //Put Csv Header Colums Fields
        $this->columns= array_diff($this->columns, ['Feed Id', 'Product Id', 'Variant Id']);
        array_unshift($this->columns, "App Id");
        
        fputcsv($file, $this->columns);
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
        if ($this->tabsValue !== null) :
            if ($this->tabsValue !== 'all') :
                $query->where('shop_product_variants.status', ucfirst($this->tabsValue));
            endif;
        endif;

        // Execute the query
        $query->where([
            "shop_product_variants.user_id" => $this->user->id,
            "shop_product_variants.feed_setting_id" => $this->feedSettingId,
        ])
            ->orderBy('shop_product_variants.id')
            ->chunk(1000, function ($products) use ($fields, $mappedKeys, $requiredFields, $unitValues, $file, $fieldsToExport) {
                // dd($products->toArray());
                // Process each chunk of 1000 products
                $this->writeProductToCsv($products, $fields, $mappedKeys, $requiredFields, $file, $unitValues, $fieldsToExport);
            });

        // Close the File
        fclose($file);

        // Zipping the file
        $zip_fname = $this->user->name . ".zip";
        if (is_file($zip_fname)) :
            unlink($publicDir . "/" . $zip_fname);
        endif;
        touch($publicDir . "/" . $zip_fname);
        $zip = new ZipArchive();
        if ($zip->open($publicDir . "/" . $zip_fname) === true) :
            $zip->addFile($publicDir . "/" . $csvFileName, $csvFileName);
            $zip->close();
            //Deletig Csv File From Storage
            unlink($publicDir . "/" . $csvFileName);
        endif;
        $download_path = $publicDir . "/" . $zip_fname;

        // send Mail To user with Atachments
        $zipFileSize = File::size($download_path);
        $maxAttachmentsize = 24990000; //in Bytes [25MB]
        if ($zipFileSize <= $maxAttachmentsize) :
            $this->sendMailWithAttachmentMailerSend($download_path, $this->storeEmail);
        else :
            info("Zip File Size Is greater Than 25 MB For (" . $this->user . ")--Path To File =" . $download_path);
        endif;
        if (File::exists($download_path)) :
            File::delete($download_path);
        endif;
        $infoMessage = "CSV File To Store : {$this->user->name} | Email: {$this->storeEmail} | Sent Successfully";
        info($infoMessage);
    }
}
