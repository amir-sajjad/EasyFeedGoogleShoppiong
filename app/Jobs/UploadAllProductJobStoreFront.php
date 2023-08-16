<?php

namespace App\Jobs;

use App\Models\ShopProduct;
use Illuminate\Support\Str;
use Illuminate\Bus\Queueable;
use App\Models\ExcludedProduct;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\GoogleApiTrait;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class UploadAllProductJobStoreFront implements ShouldQueue
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
            if ($this->created_feed->whichProducts == "all") :
                $arr[0] = $this->created_feed->country;
                $arr[1] = strtoupper($this->created_feed->language);
                $requests =  $this->shopifyApiStoreFront("allProducts", $arr, ['data', 'products'], $this->user);
                $this->count = 1;
                $products = json_decode(json_encode($requests['nodes']), true);
                if ($this->created_feed->excludedCollections != null) :
                    $excludedProducts = ExcludedProduct::where('feed_setting_id', $this->created_feed->id)
                        ->pluck('productId')
                        ->all();
                endif;
                $dbproducts = $this->addToDBandMakeFeed($products, $excludedProducts);
                while ($requests['pageInfo']['hasNextPage'] == true) :
                    $arr[2] = "after:";
                    $arr[3] = '"' . $requests['pageInfo']['endCursor'] . '"';
                    $requests =  $this->shopifyApiStoreFront("allProducts", $arr, ['data', 'products'], $this->user);
                    if (isset($requests['nodes'])) :
                        $this->toUpload = [];
                        $products = json_decode(json_encode($requests['nodes']), true);
                        $dbproducts = $this->addToDBandMakeFeed($products, $excludedProducts);
                    endif;
                endwhile;
            else :
                $includedCollections = json_decode($this->created_feed->includedCollections);
                $this->count = 1;
                foreach ($includedCollections as $collection) :
                    $arr[0] = $this->created_feed->country;
                    $arr[1] = strtoupper($this->created_feed->language);
                    $arr[2] = $collection->id;
                    $requests =  $this->shopifyApiStoreFront("collectionProducts", $arr, ['data', 'collection', 'products'], $this->user);
                    $products = json_decode(json_encode($requests['nodes']), true);
                    if ($this->created_feed->excludedCollections != null) :
                        $excludedProducts = ExcludedProduct::where('feed_setting_id', $this->created_feed->id)
                            ->pluck('productId')
                            ->all();
                    endif;
                    $dbproducts = $this->addToDBandMakeFeed($products, $excludedProducts);
                    while ($requests['pageInfo']['hasNextPage'] == true) :
                        $arr[3] = "after:";
                        $arr[4] = '"' . $requests['pageInfo']['endCursor'] . '"';
                        $requests =  $this->shopifyApiStoreFront("collectionProducts", $arr, ['data', 'collection', 'products'], $this->user);
                        if (isset($requests['nodes'])) :
                            $this->toUpload = [];
                            $products = json_decode(json_encode($requests['nodes']), true);
                            $dbproducts = $this->addToDBandMakeFeed($products, $excludedProducts);
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
        $flag = false;
        if ($this->created_feed->variantSubmission == 'first') :
            $flag = true;
        endif;
        // $languageWebPresence = $this->getLocaleWebPresence($this->created_feed->language);
        $translatedAttributes = config('languageAttributes.' . $this->created_feed->language);
        foreach ($products as $product) :
            $single = [];
            $this->values = [];
            if ($product['publishedAt']) :
                if (in_array(str_replace('gid://shopify/Product/', '', $product['id']), $excluded)) :
                    continue;
                endif;
                if (empty($product['title']) || (empty($product['descriptionHtml']) && empty($product['description'])) || !isset($product['featuredImage']['url']) || empty($product['featuredImage']['url'])) :
                    continue;
                endif;
                $description = $product['descriptionHtml'] ? Str::limit($product['descriptionHtml'], 4990, '(...)') : ($product['description'] ? Str::limit($product['description'], 4990, '(...)') : '');
                $single = [
                    'user_id' => $this->user->id,
                    'feed_setting_id' => $this->created_feed->id,
                    'productId' => str_replace('gid://shopify/Product/', '', $product['id'])
                ];
                $this->values = [
                    'channel' => $this->created_feed->channel,
                    "targetCountry" => $this->created_feed->country,
                    "feedLabel" => $this->created_feed->country,
                    "contentLanguage" => $this->created_feed->language,
                    "adult" => false,
                    "brand" => $this->created_feed->brandSubmission == 'vendor' ? $product['vendor'] : $this->user->settings->domain,
                    "itemGroupId" => str_replace('gid://shopify/Product/', '', $product['id']),
                ];
                if (isset($product['productType'])) :
                    if ($product['productType']) :
                        $this->values['productTypes'] = [$product['productType']];
                    endif;
                endif;
                if ($this->created_feed->product_category_id) :
                    $this->values['googleProductCategory'] = $this->created_feed->category->value;
                endif;
                if ($this->created_feed->shipping == 'auto') :
                    $this->values['shippingLabel'] = config('googleApi.strings.AutomaticShippingLabel');
                    $this->values['shipping'] = [
                        'price' => [
                            "value" => 0,
                            'currency' => $this->created_feed->currency
                        ],
                        'country' => $this->created_feed->country
                    ];
                endif;
                $this->values['gender'] = $this->created_feed->gender;
                $this->values['condition'] = $this->created_feed->productCondition;
                $this->values['ageGroup'] = $this->created_feed->ageGroup;
                if ($this->created_feed->additionalImages) :
                    $this->values['additionalImageLinks'] = array_slice(array_map(function ($element) {
                        return $element['url'];
                    }, $product['images']['nodes']), 0, 9);
                endif;
                $this->values['description'] = $description;
                // $this->values['canonicalLink'] = $languageWebPresence . "/collections/all/products/" . $product['handle'];
                $this->values['canonicalLink'] = $product['onlineStoreUrl'];
                foreach ($product['variants']['nodes'] as $var => $variant) :
                    $this->values['price'] = null;
                    $this->values['salePrice'] = null;
                    if (config('shopify-app.billing_enabled')) :
                        if (isset($this->planProductsLimit['skus'])) :
                            if ($this->planProductsLimit['skus'] != 'Unlimited') :
                                if ($this->productCount >= $this->planProductsLimit['skus']) :
                                    break;
                                endif;
                            endif;
                        endif;
                    endif;
                    if (!isset($variant['price']['amount']) || empty($variant['price']['amount']) || $variant['price']['amount'] == "0.0") :
                        continue;
                    endif;
                    if ($this->created_feed->productIdFormat == "sku") :
                        if (empty($variant['sku']) || $variant['sku'] == "") :
                            continue;
                        endif;
                    endif;
                    $titlearr = [];
                    foreach ($variant['selectedOptions'] as $option) :
                        if ($option['value'] != "Default Title") :
                            $titlearr[] = $option['value'];
                        endif;
                    endforeach;
                    $varTitle = $product['title'] . ((count($titlearr) > 0) ? "/" . implode('/', $titlearr) : '');
                    $this->values['title'] = $product['title'] . ((count($titlearr) > 0) ? "/" . implode('/', $titlearr) : '');

                    if ($this->created_feed->productIdFormat == "global") :
                        $this->values['id'] = "shopify_" . $this->created_feed->country . "_" . str_replace('gid://shopify/Product/', '', $product['id']) . "_" . str_replace('gid://shopify/ProductVariant/', '', $variant['id']);
                    elseif ($this->created_feed->productIdFormat == "sku") :
                        if (isset($variant['sku']) && $variant['sku'] != null) :
                            $this->values['id'] = $variant['sku'];
                        else :
                            continue;
                        endif;
                    else :
                        $this->values['id'] = str_replace('gid://shopify/ProductVariant/', '', $variant['id']);
                    endif;

                    $utmSource = $this->created_feed->utm_source != null ? '&utm_source=' . $this->created_feed->utm_source : '&utm_source=Google';
                    $utmMedium = $this->created_feed->utm_medium != null ? '&utm_medium=' . $this->created_feed->utm_medium : '&utm_medium=Shopping%20Ads';
                    $utmCampaign = $this->created_feed->utm_campaign != null ? '&utm_campaign=' . $this->created_feed->utm_campaign : '&utm_campaign=EasyFeed';
                    $this->values['link'] = $product['onlineStoreUrl'] . "?variant=" . str_replace('gid://shopify/ProductVariant/', '', $variant['id']) . $utmSource . $utmMedium . $utmCampaign;
                    $this->values['imageLink'] = $variant['image'] ? $variant['image']['url'] : $product['featuredImage']['url'];

                    if ($this->created_feed->salePrice) :
                        if ($variant['compareAtPrice']) :
                            if ($variant['compareAtPrice']['amount'] > $variant['price']['amount']) :
                                $this->values['price'] = [
                                    'value' => $variant['compareAtPrice']['amount'],
                                    'currency' => $this->created_feed->currency
                                ];
                                $this->values['salePrice'] = [
                                    'value' => $variant['price']['amount'],
                                    'currency' => $this->created_feed->currency
                                ];
                            else :
                                $this->values['price'] = [
                                    "value" => $variant['price']['amount'],
                                    'currency' => $this->created_feed->currency
                                ];
                            endif;
                        else :
                            $this->values['price'] = [
                                "value" => $variant['price']['amount'],
                                'currency' => $this->created_feed->currency
                            ];
                        endif;
                    else :
                        $this->values['price'] = [
                            "value" => $variant['price']['amount'],
                            'currency' => $this->created_feed->currency
                        ];
                    endif;

                    if ($this->created_feed->productIdentifiers) :
                        $this->values['identifierExists'] = $this->created_feed->productIdentifiers;
                    endif;

                    $this->values['offerId'] =  $this->values['id'];
                    $this->values['mpn'] = $variant['sku'];

                    if ($variant['barcode'] && $this->created_feed->barcode) :
                        $this->values['gtin'] = $variant['barcode'];
                    endif;

                    $single['variants'][$var] = [
                        'user_id' => $this->user->id,
                        'feed_setting_id' => $this->created_feed->id,
                        'productId' => str_replace('gid://shopify/Product/', '', $product['id']),
                        'variantId' => str_replace('gid://shopify/ProductVariant/', '', $variant['id']),
                        'itemId' => $this->created_feed->channel . ":" . $this->created_feed->language . ":" . $this->created_feed->country . ":" . $this->values['id'],
                        'title' => $varTitle,
                        'description' => $product['descriptionHtml'] ? $product['descriptionHtml'] : ($product['description'] ? $product['description'] : ''),
                        'handle' => $product['handle'] ?? '',
                        'image' => $variant['image']['url'] ? $variant['image']['url'] : $product['featuredImage']['url'],
                        'product_category_id' => $this->created_feed->product_category_id,
                        'productTypes' => $product['productType'] ? $product['productType'] : null,
                        'brand' => $this->created_feed->brandSubmission == 'vendor' ? $product['vendor'] : $this->user->settings->domain,
                        'barcode' => $variant['barcode'],
                        'sku' => $variant['sku'],
                        'quantity' => $variant['quantityAvailable'] ?? 0,
                        'ageGroup' => $this->created_feed->ageGroup,
                        'gender' => $this->created_feed->gender,
                        'productCondition' => $this->created_feed->productCondition,
                        'score' => $this->scoreProduct($variant, $product, $this->created_feed),
                        'salePrice' => $variant['price']['amount'],
                        'comparePrice' =>
                        $this->created_feed->salePrice && $variant['compareAtPrice'] && $variant['compareAtPrice']['amount'] > $variant['price']['amount'] ? $variant['compareAtPrice']['amount'] : '',
                        'editedProduct' => [
                            'user_id' => $this->user->id,
                            'feed_setting_id' => $this->created_feed->id,
                            'productId' => str_replace('gid://shopify/Product/', '', $product['id']),
                            'variantId' => str_replace('gid://shopify/ProductVariant/', '', $variant['id']),
                            'identifierExists' => $this->created_feed->productIdentifiers,
                        ],
                        'productImage' => [
                            'productId' => str_replace('gid://shopify/Product/', '', $product['id']),
                            'variantId' => str_replace('gid://shopify/ProductVariant/', '', $variant['id']),
                        ]
                    ];

                    $this->values['availability'] = "out of stock";
                    if ($product['publishedAt']) :
                        if (isset($variant['quantityAvailable'])) :
                            $this->values['availability'] = $variant['quantityAvailable'] > 0 ? "in stock" : "out of stock";
                            $single['variants'][$var]['editedProduct']['availability'] =
                                $variant['quantityAvailable'] > 0 ? "in_stock" : "out_of_stock";
                        endif;
                    endif;

                    if (!empty($variant['weight']) && !empty($variant['weightUnit'])) :
                        $this->values['shippingWeight'] = [
                            "value" => $variant['weight'],
                            "unit" => $variant['weightUnit'],
                        ];
                        $single['variants'][$var]['editedProduct']['shippingWeight'] = json_encode([
                            "value" => $variant['weight'],
                            "unit" => $variant['weightUnit'],
                        ]);
                    endif;

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
                                $single['variants'][$var]['editedProduct']['color'] = Str::limit($option['value'], '95', '...');
                                $this->values['color'] = Str::limit($option['value'], '95', '...');
                            }
                            if ($sizeMatch) {
                                $single['variants'][$var]['editedProduct']['sizes'] = Str::limit($option['value'], '95', '...');
                                $this->values['sizes'] = Str::limit($option['value'], '95', '...');
                            }
                            if ($materialMatch) {
                                $single['variants'][$var]['editedProduct']['material'] = Str::limit($option['value'], '95', '...');
                                $this->values['material'] = Str::limit($option['value'], '95', '...');
                            }
                            if ($patternMatch) {
                                $single['variants'][$var]['editedProduct']['pattern'] = Str::limit($option['value'], '95', '...');
                                $this->values['pattern'] = Str::limit($option['value'], '95', '...');
                            }

                        // if (str_contains(strtolower($option['name']), strtolower($translatedAttributes['color']))) :
                        //     $single['variants'][$var]['editedProduct']['color'] = Str::limit($option['value'], '95', '...');
                        //     $this->values['color'] = Str::limit($option['value'], '95', '...');
                        // elseif (str_contains(strtolower($option['name']), strtolower($translatedAttributes['size']))) :
                        //     $single['variants'][$var]['editedProduct']['sizes'] = Str::limit($option['value'], '95', '...');
                        //     $this->values['sizes'] = [Str::limit($option['value'], '95', '...')];
                        // elseif (str_contains(strtolower($option['name']), strtolower($translatedAttributes['material']))) :
                        //     $single['variants'][$var]['editedProduct']['material'] = Str::limit($option['value'], '95', '...');
                        //     $this->values['material'] = Str::limit($option['value'], '95', '...');
                        // elseif (str_contains(strtolower($option['name']), strtolower($translatedAttributes['pattern']))) :
                        //     $single['variants'][$var]['editedProduct']['pattern'] = Str::limit($option['value'], '95', '...');
                        //     $this->values['pattern'] = Str::limit($option['value'], '95', '...');
                        // endif;
                        endforeach;
                    endif;
                    if ($this->created_feed->additionalImages) :
                        foreach ($product['images']['nodes'] as $key => $image) :
                            if ($key == 9) :
                                $single['variants'][$var]['productImage']['additionalImage' . ($key + 1) . ''] = $image['url'];
                                break;
                            endif;
                            $single['variants'][$var]['productImage']['additionalImage0' . ($key + 1) . ''] = $image['url'];
                        endforeach;
                    endif;
                    $this->toUpload[] = [
                        "batchId" => $this->count,
                        "merchantId" =>
                        $this->created_feed->merchantAccountId ? $this->created_feed->merchantAccountId : $this->user->settings->merchantAccountId,
                        "method" => "insert",
                        "product" => $this->values
                    ];
                    $this->count++;
                    $this->productCount++;
                    if ($flag) :
                        break;
                    endif;
                endforeach;
                if (isset($single['variants'])) :
                    new ShopProduct($single);
                endif;
            endif;
        endforeach;
        $this->uploadBulkProductsToMerchantAccount(['entries' => $this->toUpload], $this->user);
    }
}
