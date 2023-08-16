<?php

namespace App\Jobs;

use App\Models\ShopProduct;
use Illuminate\Support\Str;
// use App\Models\Notification;
use Illuminate\Bus\Queueable;
use App\Models\ExcludedProduct;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\GoogleApiTrait;
use App\Jobs\SyncSingleFeedStatusJob;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class UploadAllProductJobRest implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, GoogleApiTrait;
    public $timeout = 9000;
    public $tries = 1;
    protected $user;
    protected $values;
    protected $products;
    protected $toUpload;
    protected $created_feed;
    protected $productCount;
    protected $productCountforFeed;
    protected $planProductsLimit;
    protected $count;
    // protected $limitError = false;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($shop, $created_feed)
    {
        $this->user = $shop;
        $this->created_feed = $created_feed;
        $this->productCount = 0;
        $this->productCountforFeed = 0;
        $this->planProductsLimit = [];
        $this->toUpload = [];
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->user->settings->update(['setup' => true]);
        $this->planProductsLimit = $this->calculatePlanLimitations($this->user);
        $this->productCount = $this->user->shop_product_variants_count;
        $this->productCountforFeed = $this->user->shop_product_variants_count;
        $excludedProducts = [];
        if ($this->created_feed->merchantAccountId) :
            $limit = $this->created_feed->variantSubmission == 'all' ? 250 : 250;
            if ($this->created_feed->whichProducts == "all") :
                $requests =  $this->shopifyApiRequest("getProducts", null, ['limit' => $limit], null, $this->user);
                $this->count = 1;
                $products = json_decode(json_encode($requests['body']['products']), true);
                if ($this->created_feed->excludedCollections != null) :
                    $excludedProducts = ExcludedProduct::where('feed_setting_id', $this->created_feed->id)
                        ->pluck('productId')
                        ->all();
                endif;
                $this->addToDBandMakeFeed($products, $excludedProducts);
                // if ($this->limitError === true) :
                //     return true;
                // endif;
                while (isset($requests['link']['next'])) :
                    $requests =  $this->shopifyApiRequest("getProducts", null, ['limit' => $limit, 'page_info' => $requests['link']['next']], null, $this->user);
                    if (isset($requests['body']['products'])) :
                        $this->toUpload = [];
                        $products = json_decode(json_encode($requests['body']['products']), true);
                        $this->addToDBandMakeFeed($products, $excludedProducts);
                    endif;
                endwhile;
            else :
                $includedCollections = json_decode($this->created_feed->includedCollections);
                $this->count = 1;
                foreach ($includedCollections as $collection) :
                    $requests =  $this->shopifyApiRequest("getCollectionProducts", $collection->id, ['limit' => $limit], null, $this->user);
                    $products = json_decode(json_encode($requests['body']['products']), true);
                    if ($this->created_feed->excludedCollections != null) :
                        $excludedProducts = ExcludedProduct::where('feed_setting_id', $this->created_feed->id)
                            ->pluck('productId')
                            ->all();
                    endif;
                    $this->addToDBandMakeFeed($products, $excludedProducts);
                    while (isset($requests['link']['next'])) :
                        $requests =  $this->shopifyApiRequest("getCollectionProducts", $collection->id, ['limit' => $limit, 'page_info' => $requests['link']['next']], null, $this->user);
                        if (isset($requests['body']['products'])) :
                            $this->toUpload = [];
                            $products = json_decode(json_encode($requests['body']['products']), true);
                            $this->addToDBandMakeFeed($products, $excludedProducts);
                        endif;
                    endwhile;
                endforeach;
            endif;
            SyncSingleFeedStatusJob::dispatch($this->user, $this->created_feed, false)->onQueue('googleStatus')->delay(now()->addMinutes(5));
            $totalFeeds = $this->user->settings->feedsCount + 1;
            $this->user->settings->update(['feedsCount' => ($totalFeeds)]);
        endif;
    }

    public function addToDBandMakeFeed($products, $excluded)
    {
        $translatedAttributes = config('languageAttributes.' . $this->created_feed->language);
        foreach ($products as $product) :
            $dbValue = [];
            $feedValue = [];
            if ($product['published_at']) :
                if (in_array($product['id'], $excluded)) :
                    continue;
                endif;
                if (empty($product['title']) || empty($product['body_html']) || !isset($product['image']['src']) || empty($product['image']['src'])) :
                    continue;
                endif;
                if ($this->created_feed->whichProducts != "all") :
                    $product['variants'] = $this->shopifyApiRequest("getVariants", $product['id'], ["limit" => 100], ['body', 'variants'], $this->user);
                endif;
                $description = $product['body_html'] ? Str::limit($product['body_html'], 4990, '(...)') : '';
                $dbValue = [
                    'user_id' => $this->user->id,
                    'feed_setting_id' => $this->created_feed->id,
                    'productId' => $product['id']
                ];
                $feedValue = [
                    'channel' => $this->created_feed->channel,
                    "targetCountry" => $this->created_feed->country,
                    "feedLabel" => $this->created_feed->country,
                    "contentLanguage" => $this->created_feed->language,
                    "adult" => false,
                    "brand" => $this->created_feed->brandSubmission == 'vendor' ? $product['vendor'] : $this->user->settings->domain,
                    "itemGroupId" => $product['id'],
                ];
                if (isset($product['product_type'])) :
                    if ($product['product_type']) :
                        $feedValue['productTypes'] = [$product['product_type']];
                    endif;
                endif;
                if ($this->created_feed->product_category_id) :
                    $feedValue['googleProductCategory'] = $this->created_feed->category->value;
                endif;
                if ($this->created_feed->shipping == 'auto') :
                    $feedValue['shippingLabel'] = config('googleApi.strings.AutomaticShippingLabel');
                    $feedValue['shipping'] = [
                        'price' => [
                            "value" => 0,
                            'currency' => $this->created_feed->currency
                        ],
                        'country' => $this->created_feed->country
                    ];
                endif;
                $feedValue['gender'] = $this->created_feed->gender;
                $feedValue['condition'] = $this->created_feed->productCondition;
                $feedValue['ageGroup'] = $this->created_feed->ageGroup;
                $feedValue['description'] = $description;
                $feedValue['canonicalLink'] = "https://" . $this->user->settings->domain . "/collections/all/products/" . $product['handle'];
                foreach ($product['variants'] as $var => $variant) :
                    $feedValue['price'] = null;
                    $feedValue['salePrice'] = null;
                    if (config('shopify-app.billing_enabled')) :
                        if (isset($this->planProductsLimit['skus'])) :
                            if ($this->planProductsLimit['skus'] != 'Unlimited') :
                                if ($this->productCount >= $this->planProductsLimit['skus']) :
                                    break;
                                endif;
                            endif;
                        endif;
                    endif;
                    if (empty($variant['price']) || $variant['price'] == "0.00") :
                        continue;
                    endif;
                    if ($this->created_feed->productIdFormat == "sku") :
                        if (empty($variant['sku']) || $variant['sku'] == "") :
                            continue;
                        endif;
                    endif;
                    $img = $variant['image_id'] != null ? collect($product['images'])->where('id', $variant['image_id'])->first() : $product['image'];
                    $varTitle = strpos($variant['title'], 'Default Title') !== false ? $product['title'] : $product['title'] . "/" . $variant['title'];

                    if ($this->created_feed->productIdFormat == "global") :
                        $feedValue['id'] = "shopify_" . $this->created_feed->country . "_" . $product['id'] . "_" . $variant["id"];
                    elseif ($this->created_feed->productIdFormat == "sku") :
                        if (isset($variant['sku']) && $variant['sku'] != null) :
                            $feedValue['id'] = $variant['sku'];
                        else :
                            continue;
                        endif;
                    elseif ($this->created_feed->productIdFormat == "variant") :
                        $feedValue['id'] = $variant['id'];
                    endif;

                    $utmSource = $this->created_feed->utm_source != null ? '&utm_source=' . $this->created_feed->utm_source : '&utm_source=Google';
                    $utmMedium = $this->created_feed->utm_medium != null ? '&utm_medium=' . $this->created_feed->utm_medium : '&utm_medium=Shopping%20Ads';
                    $utmCampaign = $this->created_feed->utm_campaign != null ? '&utm_campaign=' . $this->created_feed->utm_campaign : '&utm_campaign=EasyFeed';
                    $feedValue['link'] = "https://" . $this->user->settings->domain . "/collections/all/products/" . $product['handle'] . "?variant=" . $variant['id'] . $utmSource . $utmMedium . $utmCampaign;
                    if ($this->created_feed->salePrice) :
                        if ($variant['compare_at_price']) :
                            if ($variant['compare_at_price'] > $variant['price']) :
                                $feedValue['price'] = [
                                    'value' => $variant['compare_at_price'],
                                    'currency' => $this->created_feed->currency
                                ];
                                $feedValue['salePrice'] = [
                                    'value' => $variant['price'],
                                    'currency' => $this->created_feed->currency
                                ];
                            else :
                                $feedValue['price'] = [
                                    "value" => $variant['price'],
                                    'currency' => $this->created_feed->currency
                                ];
                            endif;
                        else :
                            $feedValue['price'] = [
                                "value" => $variant['price'],
                                'currency' => $this->created_feed->currency
                            ];
                        endif;
                    else :
                        $feedValue['price'] = [
                            "value" => $variant['price'],
                            'currency' => $this->created_feed->currency
                        ];
                    endif;
                    if ($this->created_feed->productIdentifiers) :
                        $feedValue['identifierExists'] = $this->created_feed->productIdentifiers;
                    endif;
                    $feedValue['offerId'] =  $feedValue['id'];
                    $feedValue['mpn'] = $variant['sku'];
                    if ($variant['barcode'] && $this->created_feed->barcode) :
                        $feedValue['gtin'] = $variant['barcode'];
                    endif;
                    $feedValue['imageLink'] = $img['src'];
                    $feedValue['title'] = $varTitle;
                    $dbValue['variants'][$var] = [
                        'user_id' => $this->user->id,
                        'feed_setting_id' => $this->created_feed->id,
                        'productId' => $product['id'],
                        'variantId' => $variant['id'],
                        'itemId' => $this->created_feed->channel . ":" . $this->created_feed->language . ":" . $this->created_feed->country . ":" . $feedValue['id'],
                        'title' => $varTitle,
                        'description' => $description,
                        'handle' => $product['handle'] ?? '',
                        'image' => $img['src'],
                        'product_category_id' => $this->created_feed->product_category_id,
                        'productTypes' => $product['product_type'] ? $product['product_type'] : null,
                        'brand' => $this->created_feed->brandSubmission == 'vendor' ? $product['vendor'] : $this->user->settings->domain,
                        'barcode' => $variant['barcode'],
                        'sku' => $variant['sku'],
                        'quantity' => $variant['inventory_quantity'] ?? 0,
                        'ageGroup' => $this->created_feed->ageGroup,
                        'gender' => $this->created_feed->gender,
                        'productCondition' => $this->created_feed->productCondition,
                        'score' => $this->scoreProduct($variant, $product, $this->created_feed),
                        'salePrice' => $variant['price'],
                        'comparePrice' => $this->created_feed->salePrice && $variant['compare_at_price'] && $variant['compare_at_price'] > $variant['price'] ? $variant['compare_at_price'] : '',
                        'editedProduct' => [
                            'user_id' => $this->user->id,
                            'feed_setting_id' => $this->created_feed->id,
                            'productId' => $product['id'],
                            'variantId' => $variant['id'],
                            'identifierExists' => $this->created_feed->productIdentifiers,
                        ],
                        'productImage' => [
                            'productId' => $product['id'],
                            'variantId' => $variant['id'],
                        ]
                    ];

                    $feedValue['availability'] = "out of stock";
                    if ($product['published_at']) :
                        if (isset($variant['inventory_quantity'])) :
                            $feedValue['availability'] = $variant['inventory_quantity'] > 0 ? "in stock" : "out of stock";
                            $dbValue['variants'][$var]['editedProduct']['availability'] =
                                $variant['inventory_quantity'] > 0 ? "in_stock" : "out_of_stock";
                        endif;
                    endif;

                    if (!empty($variant['weight']) && !empty($variant['weight_unit'])) :
                        $feedValue['shippingWeight'] = [
                            "value" => $variant['weight'],
                            "unit" => $variant['weight_unit'],
                        ];
                        $dbValue['variants'][$var]['editedProduct']['shippingWeight'] = json_encode([
                            "value" => $variant['weight'],
                            "unit" => $variant['weight_unit'],
                        ]);
                    endif;

                    if ($this->created_feed->language == "en") :
                        for ($i = 0; $i < count($product['options']); $i++) :
                            if ($variant['option' . ($i + 1)]) :
                                if (str_contains(strtolower($product['options'][$i]['name']), 'color') || str_contains(strtolower($product['options'][$i]['name']), 'colour')) :
                                    $dbValue['variants'][$var]['editedProduct']['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    $feedValue['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                elseif (str_contains(strtolower($product['options'][$i]['name']), 'size')) :
                                    $dbValue['variants'][$var]['editedProduct']['sizes'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    $feedValue['sizes'] = [Str::limit($variant['option' . ($i + 1)], '95', '...')];
                                elseif (str_contains(strtolower($product['options'][$i]['name']), 'material')) :
                                    $dbValue['variants'][$var]['editedProduct']['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    $feedValue['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                elseif (str_contains(strtolower($product['options'][$i]['name']), 'pattern')) :
                                    $dbValue['variants'][$var]['editedProduct']['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    $feedValue['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
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
                                        $dbValue['variants'][$var]['editedProduct']['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                        $feedValue['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    }
                                    if ($sizeMatch) {
                                        $dbValue['variants'][$var]['editedProduct']['sizes'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                        $feedValue['sizes'] = [Str::limit($variant['option' . ($i + 1)], '95', '...')];
                                    }
                                    if ($materialMatch) {
                                        $dbValue['variants'][$var]['editedProduct']['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                        $feedValue['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    }
                                    if ($patternMatch) {
                                        $dbValue['variants'][$var]['editedProduct']['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                        $feedValue['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    }

                                // if (str_contains(strtolower($product['options'][$i]['name']), strtolower($translatedAttributes['color']))) :
                                //     $dbValue['variants'][$var]['editedProduct']['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                //     $feedValue['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                // elseif (str_contains(strtolower($product['options'][$i]['name']), strtolower($translatedAttributes['size']))) :
                                //     $dbValue['variants'][$var]['editedProduct']['sizes'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                //     $feedValue['sizes'] = [Str::limit($variant['option' . ($i + 1)], '95', '...')];
                                // elseif (str_contains(strtolower($product['options'][$i]['name']), strtolower($translatedAttributes['material']))) :
                                //     $dbValue['variants'][$var]['editedProduct']['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                //     $feedValue['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                // elseif (str_contains(strtolower($product['options'][$i]['name']), strtolower($translatedAttributes['pattern']))) :
                                //     $dbValue['variants'][$var]['editedProduct']['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                //     $feedValue['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                // endif;
                                endif;
                            endfor;
                        endif;
                    endif;
                    if ($this->created_feed->additionalImages) :
                        $imageUrls = collect($product['images'])->take(10)->map(function ($image, $index) use (&$dbValue, $var) {
                            $imageUrl = $image['src'];
                            $key = 'additionalImage' . sprintf('%02d', $index + 1);
                            $dbValue['variants'][$var]['productImage'][$key] = $imageUrl;
                            return $imageUrl;
                        })->toArray();
                        $feedValue['additionalImageLinks'] = $imageUrls;
                    endif;
                    $this->toUpload[] = [
                        "batchId" => $this->count,
                        "merchantId" =>
                        $this->created_feed->merchantAccountId ? $this->created_feed->merchantAccountId : $this->user->settings->merchantAccountId,
                        "method" => "insert",
                        "product" => $feedValue
                    ];
                    $this->count++;
                    $this->productCount++;
                    if ($this->created_feed->variantSubmission == 'first') :
                        break;
                    endif;
                endforeach;
                if (isset($dbValue['variants'])) :
                    new ShopProduct($dbValue);
                endif;
            endif;
        endforeach;
        $googleResponse = $this->uploadBulkProductsToMerchantAccount(['entries' => $this->toUpload], $this->user);
        // $googleResponse = json_decode(json_encode($googleResponse), true);
        // $hasErrors = array_reduce($googleResponse['entries'], function ($carry, $entry) {
        //     if ($carry === true) {
        //         return true;
        //     }
        //     if (isset($entry['errors'])) {
        //         foreach ($entry['errors']['errors'] as $error) {
        //             if ($error['reason'] === 'quota/too_many_items') {
        //                 return true;
        //             }
        //         }
        //     }
        //     return false;
        // }, false);
        // if ($hasErrors === true) {
        //     $this->generateNotification();
        //     $this->limitError = true;
        // }
    }

    // public function generateNotification()
    // {
    //     $notification = [
    //         'user_id' => $this->user->id,
    //         'notification_type' => 'error',
    //         'title' => "Product Limit Exceeded in your '" . $this->created_feed->name . "' feed. For more information check https:\/\/support.google.com\/merchants\/answer\/9727343",
    //     ];
    //     Notification::create($notification);
    // }
}
