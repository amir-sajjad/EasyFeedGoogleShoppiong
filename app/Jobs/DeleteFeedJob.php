<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use App\Models\ShopProductVariant;
use App\Http\Traits\GoogleApiTrait;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class DeleteFeedJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, GoogleApiTrait;
    public $timeout = 9000;
    public $tries = 1;
    protected $user;
    protected $feed;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($user, $feed)
    {
        $this->user = $user;
        $this->feed = $feed;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $count = 1;
        $variantsQuery = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku'])->where('feed_setting_id', $this->feed->id);
        $variantsQuery->chunk(500, function ($variants) use ($count) {
            $toDelete = [];
            foreach ($variants as $p) :
                $toDelete[] = [
                    "batchId" => $count,
                    "merchantId" => $this->feed->merchantAccountId,
                    "method" => "delete",
                    'productId' => $p['itemId']
                ];
                $count++;
            endforeach;
            $this->deleteBulkProductsFromMerchantAccount(['entries' => $toDelete], $this->user);
            // $variants->each->delete();
        });
        $this->feed->delete();
    }
}
