<?php

namespace App\Jobs;

use App\Models\FeedSetting;
use App\Models\ShopProduct;
use Illuminate\Bus\Queueable;
use App\Models\ShopProductVariant;
use App\Http\Traits\GoogleApiTrait;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class BulkDeleteProductsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, GoogleApiTrait;
    protected $user;
    protected $products;
    protected $feedId;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($user, $data)
    {
        $this->user = $user;
        $this->products = $data['products'];
        $this->feedId = $data['feedId'];
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $feed = FeedSetting::where('id', $this->feedId)->first();
        $toDelete = [];
        foreach ($this->products as $key => $product) :
            $toDelete[] = [
                "batchId" => $key,
                "merchantId" => $feed->merchantAccountId,
                "method" => "delete",
                'productId' => $product['itemId']
            ];
            $product->delete();
            $productexist = ShopProductVariant::where([
                'productId' => $product->productId,
                'feed_setting_id' => $feed->id,
            ])->first();
            if (!$productexist) :
                ShopProduct::where([
                    'productId' => $product->productId,
                    'feed_setting_id' => $feed->id,
                ])->delete();
            endif;
        endforeach;
        $this->deleteBulkProductsFromMerchantAccount(['entries' => $toDelete], $this->user);
    }
}
