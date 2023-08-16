<?php

namespace App\Jobs;

use App\Models\FeedSetting;
use App\Models\ShopProduct;
use Illuminate\Support\Str;
use Illuminate\Bus\Queueable;
use App\Models\ShopProductVariant;
use App\Http\Traits\GoogleApiTrait;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class AddNewProductsJobRest implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, GoogleApiTrait;
    public $timeout = 9000;
    public $tries = 1;
    protected $user;
    protected $data;
    protected $feed;
    protected $productsData;
    protected $toUpload;
    protected $values;
    protected $count;
    protected $productCount;
    protected $planProductsLimit;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($user, $data)
    {
        $this->user = $user;
        $this->data = $data;
        $this->productCount = 0;
        $this->planProductsLimit = [];
    }

    /**
     * Execute the job.
     *
     * @return void
     */

    public function handle()
    {
        $this->count = 1;
        $this->planProductsLimit = $this->calculatePlanLimitations($this->user);
        $this->productCount = $this->user->shop_product_variants_count;
        $this->feed = FeedSetting::where(['id' => $this->data['feedId'], 'user_id' => $this->user->id])->first();
        $productsData = ShopProductVariant::select('productId', 'variantId')->where(['user_id' => $this->user->id, 'feed_setting_id' => $this->feed->id])->get();
        $productIdsLookup = array_flip($productsData->pluck('productId')->all());
        $variantIdsLookup = array_flip($productsData->pluck('variantId')->all());
        if ($this->data['whichProducts'] == 'all') {
            $keys = collect($this->data['resources']);
            $keys->chunk(100)->each(function ($chunk) use ($productIdsLookup, $variantIdsLookup) {
                $this->toUpload = [];
                $productIds = implode(',', $chunk->keys()->toArray());
                $requests =  $this->shopifyApiRequest("getProducts", null, ['limit' => 250, 'ids' => $productIds], null, $this->user);
                $shopifyProducts = collect(json_decode(json_encode($requests['body']['products']), true));
                foreach ($chunk as $key => $resource) {
                    $product = $shopifyProducts->where('id', $key)->first();
                    foreach ($resource as $value) {
                        if (isset($variantIdsLookup[$value]) && isset($productIdsLookup[$key])) {
                            continue;
                        }
                        if (config('shopify-app.billing_enabled')) :
                            if (isset($this->planProductsLimit['skus'])) :
                                if ($this->planProductsLimit['skus'] != 'Unlimited') :
                                    if ($this->productCount >= $this->planProductsLimit['skus']) :
                                        break;
                                    endif;
                                endif;
                            endif;
                        endif;
                        $variant = collect($product['variants'])->where('id', $value)->first();
                        if (isset($product['published_at']) && !empty($product['published_at'])) {
                            if (!empty($product['title']) && !empty($product['body_html']) && isset($product['image']['src']) && !empty($product['image']['src'])) {
                                $this->createFeed($product, $variant);
                            }
                        }
                    }
                }
                $this->uploadBulkProductsToMerchantAccount(['entries' => $this->toUpload], $this->user);
            });
        } elseif ($this->data['whichProducts'] == 'collection') {
            $keys = collect($this->data['resources']);
            $keys->each(function ($chunk) use ($productIdsLookup, $variantIdsLookup) {
                $this->toUpload = [];
                $requests =  $this->shopifyApiRequest("getCollectionProducts", $chunk, ['limit' => 100], null, $this->user);
                $products = json_decode(json_encode($requests['body']['products']), true);
                foreach ($products as $key => $product) {
                    $product['variants'] = $this->shopifyApiRequest("getVariants", $product['id'], ["limit" => 100], ['body', 'variants'], $this->user);
                    if (!empty($product['variants']) && is_array($product['variants'])) {
                        foreach ($product['variants'] as $variant) {
                            if (isset($variantIdsLookup[$variant['id']]) && isset($productIdsLookup[$product['id']])) {
                                continue;
                            }
                            if (config('shopify-app.billing_enabled')) :
                                if (isset($this->planProductsLimit['skus'])) :
                                    if ($this->planProductsLimit['skus'] != 'Unlimited') :
                                        if ($this->productCount >= $this->planProductsLimit['skus']) :
                                            break;
                                        endif;
                                    endif;
                                endif;
                            endif;
                            if (isset($product['published_at']) && !empty($product['published_at'])) {
                                if (!empty($product['title']) && !empty($product['body_html']) && isset($product['image']['src']) && !empty($product['image']['src'])) {
                                    $this->createFeed($product, $variant);
                                }
                            }
                        }
                    }
                }
                $this->uploadBulkProductsToMerchantAccount(['entries' => $this->toUpload], $this->user);
                while (isset($requests['link']['next'])) {
                    $this->toUpload = [];
                    $requests =  $this->shopifyApiRequest("getCollectionProducts", $chunk, ['limit' => 100, 'page_info' => $requests['link']['next']], null, $this->user);
                    if (isset($requests['body']['products'])) {
                        $products = json_decode(json_encode($requests['body']['products']), true);
                        foreach ($products as $key => $product) {
                            $product['variants'] = $this->shopifyApiRequest("getVariants", $product['id'], ["limit" => 100], ['body', 'variants'], $this->user);
                            foreach ($product['variants'] as $variant) {
                                if (isset($variantIdsLookup[$variant['id']]) && isset($productIdsLookup[$product['id']])) {
                                    continue;
                                }
                                if (config('shopify-app.billing_enabled')) :
                                    if (isset($this->planProductsLimit['skus'])) :
                                        if ($this->planProductsLimit['skus'] != 'Unlimited') :
                                            if ($this->productCount >= $this->planProductsLimit['skus']) :
                                                break;
                                            endif;
                                        endif;
                                    endif;
                                endif;
                                if (isset($product['published_at']) && !empty($product['published_at'])) {
                                    if (!empty($product['title']) && !empty($product['body_html']) && isset($product['image']['src']) && !empty($product['image']['src'])) {
                                        $this->createFeed($product, $variant);
                                    }
                                }
                            }
                        }
                        $this->uploadBulkProductsToMerchantAccount(['entries' => $this->toUpload], $this->user);
                    }
                }
            });
        }
    }

    // public function handle()
    // {
    //     $this->count = 1;
    //     $this->planProductsLimit = $this->calculatePlanLimitations($this->user);
    //     $this->productCount = $this->user->shop_product_variants_count;
    //     $this->feed = FeedSetting::where(['id' => $this->data['feedId'], 'user_id' => $this->user->id])->first();
    //     $this->productsData = ShopProductVariant::select('productId', 'variantId')->where(['user_id' => $this->user->id, 'feed_setting_id' => $this->feed->id])->get();
    //     $productIds = $this->productsData->pluck('productId')->toArray();
    //     $variantIds = $this->productsData->pluck('variantId')->toArray();
    //     if ($this->data['whichProducts'] == 'all') :
    //         foreach ($this->data['resources'] as $key => $resource) :
    //             $product = $this->shopifyApiRequest("getProductById", $key, null, null, $this->user);
    //             foreach ($resource as $value) :
    //                 if (in_array($value, $variantIds) && in_array($key, $productIds)) :
    //                     continue;
    //                 endif;
    //                 if (config('shopify-app.billing_enabled')) :
    //                     if (isset($this->planProductsLimit['skus'])) :
    //                         if ($this->planProductsLimit['skus'] != 'Unlimited') :
    //                             if ($this->productCount >= $this->planProductsLimit['skus']) :
    //                                 break;
    //                             endif;
    //                         endif;
    //                     endif;
    //                 endif;
    //                 $variant = collect($product['body']['product']['variants'])->where('id', $value)->first();
    //                 if ($product['body']['product']['published_at']) :
    //                     if (!empty($product['body']['product']['title']) && !empty($product['body']['product']['body_html']) && isset($product['body']['product']['image']['src']) && !empty($product['body']['product']['image']['src'])) :
    //                         $this->createFeed($product['body']['product'], $variant);
    //                     endif;
    //                 endif;
    //             endforeach;
    //         endforeach;
    //     elseif ($this->data['whichProducts'] == 'collection') :
    //         $limit = $this->feed->variantSubmission == 'all' ? 100 : 250;
    //         for ($i = 0; $i < count($this->data['resources']); $i++) {
    //             $requests =  $this->shopifyApiRequest("getCollectionProducts", $this->data['resources'][$i], ['limit' => $limit], null, $this->user);
    //             $products = json_decode(json_encode($requests['body']['products']), true);
    //             for ($j = 0; $j < count($products); $j++) {
    //                 $products[$j]['variants'] = $this->shopifyApiRequest("getVariants", $products[$j]['id'], ["limit" => 100], ['body', 'variants'], $this->user);
    //                 foreach ($products[$j]['variants'] as $variant) {
    //                     if (in_array($variant['id'], $variantIds) && in_array($products[$j]['id'], $productIds)) :
    //                         continue;
    //                     endif;
    //                     if (config('shopify-app.billing_enabled')) :
    //                         if (isset($this->planProductsLimit['skus'])) :
    //                             if ($this->planProductsLimit['skus'] != 'Unlimited') :
    //                                 if ($this->productCount >= $this->planProductsLimit['skus']) :
    //                                     break;
    //                                 endif;
    //                             endif;
    //                         endif;
    //                     endif;
    //                     if ($products[$j]['published_at']) :
    //                         if (!empty($products[$j]['title']) && !empty($products[$j]['body_html']) && isset($products[$j]['image']['src']) && !empty($products[$j]['image']['src'])) :
    //                             $this->createFeed($products[$j], $variant);
    //                         endif;
    //                     endif;
    //                 }
    //             }
    //             while (isset($requests['link']['next'])) {
    //                 $requests =  $this->shopifyApiRequest("getCollectionProducts", $this->data['resources'][$i], ['limit' => $limit, 'page_info' => $requests['link']['next']], null, $this->user);
    //                 if (isset($requests['body']['products'])) {
    //                     $products = json_decode(json_encode($requests['body']['products']), true);
    //                     for ($k = 0; $k < count($products); $k++) {
    //                         $products[$k]['variants'] = $this->shopifyApiRequest("getVariants", $products[$k]['id'], ["limit" => 100], ['body', 'variants'], $this->user);
    //                         foreach ($products[$k]['variants'] as $variant) {
    //                             if (in_array($variant['id'], $variantIds) && in_array($products[$k]['id'], $productIds)) :
    //                                 continue;
    //                             endif;
    //                             if (config('shopify-app.billing_enabled')) :
    //                                 if (isset($this->planProductsLimit['skus'])) :
    //                                     if ($this->planProductsLimit['skus'] != 'Unlimited') :
    //                                         if ($this->productCount >= $this->planProductsLimit['skus']) :
    //                                             break;
    //                                         endif;
    //                                     endif;
    //                                 endif;
    //                             endif;
    //                             if ($products[$k]['published_at']) :
    //                                 if (!empty($products[$k]['title']) && !empty($products[$k]['body_html']) && isset($products[$k]['image']['src']) && !empty($products[$k]['image']['src'])) :
    //                                     $this->createFeed($products[$k], $variant);
    //                                 endif;
    //                             endif;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     endif;
    //     $this->uploadBulkProductsToMerchantAccount(['entries' => $this->toUpload], $this->user);
    // }

    public function createFeed($product, $variant)
    {
        $single = [];
        $createVariant = [];
        $this->values = [];
        $translatedAttributes = config('languageAttributes.' . $this->feed->language);
        $varTitle = strpos($variant['title'], 'Default Title') !== false ? $product['title'] : $product['title'] . "/" . $variant['title'];
        $description = $product['body_html'] ? Str::limit($product['body_html'], 4990, '(...)') : '';
        $img = $variant['image_id'] != null ? collect($product['images'])->where('id', $variant['image_id'])->first() : $product['image'];

        $this->values = [
            'channel' => $this->feed->channel,
            "targetCountry" => $this->feed->country,
            "feedLabel" => $this->feed->country,
            "contentLanguage" => $this->feed->language,
            "adult" => false,
            "brand" => $this->feed->brandSubmission == 'vendor' ? $product['vendor'] : $this->user->settings->domain,
            "itemGroupId" => $product['id'],
            'gender' => $this->feed->gender,
            'condition' => $this->feed->productCondition,
            'ageGroup' => $this->feed->ageGroup,
            'description' => $description,
            'canonicalLink' => "https://" . $this->user->settings->domain . "/collections/all/products/" . $product['handle'],
        ];

        if (isset($product['product_type'])) :
            if ($product['product_type']) :
                $this->values['productTypes'] = [$product['product_type']];
            endif;
        endif;

        if ($this->feed->product_category_id) :
            $this->values['googleProductCategory'] = $this->feed->category->value;
        endif;

        if ($this->feed->shipping == 'auto') :
            $this->values['shippingLabel'] = config('googleApi.strings.AutomaticShippingLabel');
            $this->values['shipping'] = [
                'price' => [
                    "value" => 0,
                    'currency' => $this->feed->currency
                ],
                'country' => $this->feed->country
            ];
        endif;

        if ($this->feed->productIdFormat == "global") :
            $this->values['id'] = "shopify_" . $this->feed->country . "_" . $product['id'] . "_" . $variant["id"];
        elseif ($this->feed->productIdFormat == "sku") :
            $this->values['id'] = $variant['sku'];
        else :
            $this->values['id'] = $variant['id'];
        endif;

        $createVariant = [
            'user_id' => $this->user->id,
            'feed_setting_id' => $this->feed->id,
            'productId' => $product['id'],
            'variantId' => $variant['id'],
            'itemId' => $this->feed->channel . ":" . $this->feed->language . ":" . $this->feed->country . ":" . $this->values['id'],
            'title' => $varTitle,
            'description' => $description,
            'handle' => $product['handle'] ?? '',
            'image' => $img['src'] ?? '',
            'product_category_id' => $this->feed->product_category_id,
            'productTypes' => $product['product_type'] ? $product['product_type'] : null,
            'brand' => $this->feed->brandSubmission == 'vendor' ? $product['vendor'] : $this->user->settings->domain,
            'barcode' => $variant['barcode'],
            'sku' => $variant['sku'],
            'quantity' => $variant['inventory_quantity'] ?? 0,
            'ageGroup' => $this->feed->ageGroup,
            'gender' => $this->feed->gender,
            'productCondition' => $this->feed->productCondition,
            'score' => $this->scoreProduct($variant, $product, $this->feed),
            'salePrice' => $variant['price'],
            'comparePrice' => $variant['compare_at_price'] ?? '',
            'editedProduct' => [
                'user_id' => $this->user->id,
                'feed_setting_id' => $this->feed->id,
                'productId' => $product['id'],
                'variantId' => $variant['id'],
                'identifierExists' => $this->feed->productIdentifiers,
            ],
            'productImage' => [
                'productId' => $product['id'],
                'variantId' => $variant['id'],
            ]
        ];

        $this->values['availability'] = "out of stock";
        if ($product['published_at']) :
            if (isset($variant['inventory_quantity'])) :
                $this->values['availability'] = $variant['inventory_quantity'] > 0 ? "in stock" : "out of stock";
                $createVariant['editedProduct']['availability'] = $variant['inventory_quantity'] > 0 ? "in_stock" : "out_of_stock";
            endif;
        endif;

        $utmSource = $this->feed->utm_source != null ? '&utm_source=' . $this->feed->utm_source : '&utm_source=Google';
        $utmMedium = $this->feed->utm_medium != null ? '&utm_medium=' . $this->feed->utm_medium : '&utm_medium=Shopping%20Ads';
        $utmCampaign = $this->feed->utm_campaign != null ? '&utm_campaign=' . $this->feed->utm_campaign : '&utm_campaign=EasyFeed';
        $this->values['link'] = "https://" . $this->user->settings->domain . "/collections/all/products/" . $product['handle'] . "?variant=" . $variant['id'] . $utmSource . $utmMedium . $utmCampaign;
        $this->values['imageLink'] = $img['src'] ?? '';
        if ($this->feed->salePrice) :
            if ($variant['compare_at_price']) :
                if ($variant['compare_at_price'] > $variant['price']) :
                    $this->values['price'] = [
                        'value' => $variant['compare_at_price'],
                        'currency' => $this->feed->currency
                    ];
                    $this->values['salePrice'] = [
                        'value' => $variant['price'],
                        'currency' => $this->feed->currency
                    ];
                else :
                    $this->values['price'] = [
                        "value" => $variant['price'],
                        'currency' => $this->feed->currency
                    ];
                endif;
            else :
                $this->values['price'] = [
                    "value" => $variant['price'],
                    'currency' => $this->feed->currency
                ];
            endif;
        else :
            $this->values['price'] = [
                "value" => $variant['price'],
                'currency' => $this->feed->currency
            ];
        endif;

        if ($this->feed->productIdentifiers == 'allIdentifiers' || $this->feed->productIdentifiers == 'brandMPN') :
            $this->values['identifier_exists'] = true;
        endif;
        $this->values['offerId'] =  $this->values['id'];
        $this->values['mpn'] = $variant['sku'];
        if (!empty($variant['weight']) && !empty($variant['weight_unit'])) :
            $this->values['shippingWeight'] = [
                "value" => $variant['weight'],
                "unit" => $variant['weight_unit']
            ];
            $createVariant['editedProduct']['shippingWeight'] = json_encode([
                "value" => $variant['weight'],
                "unit" => $variant['weight_unit']
            ]);
        endif;
        if ($variant['barcode'] && $this->feed->barcode) :
            $this->values['gtin'] = $variant['barcode'];
        endif;
        if ($this->feed->additionalImages) :
            foreach ($product['images'] as $key => $image) :
                if ($key == 9) :
                    $createVariant['productImage']['additionalImage' . ($key + 1) . ''] = $image['src'];
                    $this->values['additionalImageLinks'][$key] = $image['src'];
                    break;
                endif;
                $createVariant['productImage']['additionalImage0' . ($key + 1) . ''] = $image['src'];
                $this->values['additionalImageLinks'][$key] = $image['src'];
            endforeach;
        endif;
        if ($this->feed->language == "en") :
            for ($i = 0; $i < count($product['options']); $i++) :
                if ($variant['option' . ($i + 1)]) :
                    if (str_contains(strtolower($product['options'][$i]['name']), 'color') || str_contains(strtolower($product['options'][$i]['name']), 'colour')) :
                        $createVariant['editedProduct']['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                        $this->values['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                    elseif (str_contains(strtolower($product['options'][$i]['name']), 'size')) :
                        $createVariant['editedProduct']['sizes'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                        $this->values['sizes'] = [Str::limit($variant['option' . ($i + 1)], '95', '...')];
                    elseif (str_contains(strtolower($product['options'][$i]['name']), 'material')) :
                        $createVariant['editedProduct']['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                        $this->values['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                    elseif (str_contains(strtolower($product['options'][$i]['name']), 'pattern')) :
                        $createVariant['editedProduct']['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                        $this->values['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                    endif;
                endif;
            endfor;
        else :
            if (isset($translatedAttributes['color'])) :
                $colorValues = $translatedAttributes['color'];
                $sizeValues = $translatedAttributes['size'];
                $materialValues = $translatedAttributes['material'];
                $patternValues = $translatedAttributes['pattern'];
                for ($i = 0; $i < count($product['options']); $i++) :
                    if ($variant['option' . ($i + 1)]) :
                        $colorMatch = array_reduce($colorValues, function ($carry, $value) use ($product, $i) {
                            return $carry || str_contains(strtolower($product['options'][$i]['name']), strtolower($value));
                        }, false);
                        $sizeMatch = array_reduce($sizeValues, function ($carry, $value) use ($product, $i) {
                            return $carry || str_contains(strtolower($product['options'][$i]['name']), strtolower($value));
                        }, false);
                        $materialMatch = array_reduce($materialValues, function ($carry, $value) use ($product, $i) {
                            return $carry || str_contains(strtolower($product['options'][$i]['name']), strtolower($value));
                        }, false);
                        $patternMatch = array_reduce($patternValues, function ($carry, $value) use ($product, $i) {
                            return $carry || str_contains(strtolower($product['options'][$i]['name']), strtolower($value));
                        }, false);

                        if ($colorMatch) {
                            $createVariant['editedProduct']['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                            $this->values['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                        }
                        if ($sizeMatch) {
                            $createVariant['editedProduct']['sizes'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                            $this->values['sizes'] = [Str::limit($variant['option' . ($i + 1)], '95', '...')];
                        }
                        if ($materialMatch) {
                            $createVariant['editedProduct']['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                            $this->values['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                        }
                        if ($patternMatch) {
                            $createVariant['editedProduct']['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                            $this->values['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                        }
                    endif;
                endfor;
            endif;
        endif;

        $productExist = ShopProduct::where([
            'productId' => $product['id'],
            'feed_setting_id' => $this->feed->id,
        ])->first();
        if ($productExist) :
            $createVariant['shop_product_id'] = $productExist['id'];
            new ShopProductVariant($createVariant);
        else :
            $single = [
                'user_id' => $this->user->id,
                'feed_setting_id' => $this->feed->id,
                'productId' => $product['id'],
            ];
            $single['variants'][] = $createVariant;
            new ShopProduct($single);
        endif;

        $this->toUpload[] = [
            "batchId" => $this->count,
            "merchantId" => $this->feed->merchantAccountId,
            "method" => "insert",
            "product" => $this->values
        ];
        $this->count++;
        $this->productCount++;
    }
}
