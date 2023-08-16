<?php

namespace App\Jobs;

use stdClass;
use App\Models\User;
use App\Models\FeedSetting;
use App\Models\ShopProduct;
use App\Models\ShopProductVariant;
use Illuminate\Bus\Queueable;
use App\Http\Traits\GoogleApiTrait;
use App\Models\DraftProduct;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Osiset\ShopifyApp\Objects\Values\ShopDomain;

class ProductsDeleteJob implements ShouldQueue
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
        $product = json_decode(json_encode($this->data), true);
        $user = User::where('name', $this->shopDomain->toNative())->whereNull('deleted_at')->whereNotNull('password')->whereHas('settings', function ($query) {
            $query->whereNotNull('merchantAccountId');
            $query->where('setup', 1);
        })->with('settings')->first();
        if ($user) :
            $products = ShopProduct::where([
                'user_id' => $user->id,
                'productId' => $product['id']
            ])->with('variants', 'feedSetting')->get();
            if ($products) :
                $count = 0;
                $toDelete = [];
                foreach ($products as $key => $dbproduct) :
                    $feed = FeedSetting::where('id', $dbproduct->feed_setting_id)->first();
                    foreach ($dbproduct->variants as $var => $variant) :
                        $toDelete[] = [
                            "batchId" => $count,
                            "merchantId" => $feed->merchantAccountId,
                            "method" => "delete",
                            'productId' => $variant['itemId']
                        ];
                        $count++;
                    endforeach;
                    $dbproduct->delete();
                endforeach;
                $this->deleteBulkProductsFromMerchantAccount(['entries' => $toDelete], $user);
            endif;
            $draftProducts = DraftProduct::where('draftProductId', $product['id'])->get();
            if ($draftProducts) :
                $draftProducts->each->delete();
            endif;
        endif;
        return true;
    }
}
