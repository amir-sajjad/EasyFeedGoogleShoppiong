<?php

namespace App\Jobs;

use App\Models\FeedSetting;
use App\Models\Notification;
use Illuminate\Bus\Queueable;
use App\Models\ShopProductVariant;
use App\Http\Traits\GoogleApiTrait;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class SyncLocalInventoryFeed implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, GoogleApiTrait;
    public $timeout = 9000;
    public $tries = 1;
    protected $user;
    protected $localInventoryFeed;
    protected $toUpload;

    /**
     * Create a new job instance.
     **/
    public function __construct($data)
    {
        $this->user = $data['user'];
        $this->localInventoryFeed = $data['localInventoryFeed'];
        $this->toUpload = [];
    }

    /**
     * Execute the job.
     **/
    public function handle(): void
    {
        $primaryFeedSetting = FeedSetting::where('id', $this->localInventoryFeed['feed_setting_id'])->where('user_id', $this->user->id)->first();
        if (isset($primaryFeedSetting['id'])) :
            if ($this->localInventoryFeed->feed_type == "local") :
                $allProducts = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku', 'comparePrice', 'salePrice', 'quantity'])->where('user_id', $this->user->id)->where('feed_setting_id', $primaryFeedSetting->id);
                $allProducts->chunk(1000, function ($products) use ($primaryFeedSetting) {
                    $this->syncLocalInventory($products, $primaryFeedSetting);
                });
            elseif ($this->localInventoryFeed->feed_type == "regional") :
                $allProducts = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku', 'comparePrice', 'salePrice', 'quantity'])->where('user_id', $this->user->id)->where('feed_setting_id', $primaryFeedSetting->id);
                $allProducts->chunk(1000, function ($products) use ($primaryFeedSetting) {
                    $this->syncRegionalInventory($products, $primaryFeedSetting);
                });
            endif;
        endif;
        info(json_encode(['user' => $this->user->name, 'EasyfeedMessage' => "Local Inventory Feed Job Ends here"]));
    }

    public function syncLocalInventory($products, $feed)
    {
        if (count($products) > 0) :
            $this->toUpload = [];
            foreach ($products as $key => $product) :
                $localInventory = [];
                $localInventory = [
                    'storeCode' => $this->localInventoryFeed->code,
                    'quantity' => $product->quantity,
                    'price' => [
                        'currency' => $feed->currency,
                        'value' => $product->salePrice,
                    ],
                ];
                if ($this->localInventoryFeed->salePrice) :
                    if (!empty($product->comparePrice) && $product->comparePrice > $product->salePrice) :
                        $localInventory['price']['value'] = $product->comparePrice;
                        $localInventory['salePrice'] = [
                            'currency' => $feed->currency,
                            'value' => $product->salePrice,
                        ];
                    endif;
                endif;
                if (!empty($this->localInventoryFeed->salePriceEffectiveDate)) :
                    $localInventory['salePriceEffectiveDate'] = $this->localInventoryFeed->salePriceEffectiveDate;
                endif;
                if (!empty($this->localInventoryFeed->availability)) :
                    $localInventory['availability'] = $this->localInventoryFeed->availability;
                endif;
                if (!empty($this->localInventoryFeed->instoreProductLocation)) :
                    $localInventory['instoreProductLocation'] = $this->localInventoryFeed->instoreProductLocation;
                endif;
                if (!empty($this->localInventoryFeed->pickupMethod)) :
                    $localInventory['pickupMethod'] = $this->localInventoryFeed->pickupMethod;
                endif;
                if (!empty($this->localInventoryFeed->pickupSla)) :
                    $localInventory['pickupSla'] = $this->localInventoryFeed->pickupSla;
                endif;
                $this->toUpload[] = [
                    "batchId" => $key,
                    "merchantId" => $feed['merchantAccountId'],
                    "method" => "insert",
                    "productId" => $product['itemId'],
                    "localInventory" => $localInventory,
                ];
            endforeach;
            $googleResponse = $this->SyncLocalInventoryFeedToMerchant(['entries' => $this->toUpload], $this->user);
            if (isset($googleResponse['entries'])) :
                if (isset($googleResponse['entries'][0]['errors']['code']) && isset($googleResponse['entries'][0]['errors']['message'])) :
                    info(json_encode(['user' => $this->user->name, 'reason' => $googleResponse['entries'][0]['errors']['message']]));
                    if ($googleResponse['entries'][0]['errors']['code'] == 400 && str_contains($googleResponse['entries'][0]['errors']['message'], "storeCode")) :
                        $this->generateNotification();
                    endif;
                endif;
            endif;
        endif;
    }

    public function syncRegionalInventory($products, $feed)
    {
        if (count($products) > 0) :
            $this->toUpload = [];
            foreach ($products as $key => $product) :
                $regionalInventory = [];
                $regionalInventory = [
                    'regionId' => $this->localInventoryFeed->code,
                    'price' => [
                        'currency' => $feed->currency,
                        'value' => $product->salePrice,
                    ],
                ];
                if ($this->localInventoryFeed->salePrice) :
                    if (!empty($product->comparePrice) && $product->comparePrice > $product->salePrice) :
                        $regionalInventory['price']['value'] = $product->comparePrice;
                        $regionalInventory['salePrice'] = [
                            'currency' => $feed->currency,
                            'value' => $product->salePrice,
                        ];
                    endif;
                endif;
                if (!empty($this->localInventoryFeed->salePriceEffectiveDate) && $this->localInventoryFeed->salePrice && isset($regionalInventory['salePrice'])) :
                    $regionalInventory['salePriceEffectiveDate'] = $this->localInventoryFeed->salePriceEffectiveDate;
                endif;
                if (!empty($this->localInventoryFeed->availability)) :
                    $regionalInventory['availability'] = $this->localInventoryFeed->availability;
                endif;
                $this->toUpload[] = [
                    "batchId" => $key,
                    "merchantId" => $feed['merchantAccountId'],
                    "method" => "insert",
                    "productId" => $product['itemId'],
                    "regionalInventory" => $regionalInventory,
                ];
            endforeach;
            $googleResponse = $this->SyncRegionalInventoryFeedToMerchant(['entries' => $this->toUpload], $this->user);
            if (isset($googleResponse['entries'])) :
                if (isset($googleResponse['entries'][0]['errors']) && isset($googleResponse['entries'][0]['errors']['code']) && isset($googleResponse['entries'][0]['errors']['message'])) :
                    info(json_encode(['user' => $this->user->name, 'reason' => $googleResponse['entries'][0]['errors']['message']]));
                    if ($googleResponse['entries'][0]['errors']['code'] == 400 && str_contains($googleResponse['entries'][0]['errors']['message'], "region_id")) :
                        $this->generateNotification();
                    endif;
                endif;
            endif;
        endif;
    }

    public function generateNotification()
    {
        if ($this->localInventoryFeed->feed_type == "local") :
            $notification = [
                'user_id' => $this->user->id,
                'notification_type' => 'error',
                'title' => "Invalid Store Code '" . $this->localInventoryFeed->code . "' in local inventory feed '" . $this->localInventoryFeed->feed_name . "'",
            ];
            Notification::create($notification);
        elseif ($this->localInventoryFeed->feed_type == "regional") :
            $notification = [
                'user_id' => $this->user->id,
                'notification_type' => 'error',
                'title' => "Invalid Region ID '" . $this->localInventoryFeed->code . "' in regional inventory feed '" . $this->localInventoryFeed->feed_name . "'",
            ];
            Notification::create($notification);
        endif;
    }
}
