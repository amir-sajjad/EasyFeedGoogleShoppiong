<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CsvController;
use App\Jobs\UpdateMerchantCenterIdJob;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\PromtionController;
use App\Http\Controllers\CustomBillingController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/influencer', function () {
//     return view('welcome');
// });

// Route::fallback(function(){
//     return view('welcome');
// });

Route::middleware(['verify.shopify'])->group(function () {
    Route::middleware(['SecondTimeCheck'])->group(function () {
        Route::get('/', [WelcomeController::class, 'index'])->name('home');
        Route::get('/setupPrice', [WelcomeController::class, 'stepperPricing'])->name('stepperPricing');
    });
    Route::middleware(['FirstTimeCheck'])->group(function () {
        Route::get('dashboard', [WelcomeController::class, 'dashboard'])->name('dashboard');
        Route::get('loading', [WelcomeController::class, 'loadingPage'])->name('loading');
        Route::fallback([WelcomeController::class, 'fallBack']);
    });
    Route::get('get/features/status', [WelcomeController::class, 'featuresStatus'])->name('features');

    // *********************************************************************************************
    // Feed Creating Routes
    // ********************************************************************************************
    Route::get('get/setup', [HomeController::class, 'getSetup'])->name('getSetup');
    Route::get('get/google/data', [HomeController::class, 'getGoogleData'])->name('getGoogleData');
    Route::get('get/accounts', [HomeController::class, 'getAccounts'])->name('getAcounts');
    Route::get('setup/google', [SetupController::class, 'redirectToProvider'])->name('redirect');
    Route::get('get/connection/status', [HomeController::class, 'getConnectionStatus'])->name('getConnectionStatus');
    Route::post('setup/account/connect', [SetupController::class, 'accountConnect'])->name('accountConnect');
    Route::get('setup/domain/verify', [SetupController::class, 'domainVerify'])->name('domainVerify');
    Route::get('setup/google/disconnect', [SetupController::class, 'disconnect'])->name('disconnect');
    Route::get('setup/account/disconnect', [SetupController::class, 'accountDisconnect'])->name('accountDisconnect');
    Route::get('get/markets', [HomeController::class, 'getMarkets'])->name('getMarkets');
    Route::post('get/market/details', [HomeController::class, 'getMarketDetails'])->name('getMarketDetails');
    Route::get('get/feed/settings', [HomeController::class, 'getFeedSettings'])->name('getFeedSettings');
    Route::post('setup/sync', [WelcomeController::class, 'sync'])->name('sync');

    // *********************************************************************************************
    // Dashboard Feed Routes
    // *********************************************************************************************
    Route::get('fetch/feeds/data', [HomeController::class, 'fetchFeedsData'])->name('fetchFeedsData');
    Route::post('update/feed/status', [WelcomeController::class, 'updateFeedStatus'])->name('updateFeedStatus');
    Route::delete('feed/delete/{id}/{consent}', [WelcomeController::class, 'deleteFeed'])->name('deleteFeed');
    Route::post('send/review', [WelcomeController::class, 'submitReview'])->name('writeReview');

    // *********************************************************************************************
    // General Setting Page Routes
    // *********************************************************************************************
    Route::get('get/all/feeds', [HomeController::class, 'fetchAllFeeds'])->name('fetchAllFeeds');
    Route::post('feed/changes/save', [WelcomeController::class, 'saveFeedSettingChanges'])->name('saveFeedSettingChanges');
    Route::post('feed/name', [WelcomeController::class, 'saveFeedName'])->name('saveFeedName');
    Route::post('notification/setting', [WelcomeController::class, 'saveNotificationSetting'])->name('saveNotificationSetting');
    Route::get('changeAccountRequest', [WelcomeController::class, 'changeAccountRequest'])->name('changeAccountRequest');

    // *********************************************************************************************
    // Help Center Page Routes
    // *********************************************************************************************
    Route::get('user/tickets', [HomeController::class, 'userTickets'])->name('userTickets');
    Route::post('create/ticket', [WelcomeController::class, 'createTicket'])->name('createTicket');
    Route::post('ticket/details', [HomeController::class, 'singleTicketDetail'])->name('singleTicketDetail');
    Route::post('create/reply', [WelcomeController::class, 'createTicketReply'])->name('createTicketReply');
    Route::post('close/ticket', [WelcomeController::class, 'closeTicket'])->name('closeTicket');

    // *********************************************************************************************
    // Feature Request Page Routes
    // *********************************************************************************************
    Route::get('all/suggestions', [HomeController::class, 'allSuggestions'])->name('allSuggestions');
    Route::post('add/suggestion', [WelcomeController::class, 'addSuggestion'])->name('addSuggestion');
    Route::post('add/vote/positive', [WelcomeController::class, 'addPositiveVotes'])->name('addPositiveVotes');
    Route::post('add/vote/negative', [WelcomeController::class, 'addNegativeVotes'])->name('addNegativeVotes');
    Route::post('feature/detail', [HomeController::class, 'singleFeatureDetail'])->name('singleFeatureDetail');
    Route::post('feature/reply', [WelcomeController::class, 'createFeatureReply'])->name('createFeatureReply');

    // *********************************************************************************************
    // Products Page Routes
    // *********************************************************************************************
    Route::post('feed/details', [HomeController::class, 'feedDetails'])->name('feedDetails');
    Route::get('account/issues', [HomeController::class, 'getAccountLevelIssues'])->name('getAccountLevelIssues');
    Route::get('all/products/{id}', [HomeController::class, 'getAllProducts'])->name('getAllProducts');
    Route::get('approved/products/{id}', [HomeController::class, 'getAppProducts'])->name('getAppProducts');
    Route::get('disapproved/products/{id}', [HomeController::class, 'getDisappProducts'])->name('getDisappProducts');
    Route::get('pending/products/{id}', [HomeController::class, 'getPendProducts'])->name('getPendProducts');
    Route::get('excluded/products/{id}', [HomeController::class, 'getExclProducts'])->name('getExclProducts');
    Route::get('count/{id}', [HomeController::class, 'getCounts'])->name('getCounts');
    Route::post('get/metafields', [HomeController::class, 'getMetafields'])->name('getMetafields');
    Route::post('sync/shopify', [WelcomeController::class, 'syncDataFromShopify'])->name('syncDataFromShopify');
    Route::post('sync/google', [WelcomeController::class, 'syncSingleFeedStatusFromGoogle'])->name('syncSingleFeedStatusFromGoogle');
    Route::post('exclude/products', [WelcomeController::class, 'excludeProducts'])->name('excludeProducts');
    Route::post('include/products', [WelcomeController::class, 'includeProducts'])->name('includeProducts');
    Route::post('delete/bulk', [WelcomeController::class, 'deleteBulkProducts'])->name('deleteBulkProducts');
    Route::post('delete/single', [WelcomeController::class, 'deleteSingleProduct'])->name('deleteSingleProduct');
    Route::post('delete/single/excluded', [WelcomeController::class, 'deleteSingleExcludedProduct'])->name('deleteSingleExcludedProduct');
    Route::post('delete/bulk/excluded', [WelcomeController::class, 'deleteBulkExcludedProducts'])->name('deleteBulkExcludedProducts');
    Route::get('get/store/products', [HomeController::class, 'getStoreProducts'])->name('getStoreProducts');
    Route::post('add/products', [WelcomeController::class, 'addNewProducts'])->name('addNewProducts');
    Route::post('bulk/edit', [WelcomeController::class, 'editBulkProducts'])->name('editBulkProducts');
    Route::get('getData/{id}/{resource}', [HomeController::class, 'dataGet'])->name('dataGet');

    // *********************************************************************************************
    // Single Product Page Routes
    // *********************************************************************************************
    Route::post('product/fetch/byId', [HomeController::class, 'productsGetById'])->name('prductsFetchById');
    Route::post('editProduct/sync', [WelcomeController::class, 'editedProductData'])->name('editedProductData');
    Route::post('upload/image/file', [WelcomeController::class, 'uploadFileImage'])->name('uploadFileImage');
    Route::post('upload/images', [WelcomeController::class, 'uploadImages'])->name('uploadImages');

    // *********************************************************************************************
    // Promotion Feed Routes
    // *********************************************************************************************

    Route::post('createPromo', [PromtionController::class, 'createPromotion']);
    Route::get('getPromotions', [PromtionController::class, 'getPromotions']);
    Route::get('createMerchant', [PromtionController::class, 'createMerchant']);
    Route::delete('deletePromotion/{promotionToDelete}', [PromtionController::class, 'deletePromotion']);

    // *********************************************************************************************
    // Import Export Routes
    // *********************************************************************************************

    Route::controller(CsvController::class)->group(
        function () {
            Route::post('createCsv', 'createCsv');
            Route::post('createZip', 'exportProductsViaMail');
            Route::get('send-email', 'index');
            Route::post('readCsv', 'readCsv');
            Route::post('uploadCompleteCsv', 'uploadCompleteCsv');
            Route::get('uploadedCsvDetail', 'uploadedCsvDetail');
        }
    );

    // *********************************************************************************************
    // Pricing and Billing Routes
    // *********************************************************************************************

    Route::get('plan/details', [HomeController::class, 'getUserPlanDetails'])->name('getUserPlanDetails');
    Route::post('applyCoupon', [CustomBillingController::class, 'applyCouponCode']);
    Route::get('getShopifyPlanName', [CustomBillingController::class, 'getPlanName']);
    Route::post('activateFreePlan', [CustomBillingController::class, 'freePlan'])->name('freePlan');
    Route::get('/billing/processed/{plan?}', [CustomBillingController::class, 'processBill'])
        ->where('plan', '^([0-9]+|)$')
        ->name('billing.processed');

    // *********************************************************************************************
    // Search, Score Filter and Filter Routes
    // *********************************************************************************************

    Route::post('filter/product', [WelcomeController::class, 'forfilter'])->name('forfilter');
    Route::post('apply/filter', [WelcomeController::class, 'applyFilter'])->name('applyfilter');
    Route::post('apply/filter/values', [WelcomeController::class, 'applyFiltervalues']);
    Route::post('apply/filter/values/approved', [WelcomeController::class, 'applyFiltervaluesApp']);
    Route::post('apply/filter/values/disapproved', [WelcomeController::class, 'applyFiltervaluesDis']);
    Route::post('apply/filter/values/pending', [WelcomeController::class, 'applyFiltervaluesPen']);
    Route::post('Score/product', [WelcomeController::class, 'forscore'])->name('forscore');

    // *********************************************************************************************
    // Notification Routes
    // *********************************************************************************************

    Route::get('product/notification', [WelcomeController::class, 'notifications'])->name('notifications');
    Route::get('product/notification/count', [WelcomeController::class, 'notificationCount'])->name('notificationCount');
    Route::post('update/notification', [WelcomeController::class, 'notificationUpdate'])->name('updateNotification');

    // *********************************************************************************************
    // Local Inventory Routes
    // *********************************************************************************************
    Route::get('local/feeds', [HomeController::class, 'getLocalFeeds'])->name('localFeeds');
    Route::post('sync/local/feed', [WelcomeController::class, 'syncLocalFeed'])->name('syncLocalFeed');
    Route::delete('local/feed/delete/{id}', [WelcomeController::class, 'deleteLocalFeed'])->name('deleteFeedLocal');
    Route::post('update/local/status', [WelcomeController::class, 'updateLocalFeedStatus'])->name('updateLocalStatus');
});

Route::get('/dispatch-job', function () {
    dispatch(new UpdateMerchantCenterIdJob());

    return "Job dispatched successfully!";
});

Route::get('setup/google/callback', [SetupController::class, 'callback_url_handler'])->name('callback');

Route::get('sampleCsv', function () {
    //Headers To Trigger Download Of File
    $filename = "EasyFeed_Sample_data.csv";
    $headers = [
        "Content-type" => "text/csv",
        "Content-Disposition" => "attachment; filename={$filename}",
        "Pragma" => "no-cache",
        "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
        "Expires" => "0"
    ];
    $download_path = public_path($filename);
    return response()->download($download_path, $filename, $headers);
})->name('csvsample');

Route::get('logs', [\Rap2hpoutre\LaravelLogViewer\LogViewerController::class, 'index']);
