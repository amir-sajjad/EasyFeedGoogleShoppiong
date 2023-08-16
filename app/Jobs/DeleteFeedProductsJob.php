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

class DeleteFeedJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, GoogleApiTrait;
    protected $user;
    protected $feedId;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($user, $feedid)
    {
        $this->user = $user;
        $this->feedId = $feedid;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $feedSetting = FeedSetting::where('id', $this->feedId)->with('shopProductVariants')->first();
        $count = 1;
        $limit = $feedSetting->variantSubmission == 'all' ? 10 : 1000;
        foreach ($feedSetting->shopProductVariants->chunk($limit) as $chunk) :
            $toDelete = [];
            foreach ($chunk as $p) :
                $toDelete[] = [
                    "batchId" => $count,
                    "merchantId" => $feedSetting->merchantAccountId,
                    "method" => "delete",
                    'productId' => $p['itemId']
                ];
                $count++;
            endforeach;
            $this->deleteBulkProductsFromMerchantAccount(['entries' => $toDelete], $this->user);
        endforeach;
    }
}
