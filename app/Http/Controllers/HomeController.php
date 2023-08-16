<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\FeedSetting;
use Illuminate\Http\Request;
use App\Models\SupportTicket;
use App\Models\FeatureRequest;
use App\Models\ExcludedProduct;
use App\Models\LocalInventoryFeed;
use App\Models\ShopProductVariant;
use App\Http\Traits\GoogleApiTrait;
use App\Http\Traits\ShopifyApiTrait;
use Osiset\ShopifyApp\Storage\Models\Plan;

class HomeController extends Controller
{
    use GoogleApiTrait, ShopifyApiTrait;

    public function getSetup()
    {
        $shop = auth()->user();
        $merchantConnected = $shop->settings->googleAccessToken && $shop->settings->merchantAccountId ? true : false;
        return json_encode(['setup' => $shop->settings->setup, 'merchantConnected' => $merchantConnected]);
    }

    public function getGoogleData()
    {
        $shop = auth()->user();
        $settings = [];
        if ($shop->settings->googleAccessToken) {
            $settings = [
                "email" => $shop->settings->googleAccountEmail,
                "name" => $shop->settings->googleAccountName,
                "image" => $shop->settings->googleAccountAvatar,
                "merchantAccountId" => $shop->settings->merchantAccountId,
                "domain" => $shop->settings->domain
            ];
            return json_encode(['settings' => $settings], $status = 200);
        } else {
            return json_encode(['error' => 'Not Connected'], $status = 404);
        }
    }

    public function getAccounts()
    {
        $merchantAccounts = [];
        $accounts = $this->getMerchantAccounts();
        if (count($accounts)) :
            foreach ($accounts as $key => $account) :
                if (isset($account['merchantId'])) {
                    $merchantAccounts[] = [
                        "value" => $account['merchantId'],
                        "label" => $account['merchantName'],
                    ];
                }
                foreach ($account['subAccounts'] as $subAccount) :
                    $merchantAccounts[] = [
                        "value" => $subAccount['id'],
                        "label" => $subAccount['name'],
                    ];
                endforeach;
            endforeach;
            return json_encode(['message' => "Accounts Retrieved Successfully.", "accounts" => $merchantAccounts], $status = 200);
        else :
            return json_encode(['error' => "Please Create Your Google Merchant Center Account."], $status = 404);
        endif;
    }

    public function getConnectionStatus()
    {
        if (auth()->user()->settings->googleRefreshToken) :
            return response()->json(["status" => true, "email" => auth()->user()->settings->googleAccountEmail, 'name' => auth()->user()->settings->googleAccountName, 'image' => auth()->user()->settings->googleAccountAvatar, 'success' => 'Please wait! We are getting account details.']);
        endif;
        return response()->json(["status" => false]);
    }

    public function getMarkets()
    {
        $markets = [];
        $count = 0;
        $response = $this->shopifyApiGraphQuery('getMarkets', null, null, ['body', 'data', 'markets']);
        // return $response;
        foreach ($response['nodes'] as $market) :
            if ($market['enabled']) :
                $markets[$count]['label'] = $market['name'];
                $markets[$count]['value'] = $market['id'];
                $count++;
            endif;
        endforeach;
        while ($response['pageInfo']['hasNextPage'] == true) {
            $arr[0] = "after:";
            $arr[1] = '"' . $response['pageInfo']['endCursor'] . '"';
            $response = $this->shopifyApiGraphQuery('getMarkets', $arr, null, ['body', 'data', 'markets']);
            // if (!isset($response['nodes'])) :
            // return $response;
            // endif;
            foreach ($response['nodes'] as $market) :
                if ($market['enabled']) :
                    $markets[$count]['label'] = $market['name'];
                    $markets[$count]['value'] = $market['id'];
                    $count++;
                endif;
            endforeach;
        }
        return response()->json(['status' => true, 'markets' => $markets]);
    }

    public function getMarketDetails(Request $request)
    {
        $country = [];
        $language = [];
        $currency = [];
        $marketLocales = [];
        $count = 0;
        $arr[] = $request->market_id;
        $response = json_decode(json_encode($this->shopifyApiGraphQuery('getSingleMarket', $arr, null, ['body', 'data', 'market'])), true);
        if (isset($response['webPresence']) && isset($response['webPresence']['defaultLocale']) && isset($response['webPresence']['alternateLocales'])) :
            $marketLocales = array_merge([$response['webPresence']['defaultLocale']], $response['webPresence']['alternateLocales']);
        endif;
        $locales = $this->shopifyApiGraphQuery('getShopLocale', null, null, ['body', 'data', 'shopLocales']);
        if (!empty($marketLocales)) :
            foreach ($marketLocales as $key => $locale) :
                foreach ($locales as $shopLocale) :
                    if ($shopLocale['locale'] == $locale) :
                        $language[$key] = [
                            'label' => $shopLocale['name'],
                            'value' => $shopLocale['locale']
                        ];
                        break;
                    endif;
                endforeach;
            endforeach;
        else :
            foreach ($locales as $locale) :
                if ($locale['locale'] == auth()->user()->settings->language) :
                    $language[0]['label'] = $locale['name'];
                    $language[0]['value'] = $locale['locale'];
                    break;
                endif;
            endforeach;
        endif;
        $currency[0]['label'] = $response['currencySettings']['baseCurrency']['currencyName'];
        $currency[0]['value'] = $response['currencySettings']['baseCurrency']['currencyCode'];
        foreach ($response['regions']['nodes'] as $region) {
            $country[$count]['label'] = $region['name'];
            $country[$count]['value'] = $region['code'];
            $count++;
        }
        while (isset($response['regions']) && $response['regions']['pageInfo']['hasNextPage'] == true) {
            $arr1[0] = $request->market_id;
            $arr1[1] = "after:";
            $arr1[2] = '"' . $response['regions']['pageInfo']['endCursor'] . '"';
            $response = $this->shopifyApiGraphQuery('getSingleMarket', $arr1, null, ['body', 'data', 'market']);
            if (isset($response['regions']) && $response['regions'] != null) :
                foreach ($response['regions']['nodes'] as $region) {
                    $country[$count]['label'] = $region['name'];
                    $country[$count]['value'] = $region['code'];
                    $count++;
                }
            endif;
        }
        $language = array_values($language);
        return response()->json(['status' => true, 'country' => $country, 'currency' => $currency, 'language' => $language]);
    }

    public function getFeedSettings()
    {
        $customCollections = $this->getCustomCollectionIds();
        $automatedCollections = $this->getAutomaticCollectionIds();
        $allCollections = array_merge($customCollections, $automatedCollections);
        return response()->json(['status' => true, "collections" => $allCollections]);
    }

    public function fetchFeedsData()
    {
        $shop = auth()->user();
        $userPlanLimits = $this->calculatePlanLimitations($shop);
        $billingStatus = config('shopify-app.billing_enabled');
        $feeds = FeedSetting::where('user_id', $shop->id)->with('category')->withCount('shopProducts', 'shopProductVariants')->get();
        return response()->json(['status' => true, 'feedSetting' => $feeds, 'merchantId' => auth()->user()->settings->merchantAccountId, 'planLimits' => $userPlanLimits, 'billingStatus' => $billingStatus]);
    }

    public function fetchAllFeeds()
    {
        $shop = auth()->user();
        $feeds = FeedSetting::where('user_id', $shop->id)->with('category')->withCount('shopProducts', 'shopProductVariants')->get();
        return response()->json(['feedSettings' => $feeds, 'userSettings' => $shop->settings]);
    }

    public function userTickets()
    {
        $shop = auth()->user();
        $tickets = SupportTicket::where('user_id', $shop->id)->get();
        return response()->json(['status' => true, 'tickets' => $tickets]);
    }

    public function singleTicketDetail(Request $request)
    {
        $shop = auth()->user();
        $ticket = SupportTicket::where([
            'id' => $request->id,
            'user_id' => $shop->id
        ])->with('replies')->with('attachments')->first();
        if ($ticket) :
            return response()->json(['status' => true, 'ticket' => $ticket, 'userSettings' => $shop->settings]);
        else :
            return response()->json(["error" => "The Ticket does not exist"], 404);
        endif;
    }

    public function allSuggestions(Request $request)
    {
        $shop = auth()->user();
        $featureSuggestions = FeatureRequest::withCount([
            'votes',
            'votes as positiveVotes' => function ($query) {
                $query->where('positive', true);
            }
        ])->withCount([
            'votes',
            'votes as negativeVotes' => function ($query) {
                $query->where('negative', true);
            }
        ])->get()->all();
        return response()->json(['status' => true, 'suggestions' => $featureSuggestions]);
    }

    public function singleFeatureDetail(Request $request)
    {
        $shop = auth()->user();
        $feature = FeatureRequest::where([
            'id' => $request->id,
        ])->with('replies')->with('attachments')->first();
        if ($feature) :
            return response()->json(['status' => true, 'feature' => $feature, 'userSettings' => $shop->settings]);
        else :
            return response()->json(['status' => false, 'feature' => $feature, 'userSettings' => $shop->settings]);
        endif;
    }

    public function getCounts($id)
    {
        $result = FeedSetting::where('id', $id)->withCount([
            'shopProductVariants',
            'shopProductVariants as disApproved' => function ($query) {
                $query->where('status', 'Disapproved');
            }
        ])->withCount([
            'shopProductVariants',
            'shopProductVariants as approved' => function ($query) {
                $query->where('status', 'Approved');
            }
        ])->withCount([
            'shopProductVariants',
            'shopProductVariants as pending' => function ($query) {
                $query->where('status', 'Pending');
            }
        ])->withCount('excludedProducts')->with('category')->first();
        return response()->json(['status' => true, 'totalCount' => $result->shop_product_variants_count, 'appCount' => $result->approved, 'disappCount' => $result->disApproved, 'pendCount' => $result->pending, 'exclCount' => $result->excluded_products_count]);
    }

    public function getAllProducts($id, Request $request)
    {
        $shop = auth()->user();
        $limit = $request->input('limit', 50);
        $query = $request->input('search', "");
        $scoreRange = $request->input('scoreRange', "0-100");
        $rangeArray = explode('-', $scoreRange);
        $products = ShopProductVariant::where([
            'user_id' => $shop->id,
            'feed_setting_id' => $id,
            ['title', 'like', "%{$query}%"],
            ['score', '>=', intval($rangeArray[0])],
            ['score', '<=', intval($rangeArray[1])]
        ])->with('productLabel')->with('category')->with('editedProduct:shop_product_variant_id,promotionIds,color')->paginate($limit);
        if ($products) :
            return response()->json(['status' => true, 'products' => $products]);
        else :
            return response()->json(['status' => false, 'message' => 'No Record Found']);
        endif;
    }

    public function getAppProducts($id, Request $request)
    {
        $shop = auth()->user();
        $limit = $request->input('limit', 50);
        $query = $request->input('search', "");
        $scoreRange = $request->input('scoreRange', "0-100");
        $rangeArray = explode('-', $scoreRange);
        $products = ShopProductVariant::where([
            'user_id' => $shop->id,
            'feed_setting_id' => $id,
            'status' => "Approved",
            ['title', 'like', "%{$query}%"],
            ['score', '>=', intval($rangeArray[0])],
            ['score', '<=', intval($rangeArray[1])]
        ])->with('productLabel')->with('category')->with('editedProduct:shop_product_variant_id,promotionIds')->paginate($limit);
        if ($products) :
            return response()->json(['status' => true, 'products' => $products]);
        else :
            return response()->json(['status' => false, 'message' => 'No Record Found']);
        endif;
    }

    public function getDisappProducts($id, Request $request)
    {
        $shop = auth()->user();
        $limit = $request->input('limit', 50);
        $query = $request->input('search', "");
        $scoreRange = $request->input('scoreRange', "0-100");
        $rangeArray = explode('-', $scoreRange);
        $products = ShopProductVariant::where([
            'user_id' => $shop->id,
            'feed_setting_id' => $id,
            'status' => "Disapproved",
            ['title', 'like', "%{$query}%"],
            ['score', '>=', intval($rangeArray[0])],
            ['score', '<=', intval($rangeArray[1])]
        ])->with('productLabel')->with('category')->with('editedProduct:shop_product_variant_id,promotionIds')->paginate($limit);
        if ($products) :
            return response()->json(['status' => true, 'products' => $products]);
        else :
            return response()->json(['status' => false, 'message' => 'No Record Found']);
        endif;
    }

    public function getPendProducts($id, Request $request)
    {
        $shop = auth()->user();
        $limit = $request->input('limit', 50);
        $query = $request->input('search', "");
        $scoreRange = $request->input('scoreRange', "0-100");
        $rangeArray = explode('-', $scoreRange);
        $products = ShopProductVariant::where([
            'user_id' => $shop->id,
            'feed_setting_id' => $id,
            'status' => "Pending",
            ['title', 'like', "%{$query}%"],
            ['score', '>=', intval($rangeArray[0])],
            ['score', '<=', intval($rangeArray[1])]
        ])->with('productLabel')->with('category')->with('editedProduct:shop_product_variant_id,promotionIds')->paginate($limit);
        if ($products) :
            return response()->json(['status' => true, 'products' => $products]);
        else :
            return response()->json(['status' => false, 'message' => 'No Record Found']);
        endif;
    }

    public function getExclProducts($id, Request $request)
    {
        $shop = auth()->user();
        $limit = $request->input('limit', 50);
        $query = $request->input('search', "");
        $products = ExcludedProduct::where([
            'user_id' => $shop->id,
            'feed_setting_id' => $id,
            ['title', 'like', "%{$query}%"]
        ])->paginate($limit);
        if ($products) :
            return response()->json(['status' => true, 'products' => $products]);
        else :
            return response()->json(['status' => false, 'message' => 'No Record Found']);
        endif;
    }

    public function getMetafields(Request $request)
    {
        $validator = validator($request->all(), config('formValidation.getMetafieldsform'));
        if ($validator->fails()) :
            return response()->json(['status' => false, 'errors' => $validator->errors()]);
        endif;
        $validated = $validator->validated();
        if ($validated['resourceType'] == 'product') :
            $metafields = $this->getProductMetafields();
        elseif ($validated['resourceType'] == 'variant') :
            $metafields = $this->getVariantMetafields();
        endif;
        return response()->json(['status' => true, 'metafields' => $metafields]);
    }

    public function getStoreProducts(Request $request)
    {
        $shop = auth()->user();
        $products = [];
        if ($request->has('page_info')) :
            $results = $this->shopifyApiRequest("getProducts", null, ['limit' => 250, 'page_info' => $request->page_info], null, $shop);
        else :
            $results = $this->shopifyApiRequest("getProducts", null, ['limit' => 250, 'status' => 'active'], null, $shop);
        endif;
        if (isset($results['body']['products'])) :
            $products['products'] = $results['body']['products'];
            if ($results['link'] != null) :
                if ($results['link']['next'] != null) :
                    $products['next'] = true;
                    $products['nextLink'] = $results['link']['next'];
                else :
                    $products['next'] = false;
                    $products['nextLink'] = null;
                endif;
            else :
                $products['next'] = false;
                $products['nextLink'] = null;
            endif;
        endif;
        return response()->json(['status' => true, 'results' => $products]);
    }

    public function feedDetails(Request $request)
    {
        $isOlderThan10Minutes = true;
        $feed = FeedSetting::where('id', $request->feedId)->with('category')->withCount('shopProducts', 'shopProductVariants')->first();
        $createdAt = Carbon::parse($feed->getRawOriginal('created_at'));
        $isOlderThan10Minutes = $createdAt->diffInMinutes() > 10;
        $merchantId = auth()->user()->settings->merchantAccountId;
        return response()->json(['status' => true, 'feed' => $feed, 'merchantId' => $merchantId, 'older' => $isOlderThan10Minutes]);
    }

    public function getAccountLevelIssues(Request $request)
    {
        $accountIssues = $this->getAccountStatusesFromMerchant(auth()->user());
        return response()->json(['status' => true, 'accountIssues' => $accountIssues]);
    }

    public function productsGetById(Request $request)
    {
        $single_p = ShopProductVariant::where('id', $request->ids)->with('productLabel')->with('editedProduct')->with('productImage')->with('category')->first();
        return ($single_p);
    }

    public function getUserPlanDetails()
    {
        $shop = auth()->user();
        $skusPercentage = 0;
        $feedsPercentage = 0;
        $userTotalVariantsInShopify = $shop->api()->rest('GET', '/admin/variants/count.json')['body']['count'];
        $userTotalVariantsInApp = $shop->shop_product_variants_count;
        $userPlanLimitations = $this->calculatePlanLimitations($shop);
        $userTotalFeeds = count($shop->feedSettings);
        if ($shop->plan_id != null) :
            $userPlanName = Plan::select('name')->where('id', $shop->plan_id)->first()->name;
        else :
            if ($shop->isFreemium()) :
                $userPlanName = "Free";
            elseif ($shop->isGrandfathered()) :
                $userPlanName = "Free";
            else :
                $userPlanName = "No Plan Selected";
            endif;
        endif;
        if (isset($userPlanLimitations['skus']) && isset($userPlanLimitations['feeds'])) :
            if ($userPlanLimitations['skus'] != "Unlimited" && $userPlanLimitations['feeds'] != "Unlimited") :
                $skusPercentage = $userTotalVariantsInApp / $userPlanLimitations['skus'];
                $skusPercentage = $skusPercentage * 100;
                $feedsPercentage = $userTotalFeeds / $userPlanLimitations['feeds'];
                $feedsPercentage = $feedsPercentage * 100;
            endif;
        endif;
        return response()->json([
            'status' => true,
            'variantsInShopify' => $userTotalVariantsInShopify,
            'variantsInApp' => $userTotalVariantsInApp,
            'planLimits' => $userPlanLimitations,
            'userFeedCount' => $userTotalFeeds,
            'planName' => $userPlanName,
            'skusPercentage' => $skusPercentage,
            'feedsPercentage' => $feedsPercentage
        ]);
    }

    public function dataGet($id, $resource)
    {
        if ($resource == "excluded") :
            $products = ExcludedProduct::where(['user_id' => auth()->user()->id, 'feed_setting_id' => $id])->pluck('id');
        else :
            $products = ShopProductVariant::where(['user_id' => auth()->user()->id, 'feed_setting_id' => $id])->pluck('id');
        endif;
        return response()->json(['status' => true, 'allProducts' => $products]);
    }

    public function getLocalFeeds()
    {
        $shop = auth()->user();
        $localFeeds = LocalInventoryFeed::where('user_id', $shop->id)->get();
        return response()->json(['status' => true, 'localFeeds' => $localFeeds]);
    }
}
