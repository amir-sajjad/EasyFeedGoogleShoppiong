<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use App\Http\Traits\GoogleApiTrait;
use App\Models\FeedSetting;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class DeleteAllFeedsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, GoogleApiTrait;
    protected $user;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $feedSettings = FeedSetting::where('user_id', $this->user->id)->get();
        foreach ($feedSettings as $key => $feed) :
            $feed->load('shopProductVariants');
            $count = 1;
            $limit = $feed->variantSubmission == 'all' ? 10 : 1000;
            foreach ($feed->shopProductVariants->chunk($limit) as $chunk) :
                $toDelete = [];
                foreach ($chunk as $p) :
                    $toDelete[] = [
                        "batchId" => $count,
                        "merchantId" => $feed->merchantAccountId,
                        "method" => "delete",
                        'productId' => $p['itemId']
                    ];
                    $count++;
                endforeach;
                $this->deleteBulkProductsFromMerchantAccount(['entries' => $toDelete], $this->user);
            endforeach;
            $feed->delete();
        endforeach;
        $this->user->settings->update([
            // "storeFrontAccessToken" => null,
            "googleAccessToken" => null,
            "googleRefreshToken" => null,
            "googleAccountId" => null,
            "googleAccountName" => null,
            "googleAccountEmail" => null,
            "googleAccountAvatar" => null,
            "merchantAccountId" => null,
            "merchantAccountName" => null,
        ]);
    }
}
