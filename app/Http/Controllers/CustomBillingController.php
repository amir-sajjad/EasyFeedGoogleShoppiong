<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\FeedSetting;
use Osiset\ShopifyApp\Util;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\GoogleApiTrait;
use App\Http\Controllers\Controller;
use App\Jobs\UploadAllProductJobRest;
use Illuminate\Support\Facades\Redirect;
use App\Jobs\UploadAllProductJobStoreFront;
use Osiset\ShopifyApp\Actions\ActivatePlan;
use Osiset\ShopifyApp\Objects\Values\PlanId;
use App\Jobs\ExcludeCollectionProductsJobRest;
use Osiset\ShopifyApp\Objects\Values\ShopDomain;
use App\Jobs\ExcludeCollectionProductsJobStoreFront;
use App\Models\LocalInventoryFeed;
use Osiset\ShopifyApp\Objects\Values\ChargeReference;
use Osiset\ShopifyApp\Storage\Queries\Shop as ShopQuery;

class CustomBillingController extends Controller
{
    use GoogleApiTrait;

    public function processBill(int $plan, Request $request, ShopQuery $shopQuery, ActivatePlan $activatePlan)
    {
        $shop = $shopQuery->getByDomain(ShopDomain::fromNative($request->query('shop')));
        $host = urldecode($request->get('host'));
        if (!$request->has('charge_id')) {
            return redirect()->route('home', ['shop' => $shop->getDomain()->toNative()]);
        }
        $result = $activatePlan(
            $shop->getId(),
            PlanId::fromNative($plan),
            ChargeReference::fromNative((int) $request->query('charge_id')),
            $host
        );
        $user = User::where(['name' => $request->query('shop'), 'deleted_at' => null])->first();
        if ($user->isFreemium() || $user->isGrandfathered() || $user->plan_id != null) :
            if ($user->pendingFeeds != null) :
                $created_feed = FeedSetting::where('id', $user->pendingFeeds)->first();
                if ($created_feed->shipping == 'auto') :
                    if ($this->updateShippingtoMerchantAccount($user)) :
                        if ($created_feed->language == $user->settings->language && $created_feed->currency == $user->settings->currency) :
                            if (isset($created_feed->excludedCollections) && $created_feed->excludedCollections != null) :
                                ExcludeCollectionProductsJobRest::withChain([
                                    new UploadAllProductJobRest($user, $created_feed)
                                ])->onQueue('high')->dispatch($user, $created_feed);
                            else :
                                UploadAllProductJobRest::dispatch($user, $created_feed)->onQueue('high');
                            endif;
                            $user->update(['pendingFeeds' => null]);
                        else :
                            if (isset($created_feed->excludedCollections) && $created_feed->excludedCollections != null) :
                                ExcludeCollectionProductsJobStoreFront::withChain([
                                    new UploadAllProductJobStoreFront($user, $created_feed)
                                ])->onQueue('high')->dispatch($user, $created_feed);
                            else :
                                UploadAllProductJobStoreFront::dispatch($user, $created_feed)->onQueue('high');
                            endif;
                            $user->update(['pendingFeeds' => null]);
                        endif;
                    endif;
                else :
                    if ($created_feed->language == $user->settings->language) :
                        if (isset($created_feed->excludedCollections) && $created_feed->excludedCollections != null) :
                            ExcludeCollectionProductsJobRest::withChain([
                                new UploadAllProductJobRest($user, $created_feed)
                            ])->onQueue('high')->dispatch($user, $created_feed);
                        else :
                            UploadAllProductJobRest::dispatch($user, $created_feed)->onQueue('high');
                        endif;
                        $user->update(['pendingFeeds' => null]);
                    else :
                        if (isset($created_feed->excludedCollections) && $created_feed->excludedCollections != null) :
                            ExcludeCollectionProductsJobStoreFront::withChain([
                                new UploadAllProductJobStoreFront($user, $created_feed)
                            ])->onQueue('high')->dispatch($user, $created_feed);
                        else :
                            UploadAllProductJobStoreFront::dispatch($user, $created_feed);
                        endif;
                        $user->update(['pendingFeeds' => null]);
                    endif;
                endif;
            endif;
        endif;
        $userPlanLimits = $this->calculatePlanLimitations($user);
        if (config('shopify-app.billing_enabled')) :
            if (isset($userPlanLimits['feeds'])) :
                if ($userPlanLimits['feeds'] != 'Unlimited') :
                    if (count($user->feedSettings) > $userPlanLimits['feeds']) :
                        foreach ($user->feedSettings as $key => $feed_setting) :
                            if ($key + 1 > $userPlanLimits['feeds']) :
                                $feed_setting->update(['status' => false]);
                            endif;
                        endforeach;
                    endif;
                endif;
            endif;
        endif;
        if (config('shopify-app.billing_enabled')) :
            $features = config('appPlansLimits.planFeatureLimitations.' . $user->plan_id);
            if ($user->plan_id == null) :
                if ($user->isFreemium()) :
                    $features = [
                        "bulkEdit"          => true,
                        "customImage"       => false,
                        "metafieldsMapping" => false,
                        "includeExclude"    => false,
                        "importExport"      => false,
                        "promotion"         => false,
                        "localInventory"    => false,
                    ];
                elseif ($user->isGrandfathered()) :
                    $features = [
                        "bulkEdit"          => true,
                        "customImage"       => true,
                        "metafieldsMapping" => true,
                        "includeExclude"    => true,
                        "importExport"      => true,
                        "promotion"         => true,
                        "localInventory"    => true,
                    ];
                else :
                    $features = [
                        "bulkEdit"          => true,
                        "customImage"       => false,
                        "metafieldsMapping" => false,
                        "includeExclude"    => false,
                        "importExport"      => false,
                        "promotion"         => false,
                        "localInventory"    => false,
                    ];
                endif;
            else :
                $features = config('appPlansLimits.planFeatureLimitations.' . $user->plan_id);
            endif;
        else :
            $features = [
                "bulkEdit"          => true,
                "customImage"       => true,
                "metafieldsMapping" => true,
                "includeExclude"    => true,
                "importExport"      => true,
                "promotion"         => true,
                "localInventory"    => true,
            ];
        endif;
        if (!$features['localInventory']) :
            LocalInventoryFeed::where('user_id', $user->id)->update(['status' => false]);
        endif;
        $user->settings->update(['setup' => true]);
        return redirect()->route('home', ['host' => $request['host'], 'shop' => $request['shop']]);
        // return Redirect::route(Util::getShopifyConfig('route_names.loading'), [
        //     'shop' => $shop->getDomain()->toNative(),
        // ])->with(
        //     $result ? 'success' : 'failure',
        //     'billing'
        // );
    }

    public function applyCouponCode(Request $request)
    {
        if (!empty($request->post('coupon')) && !empty($request->post('selectedPlan'))) :
            $couponMatched = null;
            $couponCode = $request->post('coupon');
            $selectedPlan = $request->post('selectedPlan');
            $allowedPlanIds = [15, 16, 17, 18, 19, 20, 21, 22, 23];
            if (!in_array($selectedPlan, $allowedPlanIds)) :
                return response()->json(["status" => false, "message" => "Coupon Code Cannot Be Applied On This Plan"], 422);
            endif;
            $result = DB::table('coupons')->where('coupon_code', '=', $couponCode)->first();
            $plans = DB::table('plans')->pluck('name', 'id');
            // dd($result);
            if (!$result) return response()->json(["status" => false, "message" => "Invalid Coupon Code"], 422); //if $result is null
            if ($result->coupon_status) :
                $couponMatched = preg_match("~\b$result->coupon_code\b~", $couponCode) ? true : false;
                if ($result->discount_percentage === 75 && $selectedPlan != 23) return response()->json(["status" => false, "message" => "Coupon Code Is Not Valid For This Plan"], 422);
                return ($couponMatched === true)
                    ? response()->json(["status" => true, "message" => "Coupon Code Applied Successfully!", "discount" => $result->discount_percentage, "plans" => $plans])
                    : response()->json(["status" => false, "message" => "Invalid Coupon Code"], 422);
            endif;
            return response()->json(["status" => false, "message" => "Coupon Code Expired"], 422);
        endif;
    }

    public function getPlanName()
    {
        $userPlanName = null;
        $user = auth()->user();
        $user->load('settings');
        $shopifyPlanName = $user->settings->plan_display_name;
        $userTotalVariantsInShopify = $user->api()->rest('GET', '/admin/variants/count.json')['body']['count'];
        if (auth()->user()->isFreemium() || auth()->user()->isGrandfathered()) :
            $userPlanName = "Free";
        elseif (auth()->user()->plan_id == null) :
            $userPlanName = "No Plan Selected";
        else :
            $userPlanName = DB::table('plans')->where(['id' => $user->plan_id])->first()->name;
        endif;
        return json_encode(["status" => true, 'shopifyPlanName' => $shopifyPlanName, 'userPlanName' => $userPlanName, 'variantsCount' => $userTotalVariantsInShopify], 200);
    }

    public function freePlan()
    {
        $shopCharges = auth()->user()->api()->rest('GET', '/admin/api/2023-01/recurring_application_charges.json');
        $charges = $shopCharges['body']['recurring_application_charges'];
        $activeCharge = collect($charges)->where('status', 'active')->first();
        if (!empty($activeCharge)) :
            $chargeId = $activeCharge['id'];
            $planCancel = auth()->user()->api()->rest('DELETE', '/admin/api/2023-01/recurring_application_charges/' . $chargeId . '.json');
            if ($planCancel['status'] != 200) :
                info(json_encode($planCancel));
                return response()->json(['status' => true, "message" => "Unable to activate Free Plan. Please Try again"]);
            endif;
        endif;
        DB::table('users')->where('id', auth()->user()->id)->update(
            [
                'plan_id' => NULL,
                'shopify_freemium' => 1
            ]
        );
        $user = User::where(['id' => auth()->user()->id, 'deleted_at' => null])->first();
        if ($user->isFreemium() || $user->isGrandfathered() || $user->plan_id != null) :
            if ($user->pendingFeeds != null) :
                $created_feed = FeedSetting::where('id', $user->pendingFeeds)->first();
                if ($created_feed->shipping == 'auto') :
                    if ($this->updateShippingtoMerchantAccount($user)) :
                        if ($created_feed->language == $user->settings->language && $created_feed->currency == $user->settings->currency) :
                            if (isset($created_feed->excludedCollections) && $created_feed->excludedCollections != null) :
                                ExcludeCollectionProductsJobRest::withChain([
                                    new UploadAllProductJobRest($user, $created_feed)
                                ])->onQueue('high')->dispatch($user, $created_feed);
                            else :
                                UploadAllProductJobRest::dispatch($user, $created_feed)->onQueue('high');
                            endif;
                            $user->update(['pendingFeeds' => null]);
                        else :
                            if (isset($created_feed->excludedCollections) && $created_feed->excludedCollections != null) :
                                ExcludeCollectionProductsJobStoreFront::withChain([
                                    new UploadAllProductJobStoreFront($user, $created_feed)
                                ])->onQueue('high')->dispatch($user, $created_feed);
                            else :
                                UploadAllProductJobStoreFront::dispatch($user, $created_feed)->onQueue('high');
                            endif;
                            $user->update(['pendingFeeds' => null]);
                        endif;
                    endif;
                else :
                    if ($created_feed->language == $user->settings->language) :
                        if (isset($created_feed->excludedCollections) && $created_feed->excludedCollections != null) :
                            ExcludeCollectionProductsJobRest::withChain([
                                new UploadAllProductJobRest($user, $created_feed)
                            ])->onQueue('high')->dispatch($user, $created_feed);
                        else :
                            UploadAllProductJobRest::dispatch($user, $created_feed)->onQueue('high');
                        endif;
                        $user->update(['pendingFeeds' => null]);
                    else :
                        if (isset($created_feed->excludedCollections) && $created_feed->excludedCollections != null) :
                            ExcludeCollectionProductsJobStoreFront::withChain([
                                new UploadAllProductJobStoreFront($user, $created_feed)
                            ])->onQueue('high')->dispatch($user, $created_feed);
                        else :
                            UploadAllProductJobStoreFront::dispatch($user, $created_feed);
                        endif;
                        $user->update(['pendingFeeds' => null]);
                    endif;
                endif;
            endif;
        endif;
        $userPlanLimits = $this->calculatePlanLimitations($user);
        if (config('shopify-app.billing_enabled')) :
            if (isset($userPlanLimits['feeds'])) :
                if ($userPlanLimits['feeds'] != 'Unlimited') :
                    if (count($user->feedSettings) > $userPlanLimits['feeds']) :
                        foreach ($user->feedSettings as $key => $feed_setting) :
                            if ($key + 1 > $userPlanLimits['feeds']) :
                                $feed_setting->update(['status' => false]);
                            endif;
                        endforeach;
                    endif;
                endif;
            endif;
        endif;
        if (config('shopify-app.billing_enabled')) :
            $features = config('appPlansLimits.planFeatureLimitations.' . $user->plan_id);
            if ($user->plan_id == null) :
                if ($user->isFreemium()) :
                    $features = [
                        "bulkEdit"          => true,
                        "customImage"       => false,
                        "metafieldsMapping" => false,
                        "includeExclude"    => false,
                        "importExport"      => false,
                        "promotion"         => false,
                        "localInventory"    => false,
                    ];
                elseif ($user->isGrandfathered()) :
                    $features = [
                        "bulkEdit"          => true,
                        "customImage"       => true,
                        "metafieldsMapping" => true,
                        "includeExclude"    => true,
                        "importExport"      => true,
                        "promotion"         => true,
                        "localInventory"    => true,
                    ];
                else :
                    $features = [
                        "bulkEdit"          => true,
                        "customImage"       => false,
                        "metafieldsMapping" => false,
                        "includeExclude"    => false,
                        "importExport"      => false,
                        "promotion"         => false,
                        "localInventory"    => false,
                    ];
                endif;
            else :
                $features = config('appPlansLimits.planFeatureLimitations.' . $user->plan_id);
            endif;
        else :
            $features = [
                "bulkEdit"          => true,
                "customImage"       => true,
                "metafieldsMapping" => true,
                "includeExclude"    => true,
                "importExport"      => true,
                "promotion"         => true,
                "localInventory"    => true,
            ];
        endif;
        if (!$features['localInventory']) :
            LocalInventoryFeed::where('user_id', $user->id)->update(['status' => false]);
        endif;
        return response()->json(['status' => true, "message" => "Successfully Subscribed Free Plan "]);
    }
}
