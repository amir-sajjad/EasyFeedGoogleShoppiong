<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use App\Models\ProductCategory;
use App\Models\ShopProductVariant;
use App\Http\Traits\GoogleApiTrait;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Schema;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class EditBulkProductJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, GoogleApiTrait;
    public $timeout = 9000;
    public $tries = 1;
    protected $user;
    protected $data;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($user, $data)
    {
        $this->user = $user;
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $toUpload = [];
        $category = null;
        $editedFields = $this->data['editedFields'];
        $products = $this->data['products'];
        $feedSetting = $this->data['feedSetting'];
        $merchantAccountId = $feedSetting->merchantAccountId;
        if (isset($editedFields['product_category_id'])) :
            $category = ProductCategory::where('id', $editedFields['product_category_id'])->first();
            $editedFields['googleProductCategory'] = $category['value'] ?? null;
            unset($editedFields['product_category_id']);
        endif;
        $productTableColumns = Schema::getColumnListing('shop_product_variants');
        $editedProductTableColumns = Schema::getColumnListing('edited_products');
        $productLabelTableColumns = Schema::getColumnListing('product_labels');
        $productData = [];
        foreach ($editedFields as $field => $value) :
            if (is_array($value) || is_object($value)) :
                $value = json_encode($value);
            endif;
            if ($field == "googleProductCategory") :
                $field = "product_category_id";
                $value = $category['id'] ?? null;
            endif;
            if (in_array($field, $productTableColumns)) :
                $productData['shopProduct'][$field] = $value;
            elseif (in_array($field, $editedProductTableColumns)) :
                $productData['editedProduct'][$field] = $value;
            elseif (in_array($field, $productLabelTableColumns)) :
                $productData['productLabel'][$field] = $value;
            elseif ($field == "condition") :
                $productData['shopProduct']['productCondition'] = $value;
            endif;
        endforeach;
        $productsIds = $products->pluck('id');
        if (isset($productData['shopProduct'])) :
            ShopProductVariant::whereIn('id', $productsIds)->update($productData['shopProduct']);
        endif;
        foreach ($products as $key => $product) :
            $editedProductData = isset($productData['editedProduct']) ? $productData['editedProduct'] : null;
            if ($editedProductData != null) :
                $editedProductData['user_id'] = $this->user->id;
                $editedProductData['feed_setting_id'] = $feedSetting['id'];
                $editedProductData['productId'] = $product['productId'];
                $editedProductData['variantId'] = $product['variantId'];
                $product->editedProduct()->updateOrCreate(['shop_product_variant_id' => $product['id']], $editedProductData);
            endif;
            $productLabelData = isset($productData['productLabel']) ? $productData['productLabel'] : null;
            if ($productLabelData != null) :
                $productLabelData['variantId'] = $product['variantId'];
                $productLabelData['feed_setting_id'] = $feedSetting['id'];
                $product->productLabel()->updateOrCreate(['shop_product_variant_id' => $product['id']], $productLabelData);
            endif;
            $toUpload[] = [
                "batchId" => $key,
                "merchantId" => $merchantAccountId,
                "method" => "update",
                "productId" => $product['merchantCenterId'],
                "product" => $editedFields
            ];
        endforeach;
        $this->uploadBulkProductsToMerchantAccount(['entries' => $toUpload], $this->user);
    }
}
