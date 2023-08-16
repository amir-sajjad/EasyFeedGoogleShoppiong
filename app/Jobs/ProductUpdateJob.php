<?php

namespace App\Jobs;

use stdClass;
use App\Models\User;
use App\Models\ShopProduct;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\ShopProductVariant;
use App\Http\Traits\GoogleApiTrait;
use App\Models\FeedSetting;
use App\Models\Notification;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Osiset\ShopifyApp\Objects\Values\ShopDomain;

class ProductUpdateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, GoogleApiTrait;

    /**
     * Shop's myshopify domain
     *
     * @var ShopDomain|string
     */
    public $shopDomain;

    /**
     * The webhook data
     *
     * @var object
     */
    public $data;
    public $user;
    public $feedSetting;

    /**
     * Create a new job instance.
     *
     * @param string   $shopDomain The shop's myshopify domain.
     * @param stdClass $data       The webhook data (JSON decoded).
     *
     * @return void
     */
    public function __construct($shopDomain, $data)
    {
        $this->shopDomain = $shopDomain;
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->shopDomain = ShopDomain::fromNative($this->shopDomain);
        $this->user = User::where('name', $this->shopDomain->toNative())->whereNull('deleted_at')->whereNotNull('password')->whereHas('settings', function ($query) {
            $query->whereNotNull('merchantAccountId');
            $query->where('setup', 1);
        })->with('settings')->first();
        if ($this->user) :
            $product = json_decode(json_encode($this->data), true);
            $dbProducts = ShopProduct::where([
                'user_id' => $this->user->id,
                'productId' => $product['id']
            ])->with('variants')->get();
            if (count($dbProducts) > 0) :
                foreach ($dbProducts as $dbProduct) :
                    $feedSetting = FeedSetting::where([
                        'id' => $dbProduct->feed_setting_id,
                        'user_id' => $this->user->id
                    ])->first();
                    if (isset($feedSetting['language']) && $feedSetting['status']) :
                        if ($this->user->settings->notification_setting == 'auto') :
                            $this->autoUpdateProduct($feedSetting, $dbProduct, $product);
                        else :
                            $this->manualUpdateProduct($feedSetting, $dbProduct, $product);
                            $this->generateNotification($product);
                        endif;
                    endif;
                endforeach;
            endif;
        endif;
        return true;
    }

    public function autoUpdateProduct($feed, $dbProduct, $product)
    {
        $toUpload = [];
        $translatedAttributes = config('languageAttributes.' . $feed->language);
        if ($feed->language == $this->user->settings->language && $feed->currency == $this->user->settings->currency) :
            foreach ($dbProduct['variants'] as $key => $dbVariant) :
                if (empty($product['title']) || empty($product['body_html']) || !isset($product['image']['src']) || empty($product['image']['src'])) :
                    continue;
                endif;
                $dbValues = [];
                $feedValues = [];
                $variant = collect($product['variants'])->where('id', $dbVariant->variantId)->first();
                if (isset($variant['title'])) :
                    $title = strpos($variant['title'], 'Default Title') !== false ? $product['title'] : $product['title'] . "/" . $variant['title'];
                    $description = $product['body_html'] ? Str::limit($product['body_html'], 4990, '(...)') : '';
                    $image = $variant['image_id'] != null ? collect($product['images'])->where('id', $variant['image_id'])->first() : $product['image'];
                    // $utmSource = $feed->utm_source != null ? '&utm_source=' . $feed->utm_source : '&utm_source=Google';
                    // $utmMedium = $feed->utm_medium != null ? '&utm_medium=' . $feed->utm_medium : '&utm_medium=Shopping%20Ads';
                    // $utmCampaign = $feed->utm_campaign != null ? '&utm_campaign=' . $feed->utm_campaign : '&utm_campaign=EasyFeed';
                    $feedValues = [
                        'title' => $title,
                        'description' => $description,
                        'imageLink' => $image['src'],
                        // 'canonicalLink' => "https://" . $this->user->settings->domain . "/collections/all/products/" . $product['handle'],
                        'mpn' => $variant['sku'],
                        // 'link' => "https://" . $this->user->settings->domain . "/collections/all/products/" . $product['handle'] . "?variant=" . $variant['id'] . $utmSource . $utmMedium . $utmCampaign,
                    ];
                    if (isset($product['product_type'])) :
                        if ($product['product_type']) :
                            $feedValues['productTypes'] = [$product['product_type']];
                        endif;
                    endif;

                    if (!empty($variant['weight']) && !empty($variant['weight_unit'])) :
                        $feedValues['shippingWeight'] = [
                            "value" => $variant['weight'],
                            "unit" => $variant['weight_unit']
                        ];
                        $dbValues['editedProduct']['shippingWeight'] = json_encode([
                            "value" => $variant['weight'],
                            "unit" => $variant['weight_unit']
                        ]);
                    endif;

                    if ($variant['barcode'] && $feed->barcode) :
                        $feedValues['gtin'] = $variant['barcode'];
                    endif;
                    $feedValues['availability'] = "out of stock";
                    if ($product['published_at']) :
                        if (isset($variant['inventory_quantity'])) :
                            $feedValues['availability'] = $variant['inventory_quantity'] > 0 ? "in stock" : "out of stock";
                        endif;
                    endif;
                    if ($feed->salePrice) :
                        if ($variant['compare_at_price']) :
                            if ($variant['compare_at_price'] > $variant['price']) :
                                $feedValues['price'] = [
                                    'value' => $variant['compare_at_price'],
                                    'currency' => $feed->currency
                                ];
                                $feedValues['salePrice'] = [
                                    'value' => $variant['price'],
                                    'currency' => $feed->currency
                                ];
                            else :
                                $feedValues['price'] = [
                                    "value" => $variant['price'],
                                    'currency' => $feed->currency
                                ];
                            endif;
                        else :
                            $feedValues['price'] = [
                                "value" => $variant['price'],
                                'currency' => $feed->currency
                            ];
                        endif;
                    else :
                        $feedValues['price'] = [
                            "value" => $variant['price'],
                            'currency' => $feed->currency
                        ];
                    endif;
                    $dbValues['variant'] = [
                        'user_id' => $this->user->id,
                        'feed_setting_id' => $feed->id,
                        'productId' => $product['id'],
                        'variantId' => $variant['id'],
                        'title' => $title,
                        'description' => $description,
                        'image' => $image['src'],
                        'product_category_id' => $feed->product_category_id,
                        'productTypes' => $product['product_type'] ? $product['product_type'] : null,
                        'brand' => $feed->brandSubmission == 'vendor' ? $product['vendor'] : $this->user->settings->domain,
                        'barcode' => $variant['barcode'],
                        'sku' => $variant['sku'],
                        'quantity' => $variant['inventory_quantity'] ?? 0,
                        'ageGroup' => $feed->ageGroup,
                        'gender' => $feed->gender,
                        'productCondition' => $feed->productCondition,
                        'score' => $this->scoreProduct($variant, $product, $feed),
                        'salePrice' => $variant['price'],
                        'comparePrice' => $feed->salePrice && $variant['compare_at_price'] ? $variant['compare_at_price'] : null,
                    ];
                    if ($feed->additionalImages) :
                        $imageUrls = collect($product['images'])->take(10)->map(function ($image, $index) use (&$dbValues) {
                            $imageUrl = $image['src'];
                            $key = 'additionalImage' . sprintf('%02d', $index + 1);
                            $dbValues['productImage'][$key] = $imageUrl;
                            return $imageUrl;
                        })->toArray();
                        $feedValues['additionalImageLinks'] = $imageUrls;
                    endif;
                    if ($feed->language == "en") :
                        for ($i = 0; $i < count($product['options']); $i++) :
                            if ($variant['option' . ($i + 1)]) :
                                if (str_contains(strtolower($product['options'][$i]['name']), 'color') || str_contains(strtolower($product['options'][$i]['name']), 'colour')) :
                                    $dbValues['editedProduct']['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    $feedValues['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                elseif (str_contains(strtolower($product['options'][$i]['name']), 'size')) :
                                    $dbValues['editedProduct']['sizes'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    $feedValues['sizes'] = [Str::limit($variant['option' . ($i + 1)], '95', '...')];
                                elseif (str_contains(strtolower($product['options'][$i]['name']), 'material')) :
                                    $dbValues['editedProduct']['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    $feedValues['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                elseif (str_contains(strtolower($product['options'][$i]['name']), 'pattern')) :
                                    $dbValues['editedProduct']['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
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
                                        $dbValues['editedProduct']['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                        $feedValues['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    }
                                    if ($sizeMatch) {
                                        $dbValues['editedProduct']['sizes'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                        $feedValues['sizes'] = [Str::limit($variant['option' . ($i + 1)], '95', '...')];
                                    }
                                    if ($materialMatch) {
                                        $dbValues['editedProduct']['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                        $feedValues['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    }
                                    if ($patternMatch) {
                                        $dbValues['editedProduct']['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                        $feedValues['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    }
                                endif;
                            endfor;
                        endif;
                    endif;
                    $dbVariant->update($dbValues['variant']);
                    if (isset($dbValues['productImage'])) :
                        $dbValues['productImage']['productId'] = $product['id'];
                        $dbValues['productImage']['variantId'] = $variant['id'];
                        $dbVariant->productImage()->update($dbValues['productImage']);
                    endif;
                    if (isset($dbValues['editedProduct'])) :
                        $dbValues['editedProduct']['shop_product_variant_id'] = $dbVariant['id'];
                        $dbValues['editedProduct']['user_id'] = $this->user->id;
                        $dbValues['editedProduct']['feed_setting_id'] = $feed['id'];
                        $dbValues['editedProduct']['productId'] = $product['id'];
                        $dbValues['editedProduct']['variantId'] = $variant['id'];
                        $dbVariant->editedProduct()->updateOrCreate(['shop_product_variant_id' => $dbVariant['id']], $dbValues['editedProduct']);
                    endif;
                    $toUpload[] = [
                        "batchId" => $key,
                        "merchantId" => $feed->merchantAccountId,
                        "method" => "update",
                        "productId" => $dbVariant['itemId'],
                        "product" => $feedValues
                    ];
                    if ($feed->variantSubmission == "first") :
                        break;
                    endif;
                endif;
            endforeach;
            $this->uploadBulkProductsToMerchantAccount(['entries' => $toUpload], $this->user);
        else :
            foreach ($dbProduct['variants'] as $key => $dbVariant) :
                $feedValues = [];
                $variant = collect($product['variants'])->where('id', $dbVariant->variantId)->first();
                if (isset($variant['title'])) :
                    $feedValues['availability'] = "out of stock";
                    if ($product['published_at']) :
                        if (isset($variant['inventory_quantity'])) :
                            $feedValues['availability'] = $variant['inventory_quantity'] > 0 ? "in stock" : "out of stock";
                        endif;
                    endif;
                    $toUpload[] = [
                        "batchId" => $key,
                        "merchantId" => $feed->merchantAccountId,
                        "method" => "update",
                        "productId" => $dbVariant['itemId'],
                        "product" => $feedValues
                    ];
                endif;
                $this->uploadBulkProductsToMerchantAccount(['entries' => $toUpload], $this->user);
            endforeach;
        endif;
    }

    public function manualUpdateProduct($feed, $dbProduct, $product)
    {
        $toUpload = [];
        $translatedAttributes = config('languageAttributes.' . $feed->language);
        if ($feed->language == $this->user->settings->language && $feed->currency == $this->user->settings->currency) :
            foreach ($dbProduct['variants'] as $key => $dbVariant) :
                if (empty($product['title']) || empty($product['body_html']) || !isset($product['image']['src']) || empty($product['image']['src'])) :
                    continue;
                endif;
                $dbValues = [];
                $feedValues = [];
                $variant = collect($product['variants'])->where('id', $dbVariant->variantId)->first();
                // $title = strpos($variant['title'], 'Default Title') !== false ? $product['title'] : $product['title'] . "/" . $variant['title'];
                // $description = $product['body_html'] ? Str::limit($product['body_html'], 4990, '(...)') : '';
                // $image = $variant['image_id'] != null ? collect($product['images'])->where('id', $variant['image_id'])->first() : $product['image'];
                if (isset($variant['title'])) :
                    $utmSource = $feed->utm_source != null ? '&utm_source=' . $feed->utm_source : '&utm_source=Google';
                    $utmMedium = $feed->utm_medium != null ? '&utm_medium=' . $feed->utm_medium : '&utm_medium=Shopping%20Ads';
                    $utmCampaign = $feed->utm_campaign != null ? '&utm_campaign=' . $feed->utm_campaign : '&utm_campaign=EasyFeed';

                    $feedValues = [
                        // 'title' => $title,
                        // 'description' => $description,
                        // 'imageLink' => $image['src'],
                        'canonicalLink' => "https://" . $this->user->settings->domain . "/collections/all/products/" . $product['handle'],
                        'mpn' => $variant['sku'],
                        'link' => "https://" . $this->user->settings->domain . "/collections/all/products/" . $product['handle'] . "?variant=" . $variant['id'] . $utmSource . $utmMedium . $utmCampaign,
                    ];

                    if (isset($product['product_type'])) :
                        if ($product['product_type']) :
                            $feedValues['productTypes'] = [$product['product_type']];
                        endif;
                    endif;

                    if (!empty($variant['weight']) && !empty($variant['weight_unit'])) :
                        $feedValues['shippingWeight'] = [
                            "value" => $variant['weight'],
                            "unit" => $variant['weight_unit']
                        ];
                        $dbValues['editedProduct']['shippingWeight'] = json_encode([
                            "value" => $variant['weight'],
                            "unit" => $variant['weight_unit']
                        ]);
                    endif;

                    if ($variant['barcode'] && $feed->barcode) :
                        $feedValues['gtin'] = $variant['barcode'];
                    endif;

                    $feedValues['availability'] = "out of stock";
                    if ($product['published_at']) :
                        if (isset($variant['inventory_quantity'])) :
                            $feedValues['availability'] = $variant['inventory_quantity'] > 0 ? "in stock" : "out of stock";
                        endif;
                    endif;

                    if ($feed->salePrice) :
                        if ($variant['compare_at_price']) :
                            if ($variant['compare_at_price'] > $variant['price']) :
                                $feedValues['price'] = [
                                    'value' => $variant['compare_at_price'],
                                    'currency' => $feed->currency
                                ];
                                $feedValues['salePrice'] = [
                                    'value' => $variant['price'],
                                    'currency' => $feed->currency
                                ];
                            else :
                                $feedValues['price'] = [
                                    "value" => $variant['price'],
                                    'currency' => $feed->currency
                                ];
                            endif;
                        else :
                            $feedValues['price'] = [
                                "value" => $variant['price'],
                                'currency' => $feed->currency
                            ];
                        endif;
                    else :
                        $feedValues['price'] = [
                            "value" => $variant['price'],
                            'currency' => $feed->currency
                        ];
                    endif;

                    $dbValues['variant'] = [
                        'user_id' => $this->user->id,
                        'feed_setting_id' => $feed->id,
                        'productId' => $product['id'],
                        'variantId' => $variant['id'],
                        // 'title' => $title,
                        // 'description' => $description,
                        // 'image' => $image['src'],
                        'product_category_id' => $feed->product_category_id,
                        'productTypes' => $product['product_type'] ? $product['product_type'] : null,
                        'brand' => $feed->brandSubmission == 'vendor' ? $product['vendor'] : $this->user->settings->domain,
                        'barcode' => $variant['barcode'],
                        'sku' => $variant['sku'],
                        'quantity' => $variant['inventory_quantity'] ?? 0,
                        'ageGroup' => $feed->ageGroup,
                        'gender' => $feed->gender,
                        'productCondition' => $feed->productCondition,
                        'score' => $this->scoreProduct($variant, $product, $feed),
                        'salePrice' => $variant['price'],
                        'comparePrice' => $feed->salePrice && $variant['compare_at_price'] ? $variant['compare_at_price'] : null,
                    ];
                    // if ($feed->additionalImages) :
                    //     $imageUrls = collect($product['images'])->take(10)->map(function ($image, $index) use (&$dbValues) {
                    //         $imageUrl = $image['src'];
                    //         $key = 'additionalImage' . sprintf('%02d', $index + 1);
                    //         $dbValues['productImage'][$key] = $imageUrl;
                    //         return $imageUrl;
                    //     })->toArray();
                    //     $feedValues['additionalImageLinks'] = $imageUrls;
                    // endif;
                    if ($feed->language == "en") :
                        for ($i = 0; $i < count($product['options']); $i++) :
                            if ($variant['option' . ($i + 1)]) :
                                if (str_contains(strtolower($product['options'][$i]['name']), 'color') || str_contains(strtolower($product['options'][$i]['name']), 'colour')) :
                                    $dbValues['editedProduct']['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    $feedValues['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                elseif (str_contains(strtolower($product['options'][$i]['name']), 'size')) :
                                    $dbValues['editedProduct']['sizes'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    $feedValues['sizes'] = [Str::limit($variant['option' . ($i + 1)], '95', '...')];
                                elseif (str_contains(strtolower($product['options'][$i]['name']), 'material')) :
                                    $dbValues['editedProduct']['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    $feedValues['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                elseif (str_contains(strtolower($product['options'][$i]['name']), 'pattern')) :
                                    $dbValues['editedProduct']['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
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
                                        $dbValues['editedProduct']['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                        $feedValues['color'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    }
                                    if ($sizeMatch) {
                                        $dbValues['editedProduct']['sizes'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                        $feedValues['sizes'] = [Str::limit($variant['option' . ($i + 1)], '95', '...')];
                                    }
                                    if ($materialMatch) {
                                        $dbValues['editedProduct']['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                        $feedValues['material'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    }
                                    if ($patternMatch) {
                                        $dbValues['editedProduct']['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                        $feedValues['pattern'] = Str::limit($variant['option' . ($i + 1)], '95', '...');
                                    }
                                endif;
                            endfor;
                        endif;
                    endif;
                    $dbVariant->update($dbValues['variant']);
                    // if (isset($dbValues['productImage'])) :
                    //     $dbValues['productImage']['productId'] = $product['id'];
                    //     $dbValues['productImage']['variantId'] = $variant['id'];
                    //     $dbVariant->productImage()->update($dbValues['productImage']);
                    // endif;
                    if (isset($dbValues['editedProduct'])) :
                        $dbValues['editedProduct']['shop_product_variant_id'] = $dbVariant['id'];
                        $dbValues['editedProduct']['user_id'] = $this->user->id;
                        $dbValues['editedProduct']['feed_setting_id'] = $feed['id'];
                        $dbValues['editedProduct']['productId'] = $product['id'];
                        $dbValues['editedProduct']['variantId'] = $variant['id'];
                        $dbVariant->editedProduct()->updateOrCreate(['shop_product_variant_id' => $dbVariant['id']], $dbValues['editedProduct']);
                    endif;
                    $toUpload[] = [
                        "batchId" => $key,
                        "merchantId" => $feed->merchantAccountId,
                        "method" => "update",
                        "productId" => $dbVariant['itemId'],
                        "product" => $feedValues
                    ];
                    if ($feed->variantSubmission == "first") :
                        break;
                    endif;
                endif;
            endforeach;
            $this->uploadBulkProductsToMerchantAccount(['entries' => $toUpload], $this->user);
        else :
            foreach ($dbProduct['variants'] as $key => $dbVariant) :
                $feedValues = [];
                $variant = collect($product['variants'])->where('id', $dbVariant->variantId)->first();
                if (isset($variant['title'])) :
                    $feedValues['availability'] = "out of stock";
                    if ($product['published_at']) :
                        if (isset($variant['inventory_quantity'])) :
                            $feedValues['availability'] = $variant['inventory_quantity'] > 0 ? "in stock" : "out of stock";
                        endif;
                    endif;
                    $toUpload[] = [
                        "batchId" => $key,
                        "merchantId" => $feed->merchantAccountId,
                        "method" => "update",
                        "productId" => $dbVariant['itemId'],
                        "product" => $feedValues
                    ];
                endif;
                $this->uploadBulkProductsToMerchantAccount(['entries' => $toUpload], $this->user);
            endforeach;
        endif;
    }

    public function generateNotification($product)
    {
        $allProducts = ShopProduct::where([
            'user_id' => $this->user->id,
            'productId' => $product['id']
        ])->first();
        if ($allProducts) :
            $notification = [
                'user_id' => $this->user->id,
                'notification_type' => 'update',
                'title' => $product['title'],
                'productId' => $product['id'],
                'image' => $product['image']['src'] ?? null,
                'update_at_shopify' => $product['updated_at'],
                'expiration_date' => Carbon::now()->addDays(7),
            ];
            $response = Notification::updateOrCreate(['productId' => $product['id'], 'user_id' => $this->user->id], $notification);
        endif;
    }
}
