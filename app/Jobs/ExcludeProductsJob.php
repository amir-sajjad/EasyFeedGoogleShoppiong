<?php

namespace App\Jobs;

use App\Models\FeedSetting;
use App\Models\ShopProduct;
use Illuminate\Bus\Queueable;
use App\Models\ShopProductVariant;
use App\Http\Traits\GoogleApiTrait;
use App\Models\ExcludedProduct;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class ExcludeProductsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, GoogleApiTrait;
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
        $deleteRequests = [];
        $feed = FeedSetting::select(['id', 'merchantAccountId', 'productIdFormat', 'language', 'country', 'channel'])
            ->where('id', $this->data['feedId'])
            ->first();
        $merchantId = $feed->merchantAccountId;
        $deleteRequests = $this->data['products']->map(function ($product, $key) use ($feed, $merchantId) {
            $productId = $product['itemId'];
            $excludedProducts = [
                'user_id' => $this->user->id,
                'feed_setting_id' => $feed->id,
                'productId' => $product['productId'],
                'variantId' => $product['variantId'],
                'title' => $product['title'],
                'image' => $product['image'],
                'status' => 'ManualExclusion',
            ];
            ExcludedProduct::updateOrInsert([
                'user_id' => $this->user->id,
                'feed_setting_id' => $feed->id,
                'productId' => $product['productId'],
                'variantId' => $product['variantId'],
            ], $excludedProducts);
            $product->delete();
            $hasVariant = ShopProductVariant::where([
                'productId' => $product['productId'],
                'feed_setting_id' => $feed->id,
            ])->first();
            if (!$hasVariant) {
                ShopProduct::where([
                    'productId' => $product['productId'],
                    'feed_setting_id' => $feed->id,
                ])->delete();
            }
            return [
                'batchId' => $key,
                'merchantId' => $merchantId,
                'method' => 'delete',
                'productId' => $productId,
            ];
        })->toArray();
        $response = $this->deleteBulkProductsFromMerchantAccount(['entries' => $deleteRequests], $this->user);
    }
}
