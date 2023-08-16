<?php

namespace App\Jobs;

use App\Models\FeedSetting;
use Illuminate\Support\Str;
use Illuminate\Bus\Queueable;
use App\Models\ShopProductVariant;
use App\Http\Traits\GoogleApiTrait;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Schema;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class SyncDataFromShopifyJobStoreFront implements ShouldQueue
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
        $products = $this->data['products'];
        $toUpload = [];
        $feedSetting = FeedSetting::select(['id', 'merchantAccountId', 'productIdFormat', 'language', 'country', 'currency', 'channel', 'salePrice'])->where('id', $this->data['feedId'])->first();
        foreach ($products as $n => $product) :
            $values = [];
            $toUpdate = [];
            $arr[0] = $feedSetting->country;
            $arr[1] = strtoupper($feedSetting->language);
            $arr[2] = $product['productId'];
            $request =  $this->shopifyApiStoreFront("singleProduct", $arr, ['data', 'product'], $this->user);
            $variant = collect($request['variants']['nodes'])->where('id', 'gid://shopify/ProductVariant/' . $product['variantId'])->first();
            if (!empty($this->data['fieldsToUpdate'])) :
                if (isset($this->data['fieldsToUpdate']['title']) || isset($this->data['fieldsToUpdate']['seoTitle'])) :
                    $titlearr = [];
                    if (isset($variant['selectedOptions'])) :
                        foreach ($variant['selectedOptions'] as $option) :
                            if ($option['value'] != "Default Title") :
                                $titlearr[] = $option['value'];
                            endif;
                        endforeach;
                    endif;
                    $varTitle = $request['title'] . ((count($titlearr) > 0) ? "/" . implode('/', $titlearr) : '');
                    $toUpdate['title'] = $varTitle;
                    $values['title'] = $varTitle;
                endif;
                if (isset($this->data['fieldsToUpdate']['description']) || isset($this->data['fieldsToUpdate']['seoDescription'])) :
                    $toUpdate['description'] = $request['descriptionHtml'] ? Str::limit($request['descriptionHtml'], 4990, '(...)') : ($request['description'] ? Str::limit($request['description'], 4990, '(...)') : '');
                    $values['description'] = $request['descriptionHtml'] ? Str::limit($request['descriptionHtml'], 4990, '(...)') : ($request['description'] ? Str::limit($request['description'], 4990, '(...)') : '');
                endif;
                if (isset($this->data['fieldsToUpdate']['productImages'])) :
                    $toUpdate['image'] = $variant['image']['url'] ? $variant['image']['url'] : $request['featuredImage']['url'];
                    $values['imageLink'] = $variant['image']['url'] ? $variant['image']['url'] : $request['featuredImage']['url'];
                endif;
                if (isset($this->data['fieldsToUpdate']['productImages'])) :
                    $imageData['productId'] = $product['productId'];
                    $imageData['variantId'] = $product['variantId'];
                    foreach ($request['images']['nodes'] as $key => $image) :
                        if ($key == 9) :
                            $imageData['additionalImage' . ($key + 1) . ''] = $image['url'];
                            $values['additionalImageLinks'][$key] = $image['url'];
                            break;
                        endif;
                        $imageData['additionalImage0' . ($key + 1) . ''] = $image['url'];
                        $values['additionalImageLinks'][$key] = $image['url'];
                    endforeach;
                    $product->productImage()->updateOrCreate(['shop_product_variant_id' => $product['id']], $imageData);
                endif;
                if (isset($this->data['fieldsToUpdate']['productPrice'])) :
                    if (isset($variant['price']['amount']) && isset($variant['compareAtPrice']['amount'])) :
                        if ($feedSetting->salePrice) :
                            if (isset($variant['compareAtPrice']['amount'])) :
                                if ($variant['compareAtPrice']['amount'] > $variant['price']['amount']) :
                                    $values['price'] = [
                                        'value' => $variant['compareAtPrice']['amount'],
                                        'currency' => $feedSetting->currency
                                    ];
                                    $values['salePrice'] = [
                                        'value' => $variant['price']['amount'],
                                        'currency' => $feedSetting->currency
                                    ];
                                else :
                                    $values['price'] = [
                                        "value" => $variant['price']['amount'],
                                        'currency' => $feedSetting->currency
                                    ];
                                endif;
                            else :
                                $values['price'] = [
                                    "value" => $variant['price']['amount'],
                                    'currency' => $feedSetting->currency
                                ];
                            endif;
                        else :
                            $values['price'] = [
                                "value" => $variant['price']['amount'],
                                'currency' => $feedSetting->currency
                            ];
                        endif;
                        $toUpdate['salePrice'] = $variant['price']['amount'];
                        $toUpdate['comparePrice'] =
                            $feedSetting->salePrice && $variant['compareAtPrice'] ? $variant['compareAtPrice']['amount'] : '';
                    endif;
                endif;
            endif;
            if ($this->data['fieldsToUpdate']['metafieldResource'] != 'none') :
                if (!empty($this->data['fieldsToUpdate']['metafields'])) :
                    foreach ($this->data['fieldsToUpdate']['metafields'] as $singleMetafield) :
                        if (isset($singleMetafield['key']) && isset($singleMetafield['target'])) :
                            if ($this->data['fieldsToUpdate']['metafieldResource'] == 'product') :
                                $metaArray[0] = $feedSetting->country;
                                $metaArray[1] = strtoupper($feedSetting->language);
                                $metaArray[2] = $product['productId'];
                                $metaArray[3] = explode("|", $singleMetafield['key'])[1];
                                $metaArray[4] = explode("|", $singleMetafield['key'])[0];
                                $meta = $this->shopifyApiStoreFront("productMetafield", $metaArray, ['data', 'product', 'metafield'], $this->user);
                                if (isset($meta['value'])) :
                                    if (Schema::hasColumn('shop_product_variants', $singleMetafield['target'])) :
                                        $toUpdate[$singleMetafield['target']] = $meta['value'];
                                    elseif (Schema::hasColumn('edited_products', $singleMetafield['target'])) :
                                        $editedData['user_id'] = $this->user->id;
                                        $editedData['feed_setting_id'] = $this->data['feedId'];
                                        $editedData['productId'] = $product['productId'];
                                        $editedData['variantId'] = $product['variantId'];
                                        $editedData[$singleMetafield['target']] = $meta['value'];
                                        $product->editedProduct()->updateOrCreate(['shop_product_variant_id' => $product['id']], $editedData);
                                    elseif (Schema::hasColumn('product_labels', $singleMetafield['target'])) :
                                        $labelData['feed_setting_id'] = $this->data['feedId'];
                                        $labelData['variantId'] = $product['variantId'];
                                        $labelData[$singleMetafield['target']] = $meta['value'];
                                        $product->productLabel()->updateOrCreate(['shop_product_variant_id' => $product['id']], $labelData);
                                    endif;
                                    if (json_decode($meta['value']) != null) :
                                        if ($singleMetafield['target'] == 'return_policy_label') :
                                            $values['customAttributes'] = [
                                                "name" => $singleMetafield['target'],
                                                "value" => json_decode($meta['value'])
                                            ];
                                        elseif ($singleMetafield['target'] == 'product_category_id') :
                                            $values['googleProductCategory'] = json_decode($meta['value']);
                                        else :
                                            $values[$singleMetafield['target']] = json_decode($meta['value']);
                                        endif;
                                    else :
                                        if ($singleMetafield['target'] == 'return_policy_label') :
                                            $values['customAttributes'] = [
                                                "name" => $singleMetafield['target'],
                                                "value" => $meta['value']
                                            ];
                                        elseif ($singleMetafield['target'] == 'product_category_id') :
                                            $values['googleProductCategory'] = $meta['value'];
                                        else :
                                            $values[$singleMetafield['target']] = $meta['value'];
                                        endif;
                                    endif;
                                endif;
                            else :
                                $meta = $this->shopifyApiRequest('getVariantMetaFields', $product['variantId'], null, ['body', 'metafields']);
                                foreach ($meta as $field) :
                                    if ($field['namespace'] . "|" . $field['key'] == $singleMetafield['key']) :
                                        if (Schema::hasColumn('shop_product_variants', $singleMetafield['target'])) :
                                            $toUpdate[$singleMetafield['target']] = $field['value'];
                                        elseif (Schema::hasColumn('edited_products', $singleMetafield['target'])) :
                                            $editedData['user_id'] = $this->user->id;
                                            $editedData['feed_setting_id'] = $this->data['feedId'];
                                            $editedData['productId'] = $product['productId'];
                                            $editedData['variantId'] = $product['variantId'];
                                            $editedData[$singleMetafield['target']] = $field['value'];
                                            $product->editedProduct()->updateOrCreate(['shop_product_variant_id' => $product['id']], $editedData);
                                        elseif (Schema::hasColumn('product_labels', $singleMetafield['target'])) :
                                            $labelData['variantId'] = $product['variantId'];
                                            $labelData['feed_setting_id'] = $this->data['feedId'];
                                            $labelData[$singleMetafield['target']] = $field['value'];
                                            $product->productLabel()->updateOrCreate(['shop_product_variant_id' => $product['id']], $labelData);
                                        endif;
                                        if (json_decode($field['value']) != null) :
                                            if ($singleMetafield['target'] == 'return_policy_label') :
                                                $values['customAttributes'] = [
                                                    "name" => $singleMetafield['target'],
                                                    "value" => json_decode($field['value'])
                                                ];
                                            elseif ($singleMetafield['target'] == 'product_category_id') :
                                                $values['googleProductCategory'] = json_decode($field['value']);
                                            else :
                                                $values[$singleMetafield['target']] = json_decode($field['value']);
                                            endif;
                                        else :
                                            if ($singleMetafield['target'] == 'return_policy_label') :
                                                $values['customAttributes'] = [
                                                    "name" => $singleMetafield['target'],
                                                    "value" => $field['value']
                                                ];
                                            elseif ($singleMetafield['target'] == 'product_category_id') :
                                                $values['googleProductCategory'] = $field['value'];
                                            else :
                                                $values[$singleMetafield['target']] = $field['value'];
                                            endif;
                                        endif;
                                    endif;
                                endforeach;
                            endif;
                        endif;
                    endforeach;
                endif;
            endif;
            if (count($values) > 0) :
                $product->update($toUpdate);
                $toUpload[] = [
                    "batchId" => $n,
                    "merchantId" => $feedSetting->merchantAccountId,
                    "method" => "update",
                    "productId" => $product['itemId'],
                    "product" => $values
                ];
            endif;
        endforeach;
        $res = $this->uploadBulkProductsToMerchantAccount(['entries' => $toUpload], $this->user);
    }
}
