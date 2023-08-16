<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use App\Http\Traits\CommonTrait;
use App\Http\Traits\ShopifyTrait;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class AfterAuthenticateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, ShopifyTrait, CommonTrait;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public $shopDomain;

    public function __construct($shopDomain)
    {
        $this->shopDomain = $shopDomain['name'];
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $shop = User::where('name', $this->shopDomain)->firstOrFail();
        if (!config('shopify-app.billing_enabled')) :
            $shop->update(['shopify_grandfathered' => 1]);
        endif;
        $setting = $shop->settings;
        if ($setting == null) :
            $themeId = "{$this->getMainThemeId($shop)}";
            $shopApi = $this->shopApi(['body', 'shop'], $shop);
            $storeFrontAccessToken = $this->createStoreFrontAccessToken($shop);
            $data = [
                'user_id' => $shop->id,
                'storeFrontAccessToken' => $storeFrontAccessToken,
                'themeId' => $themeId,
                'domain' => $shopApi['domain'],
                'country' => $shopApi['country_code'],
                'currency' => $shopApi['currency'],
                'language' => $shopApi['primary_locale'],
                'store_name' => $shopApi['name'],
                'store_email' => $shopApi['email'],
                'store_phone' => $shopApi['phone'],
                'country_name' => $shopApi['country_name'],
                'plan_display_name' => $shopApi['plan_display_name']
            ];
            $setting = Setting::create($data);
            $shop->load('settings');
        else :
            if ($shop->settings->storeFrontAccessToken == null) :
                $storeFrontAccessToken = $this->createStoreFrontAccessToken($shop);
                $shop->settings->update(['storeFrontAccessToken' => $storeFrontAccessToken]);
            endif;
        endif;
    }
}
