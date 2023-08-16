<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Vote;
use App\Models\Reply;
use App\Jobs\DeleteFeedJob;
use App\Models\FeedSetting;
use Illuminate\Support\Str;
use App\Models\DraftProduct;
use App\Models\Notification;
use App\Models\ProductLabel;
use Illuminate\Http\Request;
use App\Models\EditedProduct;
use App\Models\SupportTicket;
use App\Models\FeatureRequest;
use App\Jobs\DeleteAllFeedsJob;
use App\Models\ExcludedProduct;
use App\Models\ProductCategory;
use App\Jobs\EditBulkProductJob;
use App\Jobs\ExcludeProductsJob;
use App\Jobs\GetPromotionDetails;
use App\Jobs\UpdateProductImages;
use App\Models\LocalInventoryFeed;
use App\Models\ShopProductVariant;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\GoogleApiTrait;
use App\Jobs\AddNewProductsJobRest;
use App\Jobs\BulkDeleteProductsJob;
use App\Jobs\DeleteSingleProductJob;
use App\Jobs\IncludeProductsJobRest;
use App\Jobs\SyncLocalInventoryFeed;
use App\Jobs\SyncSingleFeedStatusJob;
use App\Jobs\UpdateProductDetailsJob;
use App\Jobs\UploadAllProductJobRest;
use App\Jobs\SyncDataFromShopifyJobRest;
use App\Jobs\AddNewProductsJobStoreFront;
use App\Jobs\IncludeProductsJobStoreFront;
use App\Jobs\UploadAllProductJobStoreFront;
use App\Jobs\ExcludeCollectionProductsJobRest;
use App\Jobs\SyncDataFromShopifyJobStoreFront;
use App\Jobs\ExcludeCollectionProductsJobStoreFront;

class WelcomeController extends Controller
{
    use GoogleApiTrait;

    public function index()
    {
        $googleProductCategories = ProductCategory::all();
        return view('welcome', compact('googleProductCategories'));
    }

    public function fallBack()
    {
        $googleProductCategories = ProductCategory::all();
        return view('welcome', compact('googleProductCategories'));
    }

    public function stepperPricing()
    {
        $googleProductCategories = ProductCategory::all();
        return view('welcome', compact('googleProductCategories'));
    }

    public function dashboard()
    {
        $googleProductCategories = ProductCategory::all();
        return view('welcome', compact('googleProductCategories'));
    }

    public function loadingPage()
    {
        $googleProductCategories = ProductCategory::all();
        return view('welcome', compact('googleProductCategories'));
    }

    public function sync(Request $request)
    {
        $shop = auth()->user();
        $features = json_decode($this->featuresStatus());
        $userPlanLimits = $this->calculatePlanLimitations($shop);
        if (!$shop->settings->merchantAccountId) :
            return response()->json(['error' => "You Must Connect A Merchant Account To Sync.", 'status' => false]);
        endif;
        $validator = validator($request->all(), config('formValidation.syncForm'));
        if ($validator->fails()) :
            return response()->json(['errors' => $validator->errors()], $status = 500);
        endif;
        $validated = $validator->validated();
        if ($validated['channel'] == "local" && !$features->features->localInventory) :
            return response()->json(['error' => "Invalid Channel", 'status' => false]);
        endif;
        if (isset($validated['excludedCollections'])) :
            $validated['excludedCollections'] = json_encode($request->excludedCollections);
        endif;
        if (isset($validated['includedCollections'])) :
            $validated['includedCollections'] = json_encode($request->includedCollections);
        endif;
        if (isset($validated['productIdentifiers'])) :
            if ($validated['productIdentifiers'] == 'true') :
                $validated['productIdentifiers'] = true;
            elseif ($validated['productIdentifiers'] == 'false') :
                $validated['productIdentifiers'] = false;
            endif;
        endif;
        if (isset($validated['excludedCollections'])) :
            if ($validated['excludedCollections'] == "[]") :
                $validated['excludedCollections'] = null;
            endif;
        endif;
        $validated['user_id'] = $shop->id;
        $validated['merchantAccountId'] = $shop->settings->merchantAccountId;
        $validated['merchantAccountName'] = $shop->settings->merchantAccountName;
        if ($shop->settings->setup) :
            if (config('shopify-app.billing_enabled')) :
                if (isset($userPlanLimits['skus']) && isset($userPlanLimits['feeds'])) :
                    if ($userPlanLimits['skus'] != "Unlimited" && $userPlanLimits['feeds'] != "Unlimited") :
                        if (count($shop->feedSettings) >= $userPlanLimits['feeds']) :
                            return response()->json(['status' => false, "limit" => true, "message" => "You've Reached Your Feed Limit", "route" => "/Pricing"]);
                        endif;
                        if ($shop->shop_product_variants_count >= $userPlanLimits['skus']) :
                            return response()->json(['status' => false, "limit" => true, "message" => "You've Reached Your SKU's Limit", "route" => "/Pricing"]);
                        endif;
                    endif;
                endif;
            endif;
        endif;
        if ($shop->pendingFeeds) :
            $pendingFeed = FeedSetting::where('id', $shop->pendingFeeds)->first();
            if ($pendingFeed) :
                if ($pendingFeed->delete()) :
                    $shop->update(['pendingFeeds' => null]);
                endif;
            endif;
        endif;
        $feed_settings = new FeedSetting();
        $created_feed = $feed_settings->create($validated);
        if (isset($created_feed->id)) :
            if (config('shopify-app.billing_enabled') && !$shop->isFreemium() && !$shop->isGrandfathered() && $shop->plan_id == null) :
                if ($shop->update(['pendingFeeds' => $created_feed->id])) :
                    return response()->json(['status' => true, 'route' => '/setupPrice']);
                endif;
            else :
                if ($created_feed->shipping == 'auto') :
                    if ($this->updateShippingtoMerchantAccount()) :
                        if ($created_feed->language == $shop->settings->language && $created_feed->currency == $shop->settings->currency) :
                            if (isset($created_feed->excludedCollections) && $created_feed->excludedCollections != null) :
                                ExcludeCollectionProductsJobRest::withChain([
                                    new UploadAllProductJobRest(auth()->user(), $created_feed)
                                ])->onQueue('high')->dispatch(auth()->user(), $created_feed);
                                return response()->json(['success' => "Products Being Uploaded.", "status" => true, 'route' => '/Loading']);
                            else :
                                UploadAllProductJobRest::dispatch(auth()->user(), $created_feed)->onQueue('high');
                                return response()->json(['success' => "Products Being Uploaded.", "status" => true, 'route' => '/Loading']);
                            endif;
                        else :
                            if (isset($created_feed->excludedCollections) && $created_feed->excludedCollections != null) :
                                ExcludeCollectionProductsJobStoreFront::withChain([
                                    new UploadAllProductJobStoreFront(auth()->user(), $created_feed)
                                ])->onQueue('high')->dispatch(auth()->user(), $created_feed);
                                return response()->json(['success' => "Products Being Uploaded.", "status" => true, 'route' => '/Loading']);
                            else :
                                UploadAllProductJobStoreFront::dispatch(auth()->user(), $created_feed)->onQueue('high');
                                return response()->json(['success' => "Products Being Uploaded.", "status" => true, 'route' => '/Loading']);
                            endif;
                        endif;
                    else :
                        $created_feed->delete();
                        info("from shipping");
                        return response()->json(['error' => "Something Went Wrong.", 'status' => false]);
                    endif;
                else :
                    if ($created_feed->language == $shop->settings->language && $created_feed->currency == $shop->settings->currency) :
                        if (isset($created_feed->excludedCollections) && $created_feed->excludedCollections != null) :
                            ExcludeCollectionProductsJobRest::withChain([
                                new UploadAllProductJobRest(auth()->user(), $created_feed)
                            ])->onQueue('high')->dispatch(auth()->user(), $created_feed);
                            return response()->json(['success' => "Products Being Uploaded.", "status" => true, 'route' => '/Loading']);
                        else :
                            UploadAllProductJobRest::dispatch(auth()->user(), $created_feed)->onQueue('high');
                            return response()->json(['success' => "Products Being Uploaded.", "status" => true, 'route' => '/Loading']);
                        endif;
                    else :
                        if (isset($created_feed->excludedCollections) && $created_feed->excludedCollections != null) :
                            ExcludeCollectionProductsJobStoreFront::withChain([
                                new UploadAllProductJobStoreFront(auth()->user(), $created_feed)
                            ])->onQueue('high')->dispatch(auth()->user(), $created_feed);
                            return response()->json(['success' => "Products Being Uploaded.", "status" => true, 'route' => '/Loading']);
                        else :
                            UploadAllProductJobStoreFront::dispatch(auth()->user(), $created_feed)->onQueue('high');
                            return response()->json(['success' => "Products Being Uploaded.", "status" => true, 'route' => '/Loading']);
                        endif;
                    endif;
                endif;
            endif;
        else :
            info("not created feed");
            $created_feed->delete();
            return response()->json(['error' => "Something Went Wrong.", 'status' => false]);
        endif;
    }

    public function featuresStatus()
    {
        $user = auth()->user();
        if (config('shopify-app.billing_enabled')) :
            $features = config('appPlansLimits.planFeatureLimitations.' . $user->plan_id);
            if ($user->plan_id == null) :
                if ($user->isFreemium()) :
                    $features = [
                        "bulkEdit"          => false,
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
                        "bulkEdit"          => false,
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
        return json_encode(['status' => true, 'features' => $features]);
    }

    public function updateFeedStatus(Request $request)
    {
        $feed = FeedSetting::where('id', $request->id)->first();
        if ($feed) :
            if ($feed->update(['status' => !$feed->status])) :
                return response()->json(['status' => true, 'message' => 'Status Updated'], $status = 200);
            else :
                return response()->json(['status' => false, 'error' => 'Something went wrong'], $status = 500);
            endif;
        endif;
    }

    public function deleteFeed($id, $deleteConsent)
    {
        $feed = FeedSetting::where([
            'user_id' => auth()->user()->id,
            'id' => $id
        ])->first();
        if ($feed) :
            if (json_decode($deleteConsent) == true) :
                DeleteFeedJob::dispatch(auth()->user(), $feed);
                return response()->json(['status' => true, 'message' => "Feed Is Being Deleted."], $status = 200);
            else :
                $feed->delete();
                return response()->json(['status' => true, 'message' => "Feed Is Being Deleted."], $status = 200);
            endif;
        else :
            return response()->json(['status' => false, 'error' => 'Feed Not Found'], $status = 404);
        endif;
    }

    public function submitReview(Request $request)
    {
        $validator = validator($request->all(), config('formValidation.ReviewForm'));
        if ($validator->fails()) :
            return response()->json($validator->errors()->all(), 422);
        endif;
        $todayDate = Carbon::now();
        if (DB::table('reviews')->where(['user_id' => auth()->user()->id])->doesntExist()) {
            $validated = $validator->validated() + ['user_id' => auth()->user()->id, 'created_at' => $todayDate];
            $response = DB::table('reviews')->insert($validated);
        } else {
            $validated = $validator->validated() + ['user_id' => auth()->user()->id, 'updated_at' => $todayDate];
            $response = DB::table('reviews')->update($validated);
        }
        return response()->json(["status" => true, "success" => $response], 201);
    }

    public function saveFeedSettingChanges(Request $request)
    {
        $shop = auth()->user();
        if (!$shop->settings->merchantAccountId) :
            return response()->json(['error' => "You Must Connect A Merchant Account To Sync.", "status" => false]);
        endif;
        $validator = validator($request->feedData, config('formValidation.updateFeedForm'));
        if ($validator->fails()) :
            return response()->json(['errors' => $validator->errors()], $status = 500);
        endif;
        $validated = $validator->validated();
        if (isset($validated['excludedCollections'])) :
            $validated['excludedCollections'] = json_encode($validated['excludedCollections']);
        endif;
        if (isset($validated['includedCollections'])) :
            $validated['includedCollections'] = json_encode($validated['includedCollections']);
        endif;
        if (isset($validated['excludedCollections'])) :
            if ($validated['excludedCollections'] == "[]") :
                $validated['excludedCollections'] = null;
            endif;
        endif;
        $validated['user_id'] = $shop->id;
        $oldSetting = FeedSetting::where([
            'id' => $validated['id'],
            'merchantAccountId' => $validated['merchantAccountId'],
            'merchantAccountName' => $validated['merchantAccountName'],
            'market' => $validated['market'],
            'name' => $validated['name'],
            'country' => $validated['country'],
            'language' => $validated['language'],
            'currency' => $validated['currency'],
            'shipping' => $validated['shipping'],
            'productIdFormat' => $validated['productIdFormat'],
            'whichProducts' => $validated['whichProducts'],
            'includedCollections' => $validated['includedCollections'],
            'excludedCollections' => $validated['excludedCollections'],
            'productTitle' => $validated['productTitle'],
            'productDescription' => $validated['productDescription'],
            'variantSubmission' => $validated['variantSubmission'],
            'brandSubmission' => $validated['brandSubmission'],
            'productIdentifiers' => $validated['productIdentifiers'],
            'barcode' => $validated['barcode'],
            'salePrice' => $validated['salePrice'],
            'secondImage' => $validated['secondImage'],
            'additionalImages' => $validated['additionalImages'],
            'product_category_id' => $validated['product_category_id'],
            'ageGroup' => $validated['ageGroup'],
            'gender' => $validated['gender'],
            'productCondition' => $validated['productCondition'],
            'utm_campaign' => $validated['utm_campaign'],
            'utm_source' => $validated['utm_source'],
            'utm_medium' => $validated['utm_medium'],
        ])->exists();
        if ($oldSetting) :
            return response()->json(['status' => false, 'error' => "You didn't make any changes."]);
        else :
            $oldFeed = FeedSetting::where('id', $validated['id'])->first();
            if (!$oldFeed->status) :
                return response()->json(['status' => false, 'error' => "Please change your feed status to make changes"]);
            else :
                DeleteFeedJob::dispatch(auth()->user(), $oldFeed);
                $feed_settings = new FeedSetting();
                $created_feed = $feed_settings->create($validated);
                if (isset($created_feed->id)) :
                    if ($created_feed->shipping == 'auto') :
                        if ($this->updateShippingtoMerchantAccount()) :
                            if ($created_feed->language == $shop->settings->language && $created_feed->currency == $shop->settings->currency) :
                                if (isset($created_feed->excludedCollections) && $created_feed->excludedCollections != null) :
                                    ExcludeCollectionProductsJobRest::withChain([
                                        new UploadAllProductJobRest(auth()->user(), $created_feed)
                                    ])->dispatch(auth()->user(), $created_feed);
                                    return response()->json(['message' => "Feed Being Updated.", "status" => true, 'route' => '/Dashboard']);
                                else :
                                    UploadAllProductJobRest::dispatch(auth()->user(), $created_feed);
                                    return response()->json(['message' => "Feed Being Updated.", "status" => true, 'route' => '/Dashboard']);
                                endif;
                            else :
                                if (isset($created_feed->excludedCollections) && $created_feed->excludedCollections != null) :
                                    ExcludeCollectionProductsJobStoreFront::withChain([
                                        new UploadAllProductJobStoreFront(auth()->user(), $created_feed)
                                    ])->dispatch(auth()->user(), $created_feed);
                                    return response()->json(['message' => "Feed Being Updated.", "status" => true, 'route' => '/Dashboard']);
                                else :
                                    UploadAllProductJobStoreFront::dispatch(auth()->user(), $created_feed);
                                    return response()->json(['message' => "Feed Being Updated.", "status" => true, 'route' => '/Dashboard']);
                                endif;
                            endif;
                        else :
                            return response()->json(['error' => "Something Went Wrong."]);
                        endif;
                    else :
                        if ($created_feed->language == $shop->settings->language && $created_feed->currency == $shop->settings->currency) :
                            if (isset($created_feed->excludedCollections) && $created_feed->excludedCollections != null) :
                                ExcludeCollectionProductsJobRest::withChain([
                                    new UploadAllProductJobRest(auth()->user(), $created_feed)
                                ])->dispatch(auth()->user(), $created_feed);
                                return response()->json(['message' => "Feed Being Updated.", "status" => true, 'route' => '/Dashboard']);
                            else :
                                UploadAllProductJobRest::dispatch(auth()->user(), $created_feed);
                                return response()->json(['message' => "Feed Being Updated.", "status" => true, 'route' => '/Dashboard']);
                            endif;
                        else :
                            if (isset($created_feed->excludedCollections) && $created_feed->excludedCollections != null) :
                                ExcludeCollectionProductsJobStoreFront::withChain([
                                    new UploadAllProductJobStoreFront(auth()->user(), $created_feed)
                                ])->dispatch(auth()->user(), $created_feed);
                                return response()->json(['message' => "Feed Being Updated.", "status" => true, 'route' => '/Dashboard']);
                            else :
                                UploadAllProductJobStoreFront::dispatch(auth()->user(), $created_feed);
                                return response()->json(['message' => "Feed Being Updated.", "status" => true, 'route' => '/Dashboard']);
                            endif;
                        endif;
                    endif;
                else :
                    return response()->json(['error' => "Something Went Wrong.", "status" => false]);
                endif;
            endif;
        endif;
    }

    public function saveFeedName(Request $request)
    {
        $feedSetting = FeedSetting::where('id', $request->feedId)->first();
        if ($feedSetting->update(['name' => $request->feedName])) :
            return response()->json(['message' => "Feed Name Updated Successfully", 'status' => true], $status = 200);
        else :
            return response()->json(['error' => "Something Went Wrong", 'status' => true], $status = 500);
        endif;
    }

    public function saveNotificationSetting(Request $request)
    {
        $shop = auth()->user();
        if ($shop->settings->update(['notification_setting' => $request->notificationSetting])) :
            if ($request->notificationSetting == "auto") :
                Notification::where('user_id', $shop->id)->delete();
            endif;
            return response()->json(['message' => "Settings Updated Successfully"], $status = 200);
        else :
            return response()->json(['error' => "Something went wrong"], $status = 500);
        endif;
    }

    public function changeAccountRequest()
    {
        $shop = auth()->user();
        $shop->feedSettings->each->delete();
        $shop->settings->update([
            "googleAccessToken" => null,
            "googleRefreshToken" => null,
            "googleAccountId" => null,
            "googleAccountName" => null,
            "googleAccountEmail" => null,
            "googleAccountAvatar" => null,
            "merchantAccountId" => null,
            "merchantAccountName" => null,
        ]);
        // DeleteAllFeedsJob::dispatch($shop);
        return response()->json(['status' => true, 'message' => 'Settings Being Removed']);
    }


    public function createTicket(Request $request)
    {
        $validator = validator($request->all(), config('formValidation.ticketValidationForm'));
        if ($validator->fails()) :
            return response()->json(['status' => false, 'errors' => $validator->errors()], 500);
        endif;
        $validated = $validator->validated();
        $lastRecord = SupportTicket::latest()->first();
        $ticket_id = $lastRecord ? $lastRecord['ticket_id'] + 1 : 1000;
        $ticketData = [
            "user_id" => auth()->user()->id,
            "ticket_id" => $ticket_id,
            "email" => $validated['email'],
            "subject" => $validated['subject'],
            "description" => $validated['description'],
        ];
        $files = $request->file('attachments');
        if ($files) :
            foreach ($files as $key => $file) :
                $image = $file;
                $extension = $image->getClientOriginalExtension();
                $imageName = Str::random(20) . '.' . $extension;
                $directory = '/app/public/images/';
                if ($image->move(storage_path() . $directory, $imageName)) :
                    $ticketData['attachments'][$key] = [
                        "ticket_id" => $ticket_id,
                        "attachment" => $imageName
                    ];
                endif;
            endforeach;
        endif;
        $response = SupportTicket::create($ticketData);
        if ($response) :
            return response()->json(['status' => true, 'message' => 'Your Ticket has been created']);
        else :
            return response()->json(['status' => false, 'error' => 'Something Went Wrong']);
        endif;
    }

    public function createTicketReply(Request $request)
    {
        $validator = validator($request->all(), [
            'description' => ['required', 'string'],
            "attachments.*"     => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp']
        ]);
        if ($validator->fails()) :
            return response()->json(['status' => false, 'errors' => $validator->errors()], 500);
        endif;
        $validated = $validator->validated();
        $ticket = SupportTicket::where([
            'id' => $request->ticketId,
            'user_id' => auth()->user()->id
        ])->first();
        $ticketReplyData = [
            'user_id' => auth()->user()->id,
            'support_ticket_id' => $ticket['id'],
            'ticket_id' => $ticket['ticket_id'],
            'role' => 'user',
            'displayName' => $ticket['email'],
            'description' => $validated['description']
        ];
        $files = $request->file('attachments');
        if ($files) :
            foreach ($files as $key => $file) :
                $image = $file;
                $extension = $image->getClientOriginalExtension();
                $imageName = Str::random(20) . '.' . $extension;
                $directory = '/app/public/images/';
                if ($image->move(storage_path() . $directory, $imageName)) :
                    $ticketReplyData['attachments'][$key] = [
                        "attachment" => $imageName
                    ];
                endif;
            endforeach;
        endif;
        $response = Reply::create($ticketReplyData);
        if ($response) :
            return response()->json(['status' => true, 'message' => 'Reply Submitted']);
        else :
            return response()->json(['status' => false, 'error' => 'Something Went Wrong']);
        endif;
    }

    public function closeTicket(Request $request)
    {
        $ticket = SupportTicket::where([
            'id' => $request->id,
            'user_id' => auth()->user()->id
        ])->first();
        if ($ticket) :
            if ($ticket->update(['status' => 'closed'])) :
                return response()->json(['status' => true, 'message' => 'Your Ticket has been closed']);
            endif;
        endif;
    }

    public function addSuggestion(Request $request)
    {
        $validator = validator($request->all(), config('formValidation.suggestionValidationForm'));
        if ($validator->fails()) :
            return response()->json(['status' => false, 'errors' => $validator->errors()], 500);
        endif;
        $validated = $validator->validated();
        $lastRecord = FeatureRequest::latest()->first();
        $feature_id = $lastRecord ? $lastRecord['feature_id'] + 1 : 1000;
        $featureData = [
            'user_id' => auth()->user()->id,
            'feature_id' => $feature_id,
            'displayName' => auth()->user()->settings->store_name,
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'description' => $validated['description'],
        ];
        $files = $request->file('attachments');
        if ($files) :
            foreach ($files as $key => $file) :
                $image = $file;
                $extension = $image->getClientOriginalExtension();
                $imageName = Str::random(30) . '.' . $extension;
                $directory = '/app/public/images/';
                if ($image->move(storage_path() . $directory, $imageName)) :
                    $featureData['attachments'][$key] = [
                        "feature_id" => $feature_id,
                        "attachment" => $imageName
                    ];
                endif;
            endforeach;
        endif;
        $response = FeatureRequest::create($featureData);
        if ($response) :
            return response()->json(['status' => true, 'message' => 'Your Suggestion has been added']);
        else :
            return response()->json(['status' => false, 'error' => 'Something Went Wrong']);
        endif;
    }

    public function addPositiveVotes(Request $request)
    {
        $validator = validator($request->all(), [
            'id' => ['required', 'exists:feature_requests,id']
        ]);
        if ($validator->fails()) :
            return response()->json(['status' => false, 'errors' => $validator->errors()], 500);
        endif;
        $validated = $validator->validated();
        $featureRequest = FeatureRequest::where([
            'id' => $validated['id'],
        ])->first();
        $vote = Vote::where([
            'user_id' => auth()->user()->id,
            'feature_request_id' => $validated['id']
        ])->first();
        if ($vote) :
            $vote->update([
                'positive' => true,
                'negative' => false
            ]);
            return response()->json(['status' => true, 'message' => 'Vote Updated']);
        else :
            $voteData = [
                'user_id' => auth()->user()->id,
                'feature_request_id' => $validated['id'],
                'feature_id' => $featureRequest['feature_id'],
                'email' => auth()->user()->email,
                'positive' => true,
                'negative' => false,
            ];
            $response = Vote::create($voteData);
            if ($response) :
                return response()->json(['status' => true, 'message' => 'Vote Added']);
            endif;
        endif;
    }

    public function addNegativeVotes(Request $request)
    {
        $validator = validator($request->all(), [
            'id' => ['required', 'exists:feature_requests,id']
        ]);
        if ($validator->fails()) :
            return response()->json(['status' => false, 'errors' => $validator->errors()]);
        endif;
        $validated = $validator->validated();
        $featureRequest = FeatureRequest::where([
            'id' => $validated['id'],
        ])->first();
        $vote = Vote::where([
            'user_id' => auth()->user()->id,
            'feature_request_id' => $validated['id']
        ])->first();
        if ($vote) :
            $vote->update([
                'positive' => false,
                'negative' => true
            ]);
            return response()->json(['status' => true, 'message' => 'Vote Updated']);
        else :
            $voteData = [
                'user_id' => auth()->user()->id,
                'feature_request_id' => $validated['id'],
                'feature_id' => $featureRequest['feature_id'],
                'email' => auth()->user()->email,
                'positive' => false,
                'negative' => true,
            ];
            $response = Vote::create($voteData);
            if ($response) :
                return response()->json(['status' => true, 'message' => 'Vote Added']);
            endif;
        endif;
    }

    public function createFeatureReply(Request $request)
    {

        $validator = validator($request->all(), [
            'description' => ['required', 'string'],
            "attachments.*"     => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp']
        ]);
        if ($validator->fails()) :
            return response()->json(['status' => false, 'errors' => $validator->errors()], 500);
        endif;
        $validated = $validator->validated();
        $feature = FeatureRequest::where([
            'id' => $request->featureId,
        ])->first();
        $featureReplyData = [
            'user_id' => auth()->user()->id,
            'feature_request_id' => $feature['id'],
            'feature_id' => $feature['feature_id'],
            'role' => 'user',
            'displayName' => auth()->user()->settings->store_name,
            'description' => $validated['description']
        ];
        $files = $request->file('attachments');
        if ($files) :
            foreach ($files as $key => $file) :
                $image = $file;
                $extension = $image->getClientOriginalExtension();
                $imageName = Str::random(20) . '.' . $extension;
                $directory = '/app/public/images/';
                if ($image->move(storage_path() . $directory, $imageName)) :
                    $featureReplyData['attachments'][$key] = [
                        "attachment" => $imageName
                    ];
                endif;
            endforeach;
        endif;
        $response = Reply::create($featureReplyData);
        if ($response) :
            return response()->json(['status' => true, 'message' => 'Reply Submitted'], 200);
        else :
            return response()->json(['status' => false, 'error' => 'Something Went Wrong'], 200);
        endif;
    }

    public function syncDataFromShopify(Request $request)
    {
        $shop = auth()->user();
        $query = $request->input('search', "");
        $scoreRange = $request->input('scoreRange', "0-100");
        $rangeArray = explode('-', $scoreRange);
        $validator = validator($request->all(), config('formValidation.syncDataFromShopify'));
        if ($validator->fails()) :
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        endif;
        $validated = $validator->validated();
        $feedSetting = FeedSetting::where('id', $validated['feedId'])->first();
        if (!$feedSetting['status']) :
            return response()->json(['status' => false, 'message' => 'Your Feed status is off. You cannot update the products of this feed']);
        endif;
        if ($validated['ids'] == 'all') :
            if ($validated['tabValue'] == "approved") :
                $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku'])
                    ->where([
                        'user_id' => $shop->id,
                        'feed_setting_id' => $validated['feedId'],
                        'status' => "Approved",
                        ['title', 'like', "%{$query}%"],
                        ['score', '>=', intval($rangeArray[0])],
                        ['score', '<=', intval($rangeArray[1])]
                    ]);
            elseif ($validated['tabValue'] == "disapproved") :
                $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku'])
                    ->where([
                        'user_id' => $shop->id,
                        'feed_setting_id' => $validated['feedId'],
                        'status' => "Disapproved",
                        ['title', 'like', "%{$query}%"],
                        ['score', '>=', intval($rangeArray[0])],
                        ['score', '<=', intval($rangeArray[1])]
                    ]);
            elseif ($validated['tabValue'] == "pending") :
                $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku'])
                    ->where([
                        'user_id' => $shop->id,
                        'feed_setting_id' => $validated['feedId'],
                        'status' => "Pending",
                        ['title', 'like', "%{$query}%"],
                        ['score', '>=', intval($rangeArray[0])],
                        ['score', '<=', intval($rangeArray[1])]
                    ]);
            elseif ($validated['tabValue'] == "all") :
                $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku'])
                    ->where([
                        'user_id' => $shop->id,
                        'feed_setting_id' => $validated['feedId'],
                        ['title', 'like', "%{$query}%"],
                        ['score', '>=', intval($rangeArray[0])],
                        ['score', '<=', intval($rangeArray[1])]
                    ]);
            endif;
            $products->chunk(250, function ($variants) use ($feedSetting, $validated, $shop) {
                $jobData = [
                    'products' => $variants,
                    'fieldsToUpdate' => $validated['inputData'],
                    'feedId' => $validated['feedId']
                ];
                if ($feedSetting->language == $shop->settings->language && $feedSetting->currency == $shop->settings->currency) :
                    SyncDataFromShopifyJobRest::dispatch($shop, $jobData);
                else :
                    SyncDataFromShopifyJobStoreFront::dispatch($shop, $jobData);
                endif;
            });
            return response()->json(['status' => true, 'message' => "Products Being Synced"]);
        else :
            $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku'])
                ->whereIn('id', $validated['ids'])
                ->where([
                    'user_id' => $shop->id,
                    'feed_setting_id' => $validated['feedId']
                ])->get();
            $jobData = [
                'products' => $products,
                'fieldsToUpdate' => $validated['inputData'],
                'feedId' => $validated['feedId']
            ];
            if ($products) :
                if ($feedSetting->language == $shop->settings->language && $feedSetting->currency == $shop->settings->currency) :
                    SyncDataFromShopifyJobRest::dispatch($shop, $jobData);
                else :
                    SyncDataFromShopifyJobStoreFront::dispatch($shop, $jobData);
                endif;
            endif;
            return response()->json(['status' => true, 'message' => "Products Being Synced"]);
        endif;
        return response()->json(['status' => false, 'message' => "Something went wrong"]);
    }

    public function syncSingleFeedStatusFromGoogle(Request $request)
    {
        $validator = validator($request->all(), config('formValidation.syncStatusForm'));
        if ($validator->fails()) :
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        endif;
        $validated = $validator->validated();
        $feedSetting = FeedSetting::where('id', $validated['feedId'])->first();
        if (!$feedSetting['status']) :
            return response()->json(['status' => false, 'message' => 'Your Feed status is off. You cannot sync the products of this feed']);
        endif;
        if ($feedSetting['last_updated'] != null) :
            $lastUpdated = Carbon::parse($feedSetting['last_updated']);
            if (!$lastUpdated->lt(Carbon::now()->toDateString())) :
                return response()->json(['status' => false, 'message' => "You've already synced once in 24 hours"]);
            endif;
        endif;
        $userSync = true;
        if ($feedSetting) :
            SyncSingleFeedStatusJob::dispatch(auth()->user(), $feedSetting, $userSync)->onQueue('googleStatus');
            return response()->json(['status' => true, 'message' => 'Statuses are being synced']);
        endif;
    }

    public function excludeProducts(Request $request)
    {
        $shop = auth()->user();
        $query = $request->input('search', "");
        $scoreRange = $request->input('scoreRange', "0-100");
        $rangeArray = explode('-', $scoreRange);
        $validator = validator($request->all(), config('formValidation.bulkProductDeleteForm'));
        if ($validator->fails()) :
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        endif;
        $validated = $validator->validated();
        $feedSetting = FeedSetting::where('id', $validated['feedid'])->first();
        if (!$feedSetting['status']) :
            return response()->json(['status' => false, 'message' => 'Your Feed status is off. You cannot make changes to the products of this feed']);
        endif;
        if ($validated['ids'] == 'all') :
            if ($validated['tabValue'] == "approved") :
                $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku', 'title', 'image'])
                    ->where([
                        'user_id' => $shop->id,
                        'feed_setting_id' => $validated['feedid'],
                        'status' => "Approved",
                        ['title', 'like', "%{$query}%"],
                        ['score', '>=', intval($rangeArray[0])],
                        ['score', '<=', intval($rangeArray[1])]
                    ]);
            elseif ($validated['tabValue'] == "disapproved") :
                $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku', 'title', 'image'])
                    ->where([
                        'user_id' => $shop->id,
                        'feed_setting_id' => $validated['feedid'],
                        'status' => "Disapproved",
                        ['title', 'like', "%{$query}%"],
                        ['score', '>=', intval($rangeArray[0])],
                        ['score', '<=', intval($rangeArray[1])]
                    ]);
            elseif ($validated['tabValue'] == "pending") :
                $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku', 'title', 'image'])
                    ->where([
                        'user_id' => $shop->id,
                        'feed_setting_id' => $validated['feedid'],
                        'status' => "Pending",
                        ['title', 'like', "%{$query}%"],
                        ['score', '>=', intval($rangeArray[0])],
                        ['score', '<=', intval($rangeArray[1])]
                    ]);
            elseif ($validated['tabValue'] == "all") :
                $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku', 'title', 'image'])
                    ->where([
                        'user_id' => $shop->id,
                        'feed_setting_id' => $validated['feedid'],
                        ['title', 'like', "%{$query}%"],
                        ['score', '>=', intval($rangeArray[0])],
                        ['score', '<=', intval($rangeArray[1])]
                    ]);
            endif;
            $products->chunk(1000, function ($variants) use ($validated, $shop) {
                $jobData = [
                    'products' => $variants,
                    'feedId' => $validated['feedid']
                ];
                ExcludeProductsJob::dispatch($shop, $jobData);
            });
            return response()->json(['status' => true, 'message' => "Products Being Excluded."]);
        else :
            $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku', 'title', 'image'])
                ->whereIn('id', $validated['ids'])
                ->where([
                    'user_id' => $shop->id,
                    'feed_setting_id' => $validated['feedid']
                ])->get();
            $jobData = [
                'products' => $products,
                'feedId' => $validated['feedid']
            ];
            if ($products) :
                ExcludeProductsJob::dispatch($shop, $jobData);
                return response()->json(['status' => true, 'message' => "Products Being Excluded."]);
            endif;
        endif;
        return response()->json(['status' => false, 'message' => "Something went wrong"]);
    }

    public function includeProducts(Request $request)
    {
        $shop = auth()->user();
        $query = $request->input('search', "");
        $validator = validator($request->all(), config('formValidation.includeProductsForm'));
        if ($validator->fails()) :
            return response()->json(['status' => false, 'errors' => $validator->errors()], 500);
        endif;
        $validated = $validator->validated();
        $feedSetting = FeedSetting::where('id', $validated['feedid'])->first();
        $userPlanLimits = $this->calculatePlanLimitations($shop);
        if (config('shopify-app.billing_enabled')) :
            if (isset($userPlanLimits['skus']) && isset($userPlanLimits['feeds'])) :
                if ($userPlanLimits['skus'] != "Unlimited" && $userPlanLimits['feeds'] != "Unlimited") :
                    if ($shop->shop_product_variants_count >= $userPlanLimits['skus']) :
                        return response()->json(['status' => false, "limit" => true, "message" => "You've Reached Your SKU's Limit", "route" => "/Pricing"]);
                    endif;
                endif;
            endif;
        endif;
        if (!$feedSetting['status']) :
            return response()->json(['status' => false, 'message' => 'Your Feed status is off. You cannot make changes to the products of this feed']);
        endif;

        if ($validated['ids'] == "all") :
            $excludedProducts = ExcludedProduct::select(['id', 'productId', 'variantId'])
                ->where([
                    'user_id' => $shop->id,
                    'feed_setting_id' => $validated['feedid'],
                    ['title', 'like', "%{$query}%"]
                ]);
            $excludedProducts->chunk(1000, function ($excludedChunk) use ($feedSetting, $shop, $validated) {
                $jobData = [
                    'feedId' => $validated['feedid'],
                    'products' => $excludedChunk
                ];
                if ($feedSetting->language == $shop->settings->language && $feedSetting->currency == $shop->settings->currency) :
                    IncludeProductsJobRest::dispatch($shop, $jobData);
                else :
                    IncludeProductsJobStoreFront::dispatch($shop, $jobData);
                endif;
            });
            return response()->json(['status' => true, 'message' => "Products Being Included"]);
        else :
            $excludedProducts = ExcludedProduct::select(['id', 'productId', 'variantId'])->whereIn('id', $validated['ids'])->get();
            $jobData = [
                'feedId' => $validated['feedid'],
                'products' => $excludedProducts
            ];
            if ($feedSetting->language == $shop->settings->language && $feedSetting->currency == $shop->settings->currency) :
                IncludeProductsJobRest::dispatch($shop, $jobData);
                return response()->json(['status' => true, 'message' => "Products Being Included"]);
            else :
                IncludeProductsJobStoreFront::dispatch($shop, $jobData);
                return response()->json(['status' => true, 'message' => "Products Being Included"]);
            endif;
        endif;
        return response()->json(['status' => false, 'message' => "Something went wrong"]);
    }

    public function deleteBulkProducts(Request $request)
    {
        $shop = auth()->user();
        $query = $request->input('search', "");
        $scoreRange = $request->input('scoreRange', "0-100");
        $rangeArray = explode('-', $scoreRange);
        $validator = validator($request->all(), config('formValidation.bulkProductDeleteForm'));
        if ($validator->fails()) :
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        endif;
        $validated = $validator->validated();
        $feedSetting = FeedSetting::where('id', $validated['feedid'])->first();
        if (!$feedSetting['status']) :
            return response()->json(['status' => false, 'message' => 'Your Feed status is off. You cannot update the products of this feed']);
        endif;
        if ($validated['ids'] == 'all') :
            if ($validated['tabValue'] == "approved") :
                $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku'])
                    ->where([
                        'user_id' => $shop->id,
                        'feed_setting_id' => $validated['feedid'],
                        'status' => "Approved",
                        ['title', 'like', "%{$query}%"],
                        ['score', '>=', intval($rangeArray[0])],
                        ['score', '<=', intval($rangeArray[1])]
                    ]);
            elseif ($validated['tabValue'] == "disapproved") :
                $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku'])
                    ->where([
                        'user_id' => $shop->id,
                        'feed_setting_id' => $validated['feedid'],
                        'status' => "Disapproved",
                        ['title', 'like', "%{$query}%"],
                        ['score', '>=', intval($rangeArray[0])],
                        ['score', '<=', intval($rangeArray[1])]
                    ]);
            elseif ($validated['tabValue'] == "pending") :
                $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku'])
                    ->where([
                        'user_id' => $shop->id,
                        'feed_setting_id' => $validated['feedid'],
                        'status' => "Pending",
                        ['title', 'like', "%{$query}%"],
                        ['score', '>=', intval($rangeArray[0])],
                        ['score', '<=', intval($rangeArray[1])]
                    ]);
            elseif ($validated['tabValue'] == "all") :
                $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku'])
                    ->where([
                        'user_id' => $shop->id,
                        'feed_setting_id' => $validated['feedid'],
                        ['title', 'like', "%{$query}%"],
                        ['score', '>=', intval($rangeArray[0])],
                        ['score', '<=', intval($rangeArray[1])]
                    ]);
            endif;
            $products->chunk(1000, function ($variants) use ($validated, $shop) {
                $jobData = [
                    'products' => $variants,
                    'feedId' => $validated['feedid']
                ];
                BulkDeleteProductsJob::dispatch($shop, $jobData);
            });
            return response()->json(['status' => true, 'message' => "Products Being Deleted."]);
        else :
            $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku'])
                ->whereIn('id', $validated['ids'])
                ->where([
                    'user_id' => $shop->id,
                    'feed_setting_id' => $validated['feedid']
                ])->get();
            $jobData = [
                'products' => $products,
                'feedId' => $validated['feedid']
            ];
            BulkDeleteProductsJob::dispatch($shop, $jobData);
            return response()->json(['status' => true, 'message' => "Products Being Deleted."]);
        endif;
        return response()->json(['status' => false, 'message' => "Something went wrong"]);
    }

    public function deleteSingleProduct(Request $request)
    {
        $validator = validator($request->all(), config('formValidation.singleProductDeleteForm'));
        if ($validator->fails()) :
            return response()->json(['status' => false, 'errors' => $validator->errors()]);
        endif;
        $validated = $validator->validated();
        $product = ShopProductVariant::where('id', $validated['id'])->first();
        if ($product) :
            DeleteSingleProductJob::dispatch(auth()->user(), $product);
            return response()->json(['status' => true, 'message' => "Product Being Deleted."]);
        else :
            return response()->json(['status' => false, 'message' => 'Product Not Found']);
        endif;
    }

    public function deleteSingleExcludedProduct(Request $request)
    {
        $validator = validator($request->all(), config('formValidation.singleExcludedProductDeleteForm'));
        if ($validator->fails()) :
            return response()->json(['status' => false, 'errors' => $validator->errors()]);
        endif;
        $validated = $validator->validated();
        $product = ExcludedProduct::where('id', $validated['id'])->first();
        if ($product) :
            DeleteSingleProductJob::dispatch(auth()->user(), $product);
            return response()->json(['status' => true, 'message' => "Product Being Deleted."]);
        else :
            return response()->json(['status' => false, 'message' => 'Product Not Found']);
        endif;
    }

    public function deleteBulkExcludedProducts(Request $request)
    {
        $shop = auth()->user();
        $query = $request->input('search', "");
        $validator = validator($request->all(), config('formValidation.bulkExcludedProductDeleteForm'));
        if ($validator->fails()) :
            return response()->json(['status' => false, 'errors' => $validator->errors()]);
        endif;
        $validated = $validator->validated();
        $feedSetting = FeedSetting::where('id', $validated['feedid'])->first();
        if (!$feedSetting['status']) :
            return response()->json(['status' => false, 'message' => 'Your Feed status is off. You cannot update the products of this feed']);
        endif;
        if ($validated['ids'] == 'all') :
            $excludedProducts = ExcludedProduct::select(['id', 'productId', 'variantId'])
                ->where([
                    'user_id' => $shop->id,
                    'feed_setting_id' => $validated['feedid'],
                    ['title', 'like', "%{$query}%"]
                ]);
            $excludedProducts->chunk(1000, function ($variants) use ($validated, $shop) {
                $jobData = [
                    'products' => $variants,
                    'feedId' => $validated['feedid']
                ];
                BulkDeleteProductsJob::dispatch($shop, $jobData);
            });
            return response()->json(['status' => true, 'message' => "Products Being Deleted."]);
        else :
            $products = ExcludedProduct::select(['id', 'productId', 'variantId'])
                ->whereIn('id', $validated['ids'])
                ->where([
                    'user_id' => $shop->id,
                    'feed_setting_id' => $validated['feedid']
                ])->get();
            $jobData = [
                'products' => $products,
                'feedId' => $validated['feedid']
            ];
            if ($products) :
                BulkDeleteProductsJob::dispatch($shop, $jobData);
                return response()->json(['status' => true, 'message' => "Products Being Deleted."]);
            endif;
        endif;
    }

    public function addNewProducts(Request $request)
    {
        $shop = auth()->user();
        $userPlanLimits = $this->calculatePlanLimitations($shop);
        if (config('shopify-app.billing_enabled')) :
            if (isset($userPlanLimits['skus']) && isset($userPlanLimits['feeds'])) :
                if ($userPlanLimits['skus'] != "Unlimited" && $userPlanLimits['feeds'] != "Unlimited") :
                    // if(count($shop->feedSettings) >= $userPlanLimits['feeds']):
                    //     return response()->json(['status' => false, "limit" => true, "message" => "You've Reached Your Feed Limit", "route" => "/Pricing"]);
                    // endif;
                    if ($shop->shop_product_variants_count >= $userPlanLimits['skus']) :
                        return response()->json(['status' => false, "limit" => true, "message" => "You've Reached Your SKU's Limit", "route" => "/Pricing"]);
                    endif;
                endif;
            endif;
        endif;
        $feedSetting = FeedSetting::where(['id' => $request->id, 'user_id' => $shop->id])->first();
        if (!$feedSetting['status']) :
            return response()->json(['status' => false, 'message' => 'Your Feed status is off. You cannot make changes to the products of this feed']);
        endif;
        if ($feedSetting) :
            $data = [
                'feedId' => $request->id,
                'whichProducts' => $request->whichProducts,
                'resources' => $request->resources
            ];
            if ($feedSetting->language == $shop->settings->language && $feedSetting->currency == $shop->settings->currency) :
                AddNewProductsJobRest::dispatch($shop, $data);
                return response()->json(['status' => true, 'message' => 'Product being added']);
            else :
                AddNewProductsJobStoreFront::dispatch($shop, $data);
                return response()->json(['status' => true, 'message' => 'Product being added']);
            endif;
        endif;
    }

    public function editBulkProducts(Request $request)
    {
        $shop = auth()->user();
        $query = $request->input('search', "");
        $scoreRange = $request->input('scoreRange', "0-100");
        $rangeArray = explode('-', $scoreRange);
        $validator = validator($request->all(), config('formValidation.bulkEditForm'));
        if ($validator->fails()) :
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        endif;
        $validated = $validator->validated();
        if (isset($validated['bulkFields']['adult'])) :
            $validated['bulkFields']['adult'] = $validated['bulkFields']['adult'] == 'yes' ? true : false;
        endif;
        if (isset($validated['bulkFields']['isBundle'])) :
            $validated['bulkFields']['isBundle'] = $validated['bulkFields']['isBundle'] == 'yes' ? true : false;
        endif;
        if (isset($validated['bulkFields']['identifierExists'])) :
            $validated['bulkFields']['identifierExists'] = $validated['bulkFields']['identifierExists'] == 'yes' ? true : false;
        endif;
        if (isset($validated['bulkFields']['salePriceEffectiveDate'])) :
            if (isset($validated['bulkFields']['salePriceEffectiveDate']['start']) && isset($validated['bulkFields']['salePriceEffectiveDate']['end'])) :
                $validated['bulkFields']['salePriceEffectiveDate'] = $validated['bulkFields']['salePriceEffectiveDate']['start'] . "/" . $validated['bulkFields']['salePriceEffectiveDate']['end'];
            else :
                $validated['bulkFields']['salePriceEffectiveDate'] = "";
            endif;
        endif;
        if (isset($validated['bulkFields']['promotionIds'])) :
            $validated['bulkFields']['promotionIds'] = array_values($validated['bulkFields']['promotionIds']);
        endif;
        $feedSetting = FeedSetting::where('id', $validated['feedId'])->first();
        if (!$feedSetting['status']) :
            return response()->json(['status' => false, 'success' => 'Your Feed status is off. You cannot update the products of this feed']);
        endif;
        if ($validated['ids'] == "all") :
            if ($validated['tabValue'] == "approved") :
                $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku'])
                    ->where([
                        'user_id' => $shop->id,
                        'feed_setting_id' => $validated['feedId'],
                        'status' => "Approved",
                        ['title', 'like', "%{$query}%"],
                        ['score', '>=', intval($rangeArray[0])],
                        ['score', '<=', intval($rangeArray[1])]
                    ]);
            elseif ($validated['tabValue'] == "disapproved") :
                $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku'])
                    ->where([
                        'user_id' => $shop->id,
                        'feed_setting_id' => $validated['feedId'],
                        'status' => "Disapproved",
                        ['title', 'like', "%{$query}%"],
                        ['score', '>=', intval($rangeArray[0])],
                        ['score', '<=', intval($rangeArray[1])]
                    ]);
            elseif ($validated['tabValue'] == "pending") :
                $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku'])
                    ->where([
                        'user_id' => $shop->id,
                        'feed_setting_id' => $validated['feedId'],
                        'status' => "Pending",
                        ['title', 'like', "%{$query}%"],
                        ['score', '>=', intval($rangeArray[0])],
                        ['score', '<=', intval($rangeArray[1])]
                    ]);
            elseif ($validated['tabValue'] == "all") :
                $products = ShopProductVariant::select(['id', 'productId', 'variantId', 'itemId', 'sku'])
                    ->where([
                        'user_id' => $shop->id,
                        'feed_setting_id' => $validated['feedId'],
                        ['title', 'like', "%{$query}%"],
                        ['score', '>=', intval($rangeArray[0])],
                        ['score', '<=', intval($rangeArray[1])]
                    ]);
            endif;
            $products->chunk(1000, function ($variants) use ($feedSetting, $validated) {
                $jobData = ['feedSetting' => $feedSetting, 'products' => $variants, 'editedFields' => $validated['bulkFields']];
                EditBulkProductJob::dispatch(auth()->user(), $jobData);
            });
            return response()->json(['status' => true, 'message' => 'Product Being Updated']);
        else :
            $products = ShopProductVariant::whereIn('id', $validated['ids'])->where([
                'user_id' => auth()->user()->id,
                'feed_setting_id' => $validated['feedId']
            ])->get();
            $jobData = ['feedSetting' => $feedSetting, 'products' => $products, 'editedFields' => $validated['bulkFields']];
            if (!$products->isEmpty()) :
                EditBulkProductJob::dispatch(auth()->user(), $jobData);
                return response()->json(['status' => true, 'message' => 'Product Being Updated']);
            else :
                return response()->json(['status' => false, 'message' => 'Something Went Wrong']);
            endif;
        endif;
        return response()->json(['status' => false, 'message' => 'Something Went Wrong']);
    }

    public function editedProductData(Request $request)
    {
        $validator = validator($request->all(), config('formValidation.PupdateForm'));
        if ($validator->fails()) :
            return response()->json(['errors' => $validator->errors()]);
        endif;
        $validated = $validator->validated();
        UpdateProductDetailsJob::dispatch(auth()->user(), $validated, $request->feed_id, $request->products);
        return response()->json(['success' => "Product Being Updated."]);
    }

    public function uploadFileImage(Request $request)
    {
        $p_id = json_decode($request->id);   // product table id. 
        $images = [];
        //get data from DB according selected product ....
        $productData = ShopProductVariant::where('id',  $p_id)->first();
        // ...end
        $shop = auth()->user();
        if (isset($request->file)) :
            $images[0] = [
                'attachment' => base64_encode(file_get_contents($request->file('file')))
            ];
            // Check if draft product already exist...
            $draftCheck = DraftProduct::where('shop_product_variant_id', $p_id)->first();
            if (!$draftCheck) :
                //array for create Draft...
                $product_create = [
                    "product" => [
                        "title" => "Do not Delete " . $productData->title . "",
                        "body_html" => $productData->description,
                        "vendor" => "Easy Feed for Google Shopping Ads",
                        "status" => "draft",
                        "images" => $images
                    ]
                ];
                // ...end
                $response = $shop->api()->rest('POST', '/admin/api/2022-04/products.json', $product_create);
                // save draft Data In DB ...
                DraftProduct::insert([
                    'shop_product_variant_id' => $p_id,
                    'originalProductId' => $productData->productId,
                    'draftProductId' => $response['body']['product']['id'],
                    'imagesCount' => 1,
                ]);
                // ... end
                //return response
                $uploadedImages = $response['body']['product']['images'][0];
                return $uploadedImages;
            // else if draf product already exit...
            else :
                $imageCreate = [
                    "image" => [
                        'attachment' => base64_encode(file_get_contents($request->file('file'))),
                        'product_id' => $draftCheck->draftProductId
                    ],
                ];
                $res = $shop->api()->rest('POST', '/admin/api/2022-07/products/' . $draftCheck->draftProductId . '/images.json', $imageCreate);
                // .... end
                $uploadedImages = [
                    'src' => $res['body']['image']['src']
                ];
                // save count images in DB all over....
                DraftProduct::where('shop_product_variant_id', $p_id)->update([
                    "imagesCount" => intval($draftCheck->imagesCount) + sizeof($uploadedImages),
                ]);
                // ...end
                return $uploadedImages;
            endif;
        endif;
    }

    public function uploadImages(Request $request)
    {
        $imagesSelected = $request->images;
        $shop = auth()->user();
        $p_id = $request->id;
        //get data from DB according selected product ....
        $productData = ShopProductVariant::where('id',  $p_id)->first();
        // ...end
        $feedId = $productData->feed_setting_id;
        if (count($request->fileImages) != 0) :
            foreach ($imagesSelected as $key => $selectImg) :
                foreach ($request->fileImages as $file) :
                    if (isset($file) && $selectImg['name'] == $file['name']) :
                        $imagesSelected[$key]['image'] =  $file['image']['src'];
                    endif;
                endforeach;
            endforeach;
        endif;
        UpdateProductImages::dispatch($shop, $p_id, $feedId, $imagesSelected);
        return response()->json(['success' => "Images Being Updated."]);
    }

    public function forfilter(Request $request)
    {
        $query = $request['query'];
        $filter = ShopProductVariant::where([
            ['title', 'like', "%{$query}%"],
            ['feed_setting_id', '=', $request->feedId['feedId']]
        ])->orderBy('id')->paginate($request->paginate);
        // $count = ShopProductVariant::where('feed_setting_id', $request->feedId['feedId'])->count();
        return response()->json(['status' => true, 'products' => $filter]);
    }

    public function applyFilter(Request $request)
    {
        // return $request;
        $variat = ShopProductVariant::where('feed_setting_id', $request->id)->get();
        $edited = EditedProduct::where('feed_setting_id', $request->id)->get();
        $labels = ProductLabel::where('feed_setting_id', $request->id)->get();
        $arrayFilter = array_merge([$variat], [$edited], [$labels]);
        return  $arrayFilter;
    }

    public function applyFiltervalues(Request $request)
    {
        $productData = ShopProductVariant::select('shop_product_variants.*', 'edited_products.color', 'edited_products.sizes', 'edited_products.material', 'edited_products.pattern', 'edited_products.sizeSystem', 'edited_products.sizeType', 'edited_products.unitPricingMeasure', 'edited_products.unitPricingBaseMeasure', 'edited_products.multipack', 'edited_products.isBundle', 'edited_products.promotionIds', 'edited_products.salePriceEffectiveDate', 'edited_products.adult', 'edited_products.identifierExists', 'edited_products.costOfGoodsSold', 'edited_products.availability', 'edited_products.installment', 'edited_products.minEnergyEfficiencyClass', 'edited_products.maxEnergyEfficiencyClass', 'edited_products.loyaltyPoints', 'edited_products.energyEfficiencyClass', 'edited_products.maxHandlingTime', 'edited_products.shippingWidth', 'edited_products.minHandlingTime', 'edited_products.shippingHeight', 'edited_products.shippingLength', 'edited_products.shippingWeight', 'edited_products.productHeight', 'edited_products.productLength', 'edited_products.productWidth', 'edited_products.productWeight', 'edited_products.return_policy_label', 'edited_products.transitTimeLabel', 'edited_products.subscriptionCost', 'edited_products.pause', 'product_labels.customLabel0', 'product_labels.customLabel1', 'product_labels.customLabel2', 'product_labels.customLabel3', 'product_labels.customLabel4', 'product_labels.adsLabels', 'product_labels.adsGrouping', 'product_labels.shippingLabel', 'product_labels.taxCategory')
            ->where('shop_product_variants.feed_setting_id', $request->feedID)
            ->leftJoin('edited_products', 'shop_product_variants.id', 'edited_products.shop_product_variant_id')
            ->leftJoin('product_labels', 'shop_product_variants.id', 'product_labels.shop_product_variant_id')
            ->get();
        $arrData = [];
        $filters = [];
        $countfilter = 0;
        foreach ($request->filters as $f) :
            $filters[$countfilter] = $f;
            $countfilter++;
        endforeach;
        foreach ($filters as $key => $filter) :
            if ($filter['value'] != null) :
                if ($key == 0) :
                    $arrData =  collect($productData)->where($filter['name'], $filter['value'])->all();
                else :
                    $arrData = collect($arrData)->where($filter['name'], $filter['value'])->all();
                endif;
            endif;
        endforeach;
        $count = count($arrData);
        $data = [];
        if ($count != 0) :
            foreach ($arrData as  $d) :
                $data['data'][] = $d;
            endforeach;
        else :
            $data['data'] = [];
        endif;
        return json_encode(['status' => true, 'products' => $data['data']]);
        // return [$data, $count];
    }

    public function applyFiltervaluesApp(Request $request)
    {
        $productData = ShopProductVariant::select('shop_product_variants.*', 'edited_products.color', 'edited_products.sizes', 'edited_products.material', 'edited_products.pattern', 'edited_products.sizeSystem', 'edited_products.sizeType', 'edited_products.unitPricingMeasure', 'edited_products.unitPricingBaseMeasure', 'edited_products.multipack', 'edited_products.isBundle', 'edited_products.promotionIds', 'edited_products.salePriceEffectiveDate', 'edited_products.adult', 'edited_products.identifierExists', 'edited_products.costOfGoodsSold', 'edited_products.availability', 'edited_products.installment', 'edited_products.minEnergyEfficiencyClass', 'edited_products.maxEnergyEfficiencyClass', 'edited_products.loyaltyPoints', 'edited_products.energyEfficiencyClass', 'edited_products.maxHandlingTime', 'edited_products.shippingWidth', 'edited_products.minHandlingTime', 'edited_products.shippingHeight', 'edited_products.shippingLength', 'edited_products.shippingWeight', 'edited_products.productHeight', 'edited_products.productLength', 'edited_products.productWidth', 'edited_products.productWeight', 'edited_products.return_policy_label', 'edited_products.transitTimeLabel', 'edited_products.subscriptionCost', 'edited_products.pause', 'product_labels.customLabel0', 'product_labels.customLabel1', 'product_labels.customLabel2', 'product_labels.customLabel3', 'product_labels.customLabel4', 'product_labels.adsLabels', 'product_labels.adsGrouping', 'product_labels.shippingLabel', 'product_labels.taxCategory')
            ->where('shop_product_variants.feed_setting_id', $request->feedID)
            ->where('shop_product_variants.status', 'Approved')
            ->leftJoin('edited_products', 'shop_product_variants.id', 'edited_products.shop_product_variant_id')
            ->leftJoin('product_labels', 'shop_product_variants.id', 'product_labels.shop_product_variant_id')
            ->get();
        $arrData = [];
        $filters = [];
        $countfilter = 0;
        foreach ($request->filters as $f) :
            $filters[$countfilter] = $f;
            $countfilter++;
        endforeach;
        foreach ($filters as $key => $filter) :
            if ($filter['value'] != null) :
                if ($key == 0) :
                    $arrData =  collect($productData)->where($filter['name'], $filter['value'])->all();
                else :
                    $arrData = collect($arrData)->where($filter['name'], $filter['value'])->all();
                endif;
            endif;
        endforeach;
        $count = count($arrData);
        $data = [];
        if ($count != 0) :
            foreach ($arrData as  $d) :
                $data['data'][] = $d;
            endforeach;
        else :
            $data['data'] = [];
        endif;
        return json_encode(['status' => true, 'products' => $data['data']]);
        // return [$data, $count];
    }

    public function applyFiltervaluesDis(Request $request)
    {
        $productData = ShopProductVariant::select('shop_product_variants.*', 'edited_products.color', 'edited_products.sizes', 'edited_products.material', 'edited_products.pattern', 'edited_products.sizeSystem', 'edited_products.sizeType', 'edited_products.unitPricingMeasure', 'edited_products.unitPricingBaseMeasure', 'edited_products.multipack', 'edited_products.isBundle', 'edited_products.promotionIds', 'edited_products.salePriceEffectiveDate', 'edited_products.adult', 'edited_products.identifierExists', 'edited_products.costOfGoodsSold', 'edited_products.availability', 'edited_products.installment', 'edited_products.minEnergyEfficiencyClass', 'edited_products.maxEnergyEfficiencyClass', 'edited_products.loyaltyPoints', 'edited_products.energyEfficiencyClass', 'edited_products.maxHandlingTime', 'edited_products.shippingWidth', 'edited_products.minHandlingTime', 'edited_products.shippingHeight', 'edited_products.shippingLength', 'edited_products.shippingWeight', 'edited_products.productHeight', 'edited_products.productLength', 'edited_products.productWidth', 'edited_products.productWeight', 'edited_products.return_policy_label', 'edited_products.transitTimeLabel', 'edited_products.subscriptionCost', 'edited_products.pause', 'product_labels.customLabel0', 'product_labels.customLabel1', 'product_labels.customLabel2', 'product_labels.customLabel3', 'product_labels.customLabel4', 'product_labels.adsLabels', 'product_labels.adsGrouping', 'product_labels.shippingLabel', 'product_labels.taxCategory')
            ->where('shop_product_variants.feed_setting_id', $request->feedID)
            ->where('shop_product_variants.status', 'Disapproved')
            ->leftJoin('edited_products', 'shop_product_variants.id', 'edited_products.shop_product_variant_id')
            ->leftJoin('product_labels', 'shop_product_variants.id', 'product_labels.shop_product_variant_id')
            ->get();
        $arrData = [];
        $filters = [];
        $countfilter = 0;
        foreach ($request->filters as $f) :
            $filters[$countfilter] = $f;
            $countfilter++;
        endforeach;
        foreach ($filters as $key => $filter) :
            if ($filter['value'] != null) :
                if ($key == 0) :
                    $arrData =  collect($productData)->where($filter['name'], $filter['value'])->all();
                else :
                    $arrData = collect($arrData)->where($filter['name'], $filter['value'])->all();
                endif;
            endif;
        endforeach;
        $count = count($arrData);
        $data = [];
        if ($count != 0) :
            foreach ($arrData as  $d) :
                $data['data'][] = $d;
            endforeach;
        else :
            $data['data'] = [];
        endif;
        return json_encode(['status' => true, 'products' => $data['data']]);
        // return [$data, $count];
    }

    public function applyFiltervaluesPen(Request $request)
    {
        $productData = ShopProductVariant::select('shop_product_variants.*', 'edited_products.color', 'edited_products.sizes', 'edited_products.material', 'edited_products.pattern', 'edited_products.sizeSystem', 'edited_products.sizeType', 'edited_products.unitPricingMeasure', 'edited_products.unitPricingBaseMeasure', 'edited_products.multipack', 'edited_products.isBundle', 'edited_products.promotionIds', 'edited_products.salePriceEffectiveDate', 'edited_products.adult', 'edited_products.identifierExists', 'edited_products.costOfGoodsSold', 'edited_products.availability', 'edited_products.installment', 'edited_products.minEnergyEfficiencyClass', 'edited_products.maxEnergyEfficiencyClass', 'edited_products.loyaltyPoints', 'edited_products.energyEfficiencyClass', 'edited_products.maxHandlingTime', 'edited_products.shippingWidth', 'edited_products.minHandlingTime', 'edited_products.shippingHeight', 'edited_products.shippingLength', 'edited_products.shippingWeight', 'edited_products.productHeight', 'edited_products.productLength', 'edited_products.productWidth', 'edited_products.productWeight', 'edited_products.return_policy_label', 'edited_products.transitTimeLabel', 'edited_products.subscriptionCost', 'edited_products.pause', 'product_labels.customLabel0', 'product_labels.customLabel1', 'product_labels.customLabel2', 'product_labels.customLabel3', 'product_labels.customLabel4', 'product_labels.adsLabels', 'product_labels.adsGrouping', 'product_labels.shippingLabel', 'product_labels.taxCategory')
            ->where('shop_product_variants.feed_setting_id', $request->feedID)
            ->where('shop_product_variants.status', 'Pending')
            ->leftJoin('edited_products', 'shop_product_variants.id', 'edited_products.shop_product_variant_id')
            ->leftJoin('product_labels', 'shop_product_variants.id', 'product_labels.shop_product_variant_id')
            ->get();
        $arrData = [];
        $filters = [];
        $countfilter = 0;
        foreach ($request->filters as $f) :
            $filters[$countfilter] = $f;
            $countfilter++;
        endforeach;
        foreach ($filters as $key => $filter) :
            if ($filter['value'] != null) :
                if ($key == 0) :
                    $arrData =  collect($productData)->where($filter['name'], $filter['value'])->all();
                else :
                    $arrData = collect($arrData)->where($filter['name'], $filter['value'])->all();
                endif;
            endif;
        endforeach;
        $count = count($arrData);
        $data = [];
        if ($count != 0) :
            foreach ($arrData as  $d) :
                $data['data'][] = $d;
            endforeach;
        else :
            $data['data'] = [];
        endif;
        return json_encode(['status' => true, 'products' => $data['data']]);
        // return [$data, $count];
    }

    public function forscore(Request $request)
    {
        $userproductview =  ShopProductVariant::where([
            ['feed_setting_id', '=', $request->feedId],
            ['score', '>=', $request->scores['start']],
            ['score', '<=', $request->scores['end']]
        ])->orderBy('id')->paginate($request->paginate);
        $count = ShopProductVariant::where([
            ['feed_setting_id', '=', $request->feedId],
            ['score', '>=', $request->scores['start']],
            ['score', '<=', $request->scores['end']]
        ])->count();
        return response()->json(['status' => true, 'products' => $userproductview]);
    }

    public function notifications()
    {
        $productUpdated = Notification::where('user_id', auth()->user()->id)
            ->orderBy('id', 'desc')->take(50)->get();
        return $productUpdated;
    }
    public function notificationCount()
    {
        $count = Notification::where([
            'user_id' => auth()->user()->id,
            'read' => 0
        ])->count();
        return $count;
    }
    public function notificationUpdate(Request $request)
    {
        $notification = Notification::where([
            'id' => $request->id,
            'user_id' => auth()->user()->id
        ])->first();

        if ($notification->update(['read' => 1])) {
            return response()->json(['status' => true, 'message' => 'Notification Read']);
        } else {
            return response()->json(['status' => false, 'message' => 'Something Went Wrong']);
        }
    }

    public function syncLocalFeed(Request $request)
    {
        $shop = auth()->user();
        $validator = validator($request->all(), config('formValidation.localFeedForm'));
        if ($validator->fails()) :
            return response()->json(['errors' => $validator->errors()], 500);
        endif;
        $validated = $validator->validated();
        $feedSetting = FeedSetting::where('id', $validated['feed_setting_id'])->where('user_id', $shop->id)->withCount('shopProductVariants')->first();

        $uuid = Str::uuid();
        $isUnique = LocalInventoryFeed::where('uuid', $uuid)->first();
        while (isset($isUnique['id'])) {
            $uuid = Str::uuid();
            $isUnique = LocalInventoryFeed::where('uuid', $uuid)->first();
        }

        if (isset($validated['salePriceEffectiveDate'])) :
            if (isset($validated['salePriceEffectiveDate']['start']) && isset($validated['salePriceEffectiveDate']['end'])) :
                $validated['salePriceEffectiveDate'] = $validated['salePriceEffectiveDate']['start'] . "/" . $validated['salePriceEffectiveDate']['end'];
            else :
                $validated['salePriceEffectiveDate'] = "";
            endif;
        endif;

        $validated['uuid'] = $uuid;
        $validated['user_id'] = $shop->id;
        $validated['feed_url'] = "https://staggingeasyfeed.com/feed/local/" . $uuid;
        $validated['skus'] = $feedSetting->shop_product_variants_count;
        $localInventoryFeed = new LocalInventoryFeed();
        $localInventoryFeed->fill($validated);
        $localInventoryFeed->save();

        if (isset($localInventoryFeed['id'])) :
            $jobData = [
                "user" => $shop,
                "localInventoryFeed" => $localInventoryFeed
            ];
            SyncLocalInventoryFeed::dispatch($jobData);
            return response()->json(['success' => "Products Being Synced", "status" => true], 200);
        else :
            return response()->json(['success' => "Something Went Wrong", "status" => false], 200);
        endif;
        return response()->json(['success' => 'Something Went Wrong', "status" => false], 200);
    }

    public function deleteLocalFeed($id)
    {
        $feed = LocalInventoryFeed::where('id', $id)->where('user_id', auth()->user()->id)->first();
        if ($feed->delete()) :
            return response()->json(['status' => true, 'message' => 'Feed Deleted Successfully']);
        else :
            return response()->json(['status' => false, 'message' => 'Something Went Wrong']);
        endif;
        return response()->json(['status' => false, 'message' => 'Something Went Wrong']);
    }

    public function updateLocalFeedStatus(Request $request)
    {
        $feedLocal = LocalInventoryFeed::where('id', $request->id)->first();
        if ($feedLocal) :
            if ($feedLocal->update(['status' => !$feedLocal->status])) :
                return response()->json(['status' => true, 'message' => 'Status Updated'], 200);
            else :
                return response()->json(['status' => false, 'error' => 'Something went wrong'], 500);
            endif;
        endif;
    }

    public function testFunctionLoop()
    {
        // $recordCount = ShopProductVariant::where('itemId', null)->count();
        // return $recordCount;

        // $recordCount = ShopProductVariant::whereNull('itemId')->get();
        // return $recordCount;

        // ShopProductVariant::where('feed_setting_id', 4179)->chunk(1000, function ($variants) {
        //     foreach ($variants as $variant) {
        //         $feedSetting = FeedSetting::find($variant->feed_setting_id);

        //         if ($feedSetting) {
        //             $merchantCenterId = null;

        //             switch ($feedSetting->productIdFormat) {
        //                 case 'sku':
        //                     $merchantCenterId = $feedSetting->channel . ':' . $feedSetting->language . ':' . $feedSetting->country . ':' . $variant->sku;
        //                     break;
        //                 case 'variant':
        //                     $merchantCenterId = $feedSetting->channel . ':' . $feedSetting->language . ':' . $feedSetting->country . ':' . $variant->variantId;
        //                     break;
        //                 case 'global':
        //                     $merchantCenterId = $feedSetting->channel . ':' . $feedSetting->language . ':' . $feedSetting->country . ':shopify_' . $feedSetting->country . '_' . $variant->productId . '_' . $variant->variantId;
        //                     break;
        //             }

        //             $variant->update(['itemId' => $merchantCenterId]);
        //         }
        //     }
        // });

        // return "updated";
    }
}
