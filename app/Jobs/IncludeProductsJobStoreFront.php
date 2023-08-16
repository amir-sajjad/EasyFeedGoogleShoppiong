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

class IncludeProductsJobStoreFront implements ShouldQueue
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
        $products = $this->data['products'];
        $this->feed = FeedSetting::where('id', $this->data['feedId'])->first();
        $this->count = 1;
        $this->planProductsLimit = $this->calculatePlanLimitations($this->user);
        $this->productCount = $this->user->shop_product_variants_count;
        foreach ($products as $key => $product) :
            if (config('shopify-app.billing_enabled')) :
                if (isset($this->planProductsLimit['skus'])) :
                    if ($this->planProductsLimit['skus'] != 'Unlimited') :
                        if ($this->productCount >= $this->planProductsLimit['skus']) :
                            break;
                        endif;
                    endif;
                endif;
            endif;
            $arr[0] = $this->feed->country;
            $arr[1] = strtoupper($this->feed->language);
            $arr[2] = $product['productId'];
            $request =  $this->shopifyApiStoreFront("singleProduct", $arr, ['data', 'product'], $this->user);
            $variant = collect($request['variants']['nodes'])->where('id', 'gid://shopify/ProductVariant/' . $product['variantId'])->first();
            $this->createFeedFunction($request, $variant);
            // $this->addToGoogleFeed($request, $variant);
            $product->delete();
        endforeach;
        $this->uploadBulkProductsToMerchantAccount(['entries' => $this->toUpload], $this->user);
    }

    public function createFeedFunction($product, $variant)
    {
        $single = [];
        $this->values = [];
        if ($product['publishedAt']) :
            $translatedAttributes = config('languageAttributes.' . $this->feed->language);
            // $languageWebPresence = $this->getLocaleWebPresence($this->feed->language);
            $varTitle = strpos($variant['title'], 'Default Title') !== false ? $product['title'] : $product['title'] . "/" . $variant['title'];

            $this->values = [
                'channel' => $this->feed->channel,
                "targetCountry" => $this->feed->country,
                "feedLabel" => $this->feed->country,
                "contentLanguage" => $this->feed->language,
                "adult" => false,
                "brand" => $this->feed->brandSubmission == 'vendor' ? $product['vendor'] : $this->user->settings->domain,
                "itemGroupId" => str_replace('gid://shopify/Product/', '', $product['id']),
            ];

            if ($this->feed->productIdFormat == "global") :
                $this->values['id'] = "shopify_" . $this->feed->country . "_" . str_replace('gid://shopify/Product/', '', $product['id']) . "_" . str_replace('gid://shopify/ProductVariant/', '', $variant['id']);
            elseif ($this->feed->productIdFormat == "sku") :
                $this->values['id'] = $variant['sku'];
            else :
                $this->values['id'] = str_replace('gid://shopify/ProductVariant/', '', $variant['id']);
            endif;

            $createVariant = [
                'user_id' => $this->user->id,
                'feed_setting_id' => $this->feed->id,
                'productId' => str_replace('gid://shopify/Product/', '', $product['id']),
                'variantId' => str_replace('gid://shopify/ProductVariant/', '', $variant['id']),
                'itemId' => $this->feed->channel . ":" . $this->feed->language . ":" . $this->feed->country . ":" . $this->values['id'],
                'title' => $varTitle,
                'description' => $product['descriptionHtml'] ? Str::limit($product['descriptionHtml'], 4990, '(...)') : ($product['description'] ? Str::limit($product['description'], 4990, '(...)') : ''),
                'handle' => $product['handle'] ?? '',
                'image' => $variant['image']['url'] ? $variant['image']['url'] : $product['featuredImage']['url'],
                'product_category_id' => $this->feed->product_category_id,
                'productTypes' => $product['productType'] ? $product['productType'] : null,
                'brand' => $this->feed->brandSubmission == 'vendor' ? $product['vendor'] : $this->user->settings->domain,
                'barcode' => $variant['barcode'],
                'sku' => $variant['sku'],
                'ageGroup' => $this->feed->ageGroup,
                'gender' => $this->feed->gender,
                'productCondition' => $this->feed->productCondition,
                'score' => $this->scoreProduct($variant, $product, $this->feed),
                'salePrice' => $variant['price']['amount'],
                'comparePrice' => $variant['compareAtPrice'] ? $variant['compareAtPrice']['amount'] : '',
                'editedProduct' => [
                    'user_id' => $this->user->id,
                    'feed_setting_id' => $this->feed->id,
                    'productId' => str_replace('gid://shopify/Product/', '', $product['id']),
                    'variantId' => str_replace('gid://shopify/ProductVariant/', '', $variant['id']),
                    'identifierExists' => $this->feed->productIdentifiers,
                ],
                'productImage' => [
                    'productId' => str_replace('gid://shopify/Product/', '', $product['id']),
                    'variantId' => str_replace('gid://shopify/ProductVariant/', '', $variant['id']),
                ]
            ];

            if (isset($product['productType'])) :
                if ($product['productType']) :
                    $this->values['productTypes'] = [$product['productType']];
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

            $this->values['gender'] = $this->feed->gender;
            $this->values['condition'] = $this->feed->productCondition;
            $this->values['ageGroup'] = $this->feed->ageGroup;

            if ($this->feed->additionalImages) :
                $imageUrls = collect($product['images']['nodes'])->take(10)->map(function ($image, $index) use (&$createVariant) {
                    $imageUrl = $image['url'];
                    $key = 'additionalImage' . sprintf('%02d', $index + 1);
                    $createVariant['productImage'][$key] = $imageUrl;
                    return $imageUrl;
                })->toArray();
                $this->values['additionalImageLinks'] = $imageUrls;
            endif;

            $this->values = array_merge($this->values, [
                "description" => $product['descriptionHtml'] ? Str::limit($product['descriptionHtml'], 4990, '(...)') : ($product['description'] ? Str::limit($product['description'], 4990, '(...)') : ''),
                "canonicalLink" => $product['onlineStoreUrl'],
            ]);

            $this->values['availability'] = "out of stock";
            if ($product['publishedAt']) :
                if (isset($variant['quantityAvailable'])) :
                    $this->values['availability'] = $variant['quantityAvailable'] > 0 ? "in stock" : "out of stock";
                    $createVariant['editedProduct']['availability'] = $variant['quantityAvailable'] > 0 ? "in_stock" : "out_of_stock";
                endif;
            endif;

            $utmSource = $this->feed->utm_source != null ? '&utm_source=' . $this->feed->utm_source : '&utm_source=Google';
            $utmMedium = $this->feed->utm_medium != null ? '&utm_medium=' . $this->feed->utm_medium : '&utm_medium=Shopping%20Ads';
            $utmCampaign = $this->feed->utm_campaign != null ? '&utm_campaign=' . $this->feed->utm_campaign : '&utm_campaign=EasyFeed';
            $this->values['link'] = $product['onlineStoreUrl'] . "?variant=" . str_replace('gid://shopify/ProductVariant/', '', $variant['id']) . $utmSource . $utmMedium . $utmCampaign;
            $this->values['imageLink'] = $variant['image'] ? $variant['image']['url'] : $product['featuredImage']['url'];

            if ($this->feed->salePrice) :
                if ($variant['compareAtPrice']) :
                    if ($variant['compareAtPrice']['amount'] > $variant['price']['amount']) :
                        $this->values['price'] = [
                            'value' => $variant['compareAtPrice']['amount'],
                            'currency' => $this->feed->currency
                        ];
                        $this->values['salePrice'] = [
                            'value' => $variant['price']['amount'],
                            'currency' => $this->feed->currency
                        ];
                    else :
                        $this->values['price'] = [
                            "value" => $variant['price']['amount'],
                            'currency' => $this->feed->currency
                        ];
                    endif;
                else :
                    $this->values['price'] = [
                        "value" => $variant['price']['amount'],
                        'currency' => $this->feed->currency
                    ];
                endif;
            else :
                $this->values['price'] = [
                    "value" => $variant['price']['amount'],
                    'currency' => $this->feed->currency
                ];
            endif;

            if ($this->feed->productIdentifiers) :
                $this->values['identifier_exists'] = $this->feed->productIdentifiers;
            endif;
            $this->values['offerId'] =  $this->values['id'];
            $this->values['mpn'] = $variant['sku'];


            if (!empty($variant['weight']) && !empty($variant['weightUnit'])) :
                $this->values['shippingWeight'] = [
                    "value" => $variant['weight'],
                    "unit" => $variant['weightUnit'],
                ];
                $createVariant['editedProduct']['shippingWeight'] = json_encode([
                    "value" => $variant['weight'],
                    "unit" => $variant['weightUnit'],
                ]);
            endif;

            if ($variant['barcode'] && $this->feed->barcode) :
                $this->values['gtin'] = $variant['barcode'];
            endif;
            $this->values['title'] = $varTitle;
            if (isset($translatedAttributes['color'])) :
                $colorValues = $translatedAttributes['color'];
                $sizeValues = $translatedAttributes['size'];
                $materialValues = $translatedAttributes['material'];
                $patternValues = $translatedAttributes['pattern'];
                foreach ($variant['selectedOptions'] as $option) :
                    $colorMatch = array_reduce($colorValues, function ($carry, $value) use ($option) {
                        return $carry || str_contains(strtolower($option['name']), strtolower($value));
                    }, false);
                    $sizeMatch = array_reduce($sizeValues, function ($carry, $value) use ($option) {
                        return $carry || str_contains(strtolower($option['name']), strtolower($value));
                    }, false);
                    $materialMatch = array_reduce($materialValues, function ($carry, $value) use ($option) {
                        return $carry || str_contains(strtolower($option['name']), strtolower($value));
                    }, false);
                    $patternMatch = array_reduce($patternValues, function ($carry, $value) use ($option) {
                        return $carry || str_contains(strtolower($option['name']), strtolower($value));
                    }, false);
                    if ($colorMatch) {
                        $createVariant['editedProduct']['color'] = Str::limit($option['value'], '95', '...');
                        $this->values['color'] = Str::limit($option['value'], '95', '...');
                    }
                    if ($sizeMatch) {
                        $createVariant['editedProduct']['sizes'] = Str::limit($option['value'], '95', '...');
                        $this->values['sizes'] = Str::limit($option['value'], '95', '...');
                    }
                    if ($materialMatch) {
                        $createVariant['editedProduct']['material'] = Str::limit($option['value'], '95', '...');
                        $this->values['material'] = Str::limit($option['value'], '95', '...');
                    }
                    if ($patternMatch) {
                        $createVariant['editedProduct']['pattern'] = Str::limit($option['value'], '95', '...');
                        $this->values['pattern'] = Str::limit($option['value'], '95', '...');
                    }
                endforeach;
            endif;
            $this->toUpload[] = [
                "batchId" => $this->count,
                "merchantId" => $this->feed->merchantAccountId,
                "method" => "insert",
                "product" => $this->values
            ];
            $productExist = ShopProduct::where([
                'productId' => str_replace('gid://shopify/Product/', '', $product['id']),
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
            $this->count++;
            $this->productCount++;
        endif;
    }
}
