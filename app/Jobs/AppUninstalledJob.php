<?php

namespace App\Jobs;

use stdClass;
use App\Models\User;
use App\Models\FeedSetting;
use App\Models\Notification;
use Illuminate\Bus\Queueable;
use App\Http\Traits\CommonTrait;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Osiset\ShopifyApp\Actions\CancelCurrentPlan;
use Osiset\ShopifyApp\Objects\Values\ShopDomain;
use Osiset\ShopifyApp\Contracts\Queries\Shop as IShopQuery;
use Osiset\ShopifyApp\Contracts\Commands\Shop as IShopCommand;

class AppUninstalledJob implements ShouldQueue
// class AppUninstalledJob extends \Osiset\ShopifyApp\Messaging\Jobs\AppUninstalledJob
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, CommonTrait;

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
     * @param IShopCommand      $shopCommand             The commands for shops.
     * @param IShopQuery        $shopQuery               The querier for shops.
     * @param CancelCurrentPlan $cancelCurrentPlanAction The action for cancelling the current plan.
     *
     * @return bool
     */
    public function handle(
        IShopCommand $shopCommand,
        IShopQuery $shopQuery,
        CancelCurrentPlan $cancelCurrentPlanAction
    ): bool {
        $this->shopDomain = ShopDomain::fromNative($this->shopDomain);
        $shop = User::where('name', $this->shopDomain->toNative())->with('feedSettings')->first();
        if ($shop) :
            // $shop->status = false;
            Notification::where('user_id', $shop->id)->delete();
            $shop->update(['pendingFeeds' => null]);
            $shop->settings->update([
                'setup' => false,
                'storeFrontAccessToken' => null,
                'googleAccessToken' => null,
                'googleRefreshToken' => null,
                'googleAccountId' => null,
                'googleAccountName' => null,
                'googleAccountEmail' => null,
                'googleAccountAvatar' => null,
                'merchantAccountId' => null,
                'merchantAccountName' => null,
                'connectedMerchants' => null,
            ]);
            $shop->shopify_freemium = false;
            $shop->shopify_grandfathered = false;
            $shop->save();
            $shop->feedSettings->each->delete();
            $shop = $shopQuery->getByDomain($this->shopDomain);
            $shopId = $shop->getId();
            $cancelCurrentPlanAction($shopId);
            $shopCommand->clean($shopId);
            $shopCommand->softDelete($shopId);
        endif;
        return true;
    }
}
