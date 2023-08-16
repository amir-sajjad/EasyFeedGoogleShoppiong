<?php

namespace App\Jobs;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use App\Models\ShopProductVariant;
use App\Http\Traits\GoogleApiTrait;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class SyncSingleFeedStatusJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, GoogleApiTrait;
    public $timeout = 9000;
    public $tries = 1;
    protected $user;
    protected $feed;
    protected $userSync;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($user, $feed, $userSync)
    {
        $this->user = $user;
        $this->feed = $feed;
        $this->userSync = $userSync;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $variantsQuery = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku'])->where('feed_setting_id', $this->feed->id);
        $chunkLimit = $this->feed->variantSubmission == 'all' ? 1000 : 1000;
        $variantsQuery->chunk($chunkLimit, function ($variants) {
            $this->updateProductStatusesFromMerchant($variants, $this->feed, $this->user);
        });
        if ($this->userSync) {
            $this->feed->update(['last_updated' => now()->toDateString()]);
        }
    }
}
