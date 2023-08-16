<?php

namespace App\Jobs;

use App\Models\FeedSetting;
use Illuminate\Support\Arr;
use App\Models\CsvFileStatus;
use Illuminate\Bus\Queueable;
use App\Http\Traits\CommonTrait;
use App\Http\Traits\CsvFileTrait;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\GoogleApiTrait;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class ReadCsvJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, CsvFileTrait, GoogleApiTrait, CommonTrait;

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

    protected $filename;

    protected $dbColumsValues;

    protected $dbColumsName;

    protected $variantTableData;

    protected $productCategories;
    protected $callCount = 1;
    protected $allVariants;
    protected $allVariantForeignKey;
    protected $feedSettings;


    public function __construct($user, $filename)
    {
        $this->user = $user;
        $this->filename = $filename;
    }

    /**
     * Execute the job.
     *
     * @return void
     */

    public function handle()
    {
        try {
            $storageDir = storage_path();

            // dd($storageDir.'/app/'.$this->filename,$this->filename);
            $file = $storageDir . '/app/' . $this->filename;

            if (($handle = fopen($file, 'r')) !== false) :

                // Get All Feeds Settings For The User
                $this->feedSettings = FeedSetting::where('user_id', $this->user->id)->get();

                // Get All required Fields From Product Categories Table
                $this->productCategories = DB::table('product_categories')->select('id', 'value')->get();

                // Get All required Fields From Variants Table
                $this->variantTableData = DB::table('shop_product_variants')
                    ->where('user_id', $this->user->id)
                    ->get(['id', 'feed_setting_id', 'variantId','productId','itemId', 'sku']);

                $this->allVariantForeignKey = collect($this->variantTableData);

                $rowCount = 0;
                $batchSize = 250;
                $csvFileHeaderName = fgetcsv($handle);

                $this->dbColumsName = $this->verifyHeaderFieldsOfReadCsv($csvFileHeaderName);

                while (($data = fgetcsv($handle)) !== false) {
                    $this->dbColumsValues[] = $data;
                    $rowCount++;
                    if ($rowCount % $batchSize === 0) :
                        // Process the batch of data
                        if (count($this->dbColumsValues) > 0) :

                            $this->addProductsToDatabase($this->dbColumsName, $this->dbColumsValues);
                            // $this->makeFeed($returnedData);
                            $this->dbColumsValues = [];
                            $this->callCount++;
                        endif;
                    endif;
                }
                // Process any remaining data
                if (count($this->dbColumsValues) > 0) :
                    $this->addProductsToDatabase($this->dbColumsName, $this->dbColumsValues);
                    // $this->makeFeed($returnedData);
                    $this->dbColumsValues = [];
                    $this->callCount++;
                endif;
                fclose($handle);
            endif;
            info('Products Updated successfully');

            $feedUpdated = CsvFileStatus::updateOrCreate(
                ['user_id' => $this->user->id],
                ['isCompleted' => true, 'hasError' => false]
            );
        } catch (\Exception $e) {
            if (Storage::exists($this->filename)) :
                $fileDeleted = Storage::delete($this->filename);
                ($fileDeleted == 1) ? info('File Deleted Successfully') : info('Unable To Delete File');
            endif;
            info($e);
        }
    }

    public function addProductsToDatabase($fields, $records)
    {

        $countNotMached = [];

        $batchCount = 1;
        $toUpload = $decodedRecords = $feedData = $optmizedFeedData = $feedIDs = $variantIDs = $updates = [];
        $shop_product_images = config('CsvFile.productImagesColums');
        $edited_products = config('CsvFile.editedProductsColums');
        $product_highlights = config('CsvFile.productHighlights');
        $product_labels = ['customLabel0', 'customLabel1', 'customLabel2', 'customLabel3', 'customLabel4'];
        $product_labels_extras = ['adsLabels', 'adsGrouping', 'shippingLabel', 'taxCategory'];
        foreach ($records as $record) :
            if (count($fields) != count($record)) :
                $countNotMached[] = "Cannot Be Merged Colum Count:" . count($fields) . "=> Values Count" . count($record) . "-" . json_encode($record);
                // dd("Cannot Be Merged Colum Count:" . count($fields) . "=> Values Count" . count($record) . "-",$fields,$record);
                continue;
            endif;
            $combinedRecord = array_filter(array_combine($fields, $record), 'strlen');
            if (isset($combinedRecord['appId'])) :
                $decodedRecords[] = array_map('html_entity_decode', $combinedRecord);
                [$feedIDs[], $variantIDs[]] = $this->extractVariantAndFeedId($combinedRecord['appId']);
            endif;

        // if (isset($combinedRecord['feedId']) && isset($combinedRecord['variantId'])) :
        //     $decodedRecords[] = array_map('html_entity_decode', $combinedRecord);
        //     $feedIDs[] = $combinedRecord['feedId'];
        //     $variantIDs[] = $combinedRecord['variantId'];
        // endif;
        endforeach;

        $this->allVariants = $this->allVariantForeignKey
            ->whereIn('variantId', $variantIDs)
            ->whereIn('feed_setting_id', $feedIDs)
            ->values();

        // dd($this->allVariants);
        // $feedSettings = FeedSetting::where('user_id', $this->user->id)->get();
        // $feedSettings = collect($feedSettings);
        foreach ($decodedRecords as $key => $record) :
            $feedData = $labels = $labelsExtras = $highlights = $images = $editedProducts = $optmizedFeedData = [];
            [$record['feedId'], $record['variantId']] = $this->extractVariantAndFeedId($record['appId']);
            $variantForeignKey = $this->allVariants
                ->where('variantId', $record['variantId'])
                ->where('feed_setting_id', $record['feedId'])->first();
            foreach ($record as $key => $value) :
                $value = mb_convert_encoding($this->trimSpaces($value), 'UTF-8');
                // $value = mb_convert_encoding($this->trimSpaces($value), 'UTF-8', 'UTF-8');
                if ($value === ' ' || $value === '" "') :
                    continue;
                endif;
                if (in_array($key, $product_highlights)) {
                    $newValue = $this->limitValue($value, false, 145, false);
                    if ($newValue) {
                        $highlights[] = $newValue;
                    }
                } elseif (in_array($key, $product_labels)) {
                    $newValue = $this->limitValue($value, false, 1000, false);
                    if ($newValue) {
                        $labels[$key] = $newValue;
                    }
                } elseif (in_array($key, $product_labels_extras)) { //For testing .......................
                    $newValue = $this->limitValue($value, false, 100, false);
                    if ($newValue) {
                        $labelsExtras[$key] = $newValue;
                    }
                } elseif (in_array($key, $shop_product_images)) {
                    $newValue = $this->limitValue($value, false, 1990, false);
                    if ($newValue) {
                        $images[$key] = $newValue;
                    }
                } elseif (in_array($key, $edited_products)) {
                    $newValue = $this->validateEditedProductsTable($key, $value);
                    if ($newValue !== null) {
                        if ($key !== "multipack" && $this->isJsonEncoded($newValue)) {
                            // The value is JSON encoded
                            $optmizedFeedData[$key] = json_decode($newValue, true);
                        } else {
                            $optmizedFeedData[$key] = $newValue;
                        }

                        $editedProducts[$key] = $newValue;
                    }
                } else {
                    $newValue = $this->validateShopVariantsTable($key, $value);
                    if ($newValue !== null) {
                        $feedData[$key] = $newValue;
                        if ($key === "productTypes") {
                            $optmizedFeedData[$key] = [$newValue];
                        } elseif ($key === "productCondition" || $key === "condition") {
                            $optmizedFeedData["condition"] = $newValue;
                        } elseif ($key === "image") {
                            $optmizedFeedData["imageLink"] = $newValue;
                        } elseif ($key === 'barcode') {
                            $optmizedFeedData['gtin'] = $newValue;
                        } elseif ($key === 'product_category_id') {
                            $product_category_value = $this->productCategories->where('id', $newValue)->first();
                            if (!empty($product_category_value)) {
                                $optmizedFeedData['googleProductCategory'] = $product_category_value->value;
                            }
                        }
                    }
                }
            endforeach;


            $feedData = Arr::except($feedData, ['appId', 'feedId', 'productId', 'variantId', 'score', 'sku']);
            $keysToInclude = ['title', 'description', 'brand', 'ageGroup', 'gender'];

            // filter out any null values or keys that don't exist in the array
            $filteredData = array_filter(array_intersect_key($feedData, array_flip($keysToInclude)), function ($value) {
                return $value !== null;
            });
            $optmizedFeedData = array_merge($optmizedFeedData, $filteredData);

            if (!empty($variantForeignKey)) :
                // $updates[$variantForeignKey->id] = ['id' => $variantForeignKey->id] + $feedData;
                if (!empty($feedData)) :
                    $update_shop_product_variants = DB::table('shop_product_variants')
                        ->where('id', $variantForeignKey->id)
                        ->update($feedData);
                endif;
                if (count($labelsExtras) > 0) :
                    $labelsExtras['variantId'] = $record['variantId'];
                    $labelsExtras['shop_product_variant_id'] = $variantForeignKey->id;

                    $update_product_labels = DB::table('product_labels')
                        ->where('shop_product_variant_id', $variantForeignKey->id)
                        ->updateOrInsert(['shop_product_variant_id' => $variantForeignKey->id, 'feed_setting_id' => $record['feedId']], $labelsExtras);

                    unset($labelsExtras['variantId'], $labelsExtras['shop_product_variant_id']);
                    $feedData = array_merge($feedData, $labelsExtras);
                    $optmizedFeedData = array_merge($optmizedFeedData, $labelsExtras);
                endif;
                if (count($labels) > 0) :
                    $labels['variantId'] = $record['variantId'];
                    $labels['shop_product_variant_id'] = $variantForeignKey->id;
                    $update_product_labels = DB::table('product_labels')
                        ->where('shop_product_variant_id', $variantForeignKey->id)
                        ->updateOrInsert(['shop_product_variant_id' => $variantForeignKey->id, 'feed_setting_id' => $record['feedId']], $labels);
                    unset($labels['variantId'], $labels['shop_product_variant_id']);
                    $feedData['customLabel'] = $labels;
                    $optmizedFeedData = array_merge($optmizedFeedData, $labels);
                endif;
                if (count($images) > 0) :
                    $images['productId'] = $variantForeignKey->productId;
                    $images['variantId'] = $record['variantId'];
                    $update_shop_product_images = DB::table('shop_product_images')
                        ->where('shop_product_variant_id', $variantForeignKey->id,)
                        ->updateOrInsert(['shop_product_variant_id' => $variantForeignKey->id,], $images);
                    unset($images['variantId'], $images['productId']);
                    $feedData['additionalImageLinks'] = $images;
                    $optmizedFeedData['additionalImageLinks'] = array_values($images);
                endif;
                if (count($editedProducts) > 0) :
                    $editedProducts['user_id'] = $this->user->id;
                    $editedProducts['shop_product_variant_id'] = $variantForeignKey->id;
                    $editedProducts['feed_setting_id'] = $record['feedId'];
                    $editedProducts['productId'] = $variantForeignKey->productId;
                    $editedProducts['variantId'] = $record['variantId'];
                    if (count($highlights) > 0) :
                        $editedProducts['productHighlights'] = json_encode($highlights);
                        $optmizedFeedData['productHighlights'] = $highlights;
                    endif;
                    if (isset($edited_products['shipping'])) :
                        $optmizedFeedData['shipping'] = json_decode($edited_products['shipping'], true);
                    endif;

                    $update_edited_products = DB::table('edited_products')
                        ->where('shop_product_variant_id', $variantForeignKey->id)
                        ->updateOrInsert(['shop_product_variant_id' => $variantForeignKey->id], $editedProducts);

                    $feedData = array_merge($feedData, $editedProducts);
                endif;
                $feedData['feed_setting_id'] = $record['feedId'];
                $feedData['productId'] = $variantForeignKey->productId;
                $feedData['variantId'] = $record['variantId'];
                /* Make Feed Call For Chunk Of Products  */
                $feedId = $record['feedId'];
                $feedSetting = $this->feedSettings->where('id', $feedId)->first();
                if ($feedSetting->productIdFormat === 'sku') :
                    $varinatSku = $this->allVariants->where('variantId', $record['variantId'])->first();
                    $record['sku'] = $varinatSku->sku;
                endif;

                // dd($optmizedFeedData,$feedData);
                $toUpload[] = [
                    "batchId" => $batchCount,
                    "merchantId" => $feedSetting->merchantAccountId,
                    "method" => "update",
                    "productId" => $variantForeignKey->itemId,
                    "product" => $optmizedFeedData
                ];
                $batchCount++;
            endif;
        endforeach;
        // if (count($updates) > 0) :
        //     $updateVariantTableData = $this->updateMultiple($updates);
        // endif;
        if (count($toUpload) > 0) :
            $data = $this->uploadBulkProductsToMerchantAccount(['entries' => $toUpload], $this->user);
            // info(json_encode($data));
            info("Batch Number " . $this->callCount . "Products Updated " . $this->callCount * 250);

        endif;

        if (Storage::exists($this->filename)) :
            $fileDeleted = Storage::delete($this->filename);
            ($fileDeleted == 1) ? info('File Deleted Successfully') : info('Unable To Delete File');
        endif;
        if (count($countNotMached) > 0) :
            info(json_encode($countNotMached));
        endif;
    }

    /**
     * Check if a value is JSON encoded
     *
     * @param mixed $value
     * @return bool
     */
    public function isJsonEncoded($value)
    {
        // Attempt to decode the value as JSON
        $decoded = json_decode($value);

        // If decoding was successful and the decoded value is not equal to the original value, then the input was JSON encoded
        return (json_last_error() === JSON_ERROR_NONE) && ($decoded !== $value);
    }
}
