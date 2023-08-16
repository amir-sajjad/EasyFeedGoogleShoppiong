<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use App\Http\Traits\GoogleApiTrait;
use App\Models\FeedSetting;
use App\Models\ShopProduct;
use App\Models\ShopProductVariant;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class DeleteSingleProductJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, GoogleApiTrait;
    protected $user;
    protected $product;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($user, $product)
    {
        $this->user = $user;
        $this->product = $product;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $feed = FeedSetting::where('id', $this->product->feed_setting_id)->first();
        $count = 1;
        $toDelete = [
            "batchId" => $count,
            "merchantId" => $feed->merchantAccountId,
            "method" => "delete",
            'productId' => $this->product['itemId']
        ];
        $this->deleteBulkProductsFromMerchantAccount(['entries' => $toDelete], $this->user);
        $this->product->delete();
        $product = ShopProductVariant::where([
            'productId' => $this->product->productId,
            'feed_setting_id' => $feed->id,
        ])->first();
        if (!$product) :
            ShopProduct::where([
                'productId' => $this->product->productId,
                'feed_setting_id' => $feed->id,
            ])->delete();
        endif;
    }
}
