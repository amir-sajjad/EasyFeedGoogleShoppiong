<?php

namespace App\Jobs;

use stdClass;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Osiset\ShopifyApp\Objects\Values\ShopDomain;

class ShopUpdateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

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
    public $user;

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
        // Convert domain
        $this->shopDomain = ShopDomain::fromNative($this->shopDomain);
        $this->user = User::where('name', $this->shopDomain->toNative())->whereNull('deleted_at')->whereNotNull('password')->whereHas('settings')->with('settings')->first();
        $setting = [
            'user_id' => $this->user->id,
            'domain' => $this->data->domain,
            'country' => $this->data->country_code,
            'currency' => $this->data->currency,
            'language' => $this->data->primary_locale,
            'store_name' => $this->data->name,
            'store_email' => $this->data->email,
            'store_phone' => $this->data->phone,
            'country_name' => $this->data->country_name,
            'plan_display_name' => $this->data->plan_display_name
        ];
        $this->user->settings->update($setting);
        return true;

        // Do what you wish with the data
        // Access domain name as $this->shopDomain->toNative()
    }
}
