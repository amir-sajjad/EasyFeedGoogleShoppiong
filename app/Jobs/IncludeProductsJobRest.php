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

class IncludeProductsJobRest implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, GoogleApiTrait;
    protected $user;
    protected $data;
    protected $feed;
    protected $toUpload;
    protected $values;
    protected $productCount;
    protected $planProductsLimit;
    protected $count;
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
        $products = $this->data['products'];
        $this->feed = FeedSetting::where('id', $this->data['feedId'])->first();
        $chunks = $products->chunk(250);
        foreach ($chunks as $chunk) {
            $this->toUpload = [];
            $ids = $chunk->pluck('productId')->toArray();
            $implodedIds = implode(',', $ids);
            $requests =  $this->shopifyApiRequest("getProducts", null, ['limit' => 250, 'ids' => $implodedIds], null, $this->user);
            $shopifyProducts = json_decode(json_encode($requests['body']['products']), true);
            $this->createFeedFunction($shopifyProducts, $chunk);
            $this->uploadBulkProductsToMerchantAccount(['entries' => $this->toUpload], $this->user);
            $chunk->each->delete();
        }
    }

    public function createFeedFunction($shopifyProducts, $dbProducts)
    {
        $translatedAttributes = config('languageAttributes.' . $this->feed->language);
        foreach ($dbProducts as $key => $dbProduct) {
            $shopifyProduct = collect($shopifyProducts)->where('id', $dbProduct['productId'])->first();
            if ($shopifyProduct['published_at']) :
                if (config('shopify-app.billing_enabled')) :
                    if (isset($this->planProductsLimit['skus'])) :
                        if ($this->planProductsLimit['skus'] != 'Unlimited') :
                            if ($this->productCount >= $this->planProductsLimit['skus']) :
                                break;
                            endif;
                        endif;
                    endif;
                endif;
                $databaseValues = [];
                $feedValues = [];
                $variant = collect($shopifyProduct['variants'])->where('id', $dbProduct['variantId'])->first();
                $varTitle = strpos($variant['title'], 'Default Title') !== false ? $shopifyProduct['title'] : $shopifyProduct['title'] . "/" . $variant['title'];
                $description = $shopifyProduct['body_html'] ? Str::limit($shopifyProduct['body_html'], 4990, '(...)') : '';
                $img = $variant['image_id'] != null ? collect($shopifyProduct['images'])->where('id', $variant['image_id'])->first() : $shopifyProduct['image'];

                $feedValues = [
                    'channel' => $this->feed->channel,
                    "targetCountry" => $this->feed->country,
                    "feedLabel" => $this->feed->country,
                    "contentLanguage" => $this->feed->language,
                    "adult" => false,
                    "brand" => $this->feed->brandSubmission == 'vendor' ? $shopifyProduct['vendor'] : $this->user->settings->domain,
                    "itemGroupId" => $shopifyProduct['id'],
                ];

                if ($this->feed->productIdFormat == "global") :
                    $feedValues['id'] = "shopify_" . $this->feed->country . "_" . $shopifyProduct['id'] . "_" . $variant["id"];
                elseif ($this->feed->productIdFormat == "sku") :
                    $feedValues['id'] = $variant['sku'];
                else :
                    $feedValues['id'] = $variant['id'];
                endif;

                $databaseValues = [
                    'user_id' => $this->user->id,
                    'feed_setting_id' => $this->feed->id,
                    'productId' => $shopifyProduct['id'],
                    'variantId' => $variant['id'],
                    'itemId' => $this->feed->channel . ":" . $this->feed->language . ":" . $this->feed->country . ":" . $feedValues['id'],
                    'title' => $varTitle,
                    'description' => $description,
                    'handle' => $shopifyProduct['handle'] ?? '',
                    'image' => $img['src'],
                    'product_category_id' => $this->feed->product_category_id,
                    'productTypes' => $shopifyProduct['product_type'] ? $shopifyProduct['product_type'] : null,
                    'brand' => $this->feed->brandSubmission == 'vendor' ? $shopifyProduct['vendor'] : $this->user->settings->domain,
                    'barcode' => $variant['barcode'],
                    'sku' => $variant['sku'],
                    'ageGroup' => $this->feed->ageGroup,
                    'gender' => $this->feed->gender,
                    'productCondition' => $this->feed->productCondition,
                    'score' => $this->scoreProduct($variant, $shopifyProduct, $this->feed),
                    'salePrice' => $variant['price'],
                    'comparePrice' => $variant['compare_at_price'] ?? '',
                    'editedProduct' => [
                        'user_id' => $this->user->id,
                        'feed_setting_id' => $this->feed->id,
                        'productId' => $shopifyProduct['id'],
                        'variantId' => $variant['id'],
                        'identifierExists' => $this->feed->productIdentifiers,
                    ],
                    'productImage' => [
                        'productId' => $shopifyProduct['id'],
                        'variantId' => $variant['id'],
                    ]
                ];

                if ($this->feed->additionalImages) {
                    $imageUrls = collect($shopifyProduct['images'])->take(10)->map(function ($image, $index) use (&$databaseValues) {
                        $imageUrl = $image['src'];
                        $key = 'additionalImage' . sprintf('%02d', $index + 1);
                        $databaseValues['productImage'][$key] = $imageUrl;
                        return $imageUrl;
                    })->toArray();
                    $feedValues['additionalImageLinks'] = $imageUrls;
                }
                if (isset($shopifyProduct['product_type'])) :
                    if ($shopifyProduct['product_type']) :
                        $feedValues['productTypes'] = [$shopifyProduct['product_type']];
                    endif;
                endif;
                if ($this->feed->product_category_id) :
                    $feedValues['googleProductCategory'] = $this->feed->category->value;
                endif;
                if ($this->feed->shipping == 'auto') :
                    $feedValues['shippingLabel'] = config('googleApi.strings.AutomaticShippingLabel');
                    $feedValues['shipping'] = [
                        'price' => [
                            "value" => 0,
                            'currency' => $this->feed->currency
                        ],
                        'country' => $this->feed->country
                    ];
                endif;

                $feedValues['gender'] = $this->feed->gender;
                $feedValues['condition'] = $this->feed->productCondition;
                $feedValues['ageGroup'] = $this->feed->ageGroup;
                $feedValues['title'] = $varTitle;
                $feedValues['description'] = $description;
                $feedValues['canonicalLink'] = "https://" . $this->user->settings->domain . "/collections/all/products/" . $shopifyProduct['handle'];

                $this->values['availability'] = "out of stock";
                if ($shopifyProduct['published_at']) :
                    if (isset($variant['inventory_quantity'])) :
                        $this->values['availability'] = $variant['inventory_quantity'] > 0 ? "in stock" : "out of stock";
                        $databaseValues['editedProduct']['availability'] = $variant['inventory_quantity'] > 0 ? "in_stock" : "out_of_stock";
                    endif;
                endif;

                $utmSource = $this->feed->utm_source != null ? '&utm_source=' . $this->feed->utm_source : '&utm_source=Google';
                $utmMedium = $this->feed->utm_medium != null ? '&utm_medium=' . $this->feed->utm_medium : '&utm_medium=Shopping%20Ads';
                $utmCampaign = $this->feed->utm_campaign != null ? '&utm_campaign=' . $this->feed->utm_campaign : '&utm_campaign=EasyFeed';
                $feedValues['link'] = "https://" . $this->user->settings->domain . "/collections/all/products/" . $shopifyProduct['handle'] . "?variant=" . $variant['id'] . $utmSource . $utmMedium . $utmCampaign;

                $feedValues['imageLink'] = $img['src'];

                if ($this->feed->salePrice) :
                    if ($variant['compare_at_price']) :
                        if ($variant['compare_at_price'] > $variant['price']) :
                            $feedValues['price'] = [
                                'value' => $variant['compare_at_price'],
                                'currency' => $this->feed->currency
                            ];
                            $feedValues['salePrice'] = [
                                'value' => $variant['price'],
                                'currency' => $this->feed->currency
                            ];
                        else :
                            $feedValues['price'] = [
                                "value" => $variant['price'],
                                'currency' => $this->feed->currency
                            ];
                        endif;
                    else :
                        $feedValues['price'] = [
                            "value" => $variant['price'],
                            'currency' => $this->feed->currency
                        ];
                    endif;
                else :
                    $feedValues['price'] = [
                        "value" => $variant['price'],
                        'currency' => $this->feed->currency
                    ];
                endif;

                if ($this->feed->productIdentifiers) :
                    $feedValues['identifier_exists'] = $this->feed->productIdentifiers;
                endif;
                $feedValues['offerId'] =  $feedValues['id'];
                $feedValues['mpn'] = $variant['sku'];

                if (!empty($variant['weight']) && !empty($variant['weight_unit'])) :
                    $feedValues['shippingWeight'] = [
                        "value" => $variant['weight'],
                        "unit" => $variant['weight_unit'],
                    ];
                    $databaseValues['editedProduct']['shippingWeight'] = json_encode([
                        "value" => $variant['weight'],
                        "unit" => $variant['weight_unit'],
                    ]);
                endif;

                if ($variant['barcode'] && $this->feed->barcode) :
                    $feedValues['gtin'] = $variant['barcode'];
                endif;
                if ($this->feed->language == "en") :
                    for ($i = 0; $i < count($shopifyProduct['options']); $i++) :
                        if ($variant['option' . ($i + 1)]) :
                            if (str_contains(strtolower($shopifyProduct['options'][$i]['name']), 'color') || str_contains(strtolower($shopifyProduct['options'][$i]['name']), 'colour')) :
                                $databaseValues['editedProduct']['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                $feedValues['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                            elseif (str_contains(strtolower($shopifyProduct['options'][$i]['name']), 'size')) :
                                $databaseValues['editedProduct']['sizes'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                $feedValues['sizes'] = [Str::limit($variant['option' . ($i + 1)], '95', '...')];
                            elseif (str_contains(strtolower($shopifyProduct['options'][$i]['name']), 'material')) :
                                $databaseValues['editedProduct']['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                $feedValues['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                            elseif (str_contains(strtolower($shopifyProduct['options'][$i]['name']), 'pattern')) :
                                $databaseValues['editedProduct']['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                $feedValues['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                            endif;
                        endif;
                    endfor;
                else :
                    if (isset($translatedAttributes['color'])) :
                        $colorValues = $translatedAttributes['color'];
                        $sizeValues = $translatedAttributes['size'];
                        $materialValues = $translatedAttributes['material'];
                        $patternValues = $translatedAttributes['pattern'];
                        for ($i = 0; $i < count($shopifyProduct['options']); $i++) :
                            if ($variant['option' . ($i + 1)]) :
                                $colorMatch = array_reduce($colorValues, function ($carry, $value) use ($shopifyProduct, $i) {
                                    return $carry || str_contains(strtolower($shopifyProduct['options'][$i]['name']), strtolower($value));
                                }, false);
                                $sizeMatch = array_reduce($sizeValues, function ($carry, $value) use ($shopifyProduct, $i) {
                                    return $carry || str_contains(strtolower($shopifyProduct['options'][$i]['name']), strtolower($value));
                                }, false);
                                $materialMatch = array_reduce($materialValues, function ($carry, $value) use ($shopifyProduct, $i) {
                                    return $carry || str_contains(strtolower($shopifyProduct['options'][$i]['name']), strtolower($value));
                                }, false);
                                $patternMatch = array_reduce($patternValues, function ($carry, $value) use ($shopifyProduct, $i) {
                                    return $carry || str_contains(strtolower($shopifyProduct['options'][$i]['name']), strtolower($value));
                                }, false);

                                if ($colorMatch) {
                                    $databaseValues['editedProduct']['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    $feedValues['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                }
                                if ($sizeMatch) {
                                    $databaseValues['editedProduct']['sizes'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    $feedValues['sizes'] = [Str::limit($variant['option' . ($i + 1)], '95', '...')];
                                }
                                if ($materialMatch) {
                                    $databaseValues['editedProduct']['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    $feedValues['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                }
                                if ($patternMatch) {
                                    $databaseValues['editedProduct']['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    $feedValues['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                }

                            // if (str_contains(strtolower($shopifyProduct['options'][$i]['name']), strtolower($translatedAttributes['color']))) :
                            //     $databaseValues['editedProduct']['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                            //     $feedValues['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                            // elseif (str_contains(strtolower($shopifyProduct['options'][$i]['name']), strtolower($translatedAttributes['size']))) :
                            //     $databaseValues['editedProduct']['sizes'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                            //     $feedValues['sizes'] = [Str::limit($variant['option' . ($i + 1)], '95', '...')];
                            // elseif (str_contains(strtolower($shopifyProduct['options'][$i]['name']), strtolower($translatedAttributes['material']))) :
                            //     $databaseValues['editedProduct']['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                            //     $feedValues['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                            // elseif (str_contains(strtolower($shopifyProduct['options'][$i]['name']), strtolower($translatedAttributes['pattern']))) :
                            //     $databaseValues['editedProduct']['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                            //     $feedValues['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                            // endif;
                            endif;
                        endfor;
                    endif;
                endif;
                $productExist = ShopProduct::where([
                    'productId' => $shopifyProduct['id'],
                    'feed_setting_id' => $this->feed->id,
                ])->first();
                if ($productExist) :
                    $databaseValues['shop_product_id'] = $productExist['id'];
                    new ShopProductVariant($databaseValues);
                else :
                    $single = [
                        'user_id' => $this->user->id,
                        'feed_setting_id' => $this->feed->id,
                        'productId' => $shopifyProduct['id'],
                    ];
                    $single['variants'][] = $databaseValues;
                    new ShopProduct($single);
                endif;
                $this->toUpload[] = [
                    "batchId" => $this->count,
                    "merchantId" => $this->feed->merchantAccountId,
                    "method" => "insert",
                    "product" => $feedValues
                ];
                $this->count++;
                $this->productCount++;
            endif;
        }
    }
}
