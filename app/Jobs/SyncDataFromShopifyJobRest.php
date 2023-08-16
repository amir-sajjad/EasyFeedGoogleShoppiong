<?php

namespace App\Jobs;

use App\Models\FeedSetting;
use Illuminate\Support\Str;
use App\Models\ProductLabel;
use App\Models\EditedProduct;
use Illuminate\Bus\Queueable;
use App\Models\ShopProductImage;
use App\Models\ShopProductVariant;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\GoogleApiTrait;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Schema;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class SyncDataFromShopifyJobRest implements ShouldQueue
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
        $feedSetting = FeedSetting::select(['id', 'merchantAccountId', 'productIdFormat', 'language', 'country', 'currency', 'channel', 'salePrice'])->where('id', $this->data['feedId'])->first();
        $fieldsToUpdate = $this->data['fieldsToUpdate'];
        $merchantId = $feedSetting->merchantAccountId;
        $productTableColumns = Schema::getColumnListing('shop_product_variants');
        $editedProductTableColumns = Schema::getColumnListing('edited_products');
        $productLabelTableColumns = Schema::getColumnListing('product_labels');
        $toUpload = [];
        $chunks = $products->chunk(250);
        foreach ($chunks as $chunk) {
            $ids = $chunk->pluck('productId')->toArray();
            $implodedIds = implode(',', $ids);
            $requests =  $this->shopifyApiRequest("getProducts", null, ['limit' => 250, 'ids' => $implodedIds], null, $this->user);
            // info(json_encode($requests));
            if (isset($requests['body']['products'])) {
                $shopifyProducts = json_decode(json_encode($requests['body']['products']), true);
                collect($shopifyProducts)->each(function ($shopifyProduct, $key) use ($feedSetting, $merchantId, $productLabelTableColumns, $productTableColumns, $editedProductTableColumns, $fieldsToUpdate, $chunk, &$toUpload) {
                    $databaseValues = [];
                    $feedValues = [];
                    $product = $chunk->where('productId', $shopifyProduct['id'])->first();
                    $variant = collect($shopifyProduct['variants'])->where('id', $product['variantId'])->first();
                    // info(json_encode($variant));
                    if (!empty($fieldsToUpdate)) {
                        if (isset($fieldsToUpdate['title']) || isset($fieldsToUpdate['seoTitle'])) {
                            $varTitle = strpos($variant['title'], 'Default Title') !== false ? $shopifyProduct['title'] : $shopifyProduct['title'] . "/" . $variant['title'];
                            $databaseValues['shopProduct']['title'] = $varTitle;
                            $feedValues['title'] = $varTitle;
                        }
                        if (isset($fieldsToUpdate['description']) || isset($fieldsToUpdate['seoDescription'])) {
                            $description = $shopifyProduct['body_html'] ? Str::limit($shopifyProduct['body_html'], 4990, '(...)') : '';
                            $databaseValues['shopProduct']['description'] = $description;
                            $feedValues['description'] = $description;
                        }
                        if (isset($fieldsToUpdate['productImages'])) {
                            $img = $variant['image_id'] != null ? collect($shopifyProduct['images'])->where('id', $variant['image_id'])->first() : $shopifyProduct['image'];
                            $databaseValues['shopProduct']['image'] = $img['src'];
                            $feedValues['imageLink'] = $img['src'];
                        }
                        if (isset($fieldsToUpdate['productImages'])) {
                            $imageUrls = collect($shopifyProduct['images'])->take(10)->map(function ($image, $index) use (&$databaseValues) {
                                $imageUrl = $image['src'];
                                $key = 'additionalImage' . sprintf('%02d', $index + 1);
                                $databaseValues['shopProductImages'][$key] = $imageUrl;
                                return $imageUrl;
                            })->toArray();
                            $feedValues['additionalImageLinks'] = $imageUrls;
                            $databaseValues['shopProductImages']['productId'] = $shopifyProduct['id'];
                            $databaseValues['shopProductImages']['variantId'] = $variant['id'];
                            $product->productImage()->updateOrCreate(['shop_product_variant_id' => $product['id']], $databaseValues['shopProductImages']);
                        }
                        if (isset($fieldsToUpdate['productPrice'])) {
                            if ($feedSetting->salePrice) :
                                if ($variant['compare_at_price']) :
                                    if ($variant['compare_at_price'] > $variant['price']) :
                                        $feedValues['price'] = [
                                            'value' => $variant['compare_at_price'],
                                            'currency' => $feedSetting->currency
                                        ];
                                        $feedValues['salePrice'] = [
                                            'value' => $variant['price'],
                                            'currency' => $feedSetting->currency
                                        ];
                                    else :
                                        $feedValues['price'] = [
                                            "value" => $variant['price'],
                                            'currency' => $feedSetting->currency
                                        ];
                                    endif;
                                else :
                                    $feedValues['price'] = [
                                        "value" => $variant['price'],
                                        'currency' => $feedSetting->currency
                                    ];
                                endif;
                            else :
                                $feedValues['price'] = [
                                    "value" => $variant['price'],
                                    'currency' => $feedSetting->currency
                                ];
                            endif;
                            $databaseValues['shopProduct']['salePrice'] = $variant['price'];
                            $databaseValues['shopProduct']['comparePrice'] = $feedSetting->salePrice && $variant['compare_at_price'] ? $variant['compare_at_price'] : '';
                        }
                    }
                    if ($fieldsToUpdate['metafieldResource'] != 'none') {
                        if (!empty($fieldsToUpdate['metafields'])) {
                            if ($fieldsToUpdate['metafieldResource'] == 'product') {
                                $meta = $this->shopifyApiRequest('getProductMetaFields', $product['productId'], null, ['body', 'metafields']);
                            } elseif ($fieldsToUpdate['metafieldResource'] == 'variant') {
                                $meta = $this->shopifyApiRequest('getVariantMetaFields', $product['variantId'], null, ['body', 'metafields']);
                            }
                            if (isset($meta[0])) {
                                collect($fieldsToUpdate['metafields'])->each(function ($singleMetafield, $m) use (&$meta, &$productTableColumns, &$editedProductTableColumns, &$productLabelTableColumns, &$databaseValues, &$feedValues) {
                                    if (isset($singleMetafield['key']) && isset($singleMetafield['target'])) {
                                        $newMeta = array_filter(json_decode(json_encode($meta), true), function ($field) use ($singleMetafield) {
                                            return $field['namespace'] . "|" . $field['key'] == $singleMetafield['key'];
                                        });
                                        $newMeta = array_values($newMeta);
                                        if (isset($newMeta[0])) {
                                            $field = $newMeta[0];
                                            if (in_array($singleMetafield['target'], $productTableColumns)) {
                                                $databaseValues['shopProduct'][$singleMetafield['target']] = $field['value'];
                                            } elseif (in_array($singleMetafield['target'], $productLabelTableColumns)) {
                                                $databaseValues['productLabel'][$singleMetafield['target']] = $field['value'];
                                            } elseif (in_array($singleMetafield['target'], $editedProductTableColumns)) {
                                                $databaseValues['editedProduct'][$singleMetafield['target']] = $field['value'];
                                            }
                                            $decodedValue = json_decode($field['value']);
                                            if ($decodedValue) {
                                                if ($singleMetafield['target'] == 'product_category_id') {
                                                    $feedValues['googleProductCategory'] = $decodedValue;
                                                } else {
                                                    $feedValues[$singleMetafield['target']] = $decodedValue;
                                                }
                                            } else {
                                                if ($singleMetafield['target'] == 'product_category_id') {
                                                    $feedValues['googleProductCategory'] = $field['value'];
                                                } else {
                                                    $feedValues[$singleMetafield['target']] = $field['value'];
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                    if (isset($databaseValues['shopProduct'])) {
                        $product->update($databaseValues['shopProduct']);
                    }
                    if (isset($databaseValues['productLabel']) && isset($databaseValues['productLabel'])) {
                        $databaseValues['productLabel']['shop_product_variant_id'] = $product['id'];
                        $databaseValues['productLabel']['feed_setting_id'] = $feedSetting['id'];
                        $databaseValues['productLabel']['variantId'] = $variant['id'];
                        $product->productLabel()->updateOrCreate(['shop_product_variant_id' => $product['id']], $databaseValues['productLabel']);
                    }
                    if (isset($databaseValues['editedProduct']) && isset($databaseValues['editedProduct'])) {
                        $databaseValues['editedProduct']['shop_product_variant_id'] = $product['id'];
                        $databaseValues['editedProduct']['user_id'] = $this->user->id;
                        $databaseValues['editedProduct']['feed_setting_id'] = $feedSetting['id'];
                        $databaseValues['editedProduct']['productId'] = $shopifyProduct['id'];
                        $databaseValues['editedProduct']['variantId'] = $variant['id'];
                        $product->editedProduct()->updateOrCreate(['shop_product_variant_id' => $product['id']], $databaseValues['editedProduct']);
                    }
                    if (count($feedValues) > 0) :
                        $toUpload[] = [
                            "batchId" => $key,
                            "merchantId" => $merchantId,
                            "method" => "update",
                            "productId" => $product['itemId'],
                            "product" => $feedValues
                        ];
                    endif;
                });
            }
        }
        $res = $this->uploadBulkProductsToMerchantAccount(['entries' => $toUpload], $this->user);
    }
}
