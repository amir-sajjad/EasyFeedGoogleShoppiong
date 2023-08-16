<?php

namespace App\Http\Traits;

use App\Models\Promotion;
use Illuminate\Support\Str;
use App\Http\Traits\ShopifyTrait;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;


trait GoogleApiTrait
{

    use ShopifyTrait;

    private $token;
    private $merchantId;
    private $accountId;
    private $googleUser;

    public function ContentApiRequest($api, $params = null, $postparams = null, $method = 'get')
    {
        $response =  Http::withToken($this->token)
            ->timeout(0)
            ->$method($this->makeGoogleUrl($api, 'contentApis', $params), $postparams);
        if ($response->status() == 400 || $response->status() == 403) :
            info(json_encode($response->json()));
        endif;
        if ($response->status() == 200 || ($response->status() == 403 && $api == "claimWebsite")) :
            return $response->json();
        endif;
        if ($response->status() == 401) :
            if ($this->refreshToken($this->googleUser)) :
                $res =  Http::withToken($this->token)->timeout(0)->$method($this->makeGoogleUrl($api, 'contentApis', $params), $postparams);
                if ($res->status() == 200) :
                    return $res->json();
                endif;
                return $res->json();
            endif;
        endif;
        if ($response->status() == 500) :
            info($response);
        endif;
        return false;
    }

    public function siteVerificationApiRequest($api, $params = null, $postparams = null, $method = 'get', $googleUser = null)
    {
        $response =  Http::withToken($this->token)
            ->$method($this->makeGoogleUrl($api, 'siteVerificationApis', $params), $postparams);
        return $response;
        if ($response->status() == 200) :
            return $response->json();
        endif;
        if ($response->status() == 401) :
            if ($this->refreshToken($this->googleUser)) :
                $res =  Http::withToken($this->token)->$method($this->makeGoogleUrl($api, 'siteVerificationApis', $params), $postparams);
                if ($res->status() == 200) :
                    return $res->json();
                endif;
            endif;
        endif;
        return false;
    }

    public function makeGoogleUrl($api, $type, $data = null)
    {
        foreach (config("googleApi.$type.$api") as $index => $value) :
            $url[] = $value;
            if (isset($data[$index])) :
                $url[] = $data[$index];
            endif;
        endforeach;
        return implode('', $url);
    }

    public function getMerchantAccounts($token = null, $googleUser = null)
    {
        if (!$this->googleUser) :
            $this->googleUser = $googleUser ? $googleUser : auth()->user();
        endif;
        if (!$this->token) :
            $this->token = $token ? $token : $this->googleUser->settings->googleAccessToken;
        endif;
        $response = $this->ContentApiRequest('getMainMerchantAccount');
        if ($response) :
            $accounts = [];
            if (isset($response['accountIdentifiers'])) :
                foreach ($response['accountIdentifiers'] as $value) :
                    if (isset($value['aggregatorId']) && !isset($value['merchantId'])) :
                        $accounts[] = $value['aggregatorId'];
                    endif;
                    if (isset($value['merchantId'])) :
                        $accounts[] = $value['merchantId'];
                    endif;
                endforeach;
            endif;
            foreach ($accounts as $key => $value) :
                $accounts[$key] = $this->getSubMerchantAccounts($value);
            endforeach;
            return $accounts;
        else :
            return [];
        endif;
    }

    public function getSubMerchantAccounts($merchantId)
    {
        $res = $this->getAccountInfo($merchantId);
        $response = $this->ContentApiRequest('getSubMerchantAccounts', [$merchantId]);
        $subAccounts = [];
        if ($res) :
            if (isset($res['name'])) :
                $subAccounts['merchantId'] =  $merchantId;
                $subAccounts['merchantName'] = $res['name'];
            endif;
        endif;
        $subAccounts['subAccounts'] = [];
        if ($response) :
            if (isset($response['resources'])) :
                foreach ($response['resources'] as $single) :
                    $subAccounts['subAccounts'][] = [
                        'id' => $single['id'],
                        'name' => $single['name']
                    ];
                endforeach;
            endif;
        endif;
        return $subAccounts;
    }

    public function getAccountInfo($accountid, $token = null, $googleUser = null)
    {
        if (!$this->googleUser) :
            $this->googleUser = $googleUser ? $googleUser : auth()->user();
        endif;
        if (!$this->token) :
            $this->token = $token ? $token : $this->googleUser->settings->googleAccessToken;
        endif;
        return $this->ContentApiRequest('getAccountInfo', [$accountid, $accountid]);
    }

    public function updateDomaintoMerchantAccount()
    {
        if (!$this->googleUser) :
            $this->googleUser = auth()->user();
        endif;
        if (!$this->token) :
            $this->token = $this->googleUser->settings->googleAccessToken;
        endif;
        $accounts = [
            $this->googleUser->settings->merchantAccountId,
            $this->googleUser->settings->merchantAccountId
        ];
        $data = [
            'websiteUrl' => "https://" . $this->googleUser->settings->domain,
            'id' => $this->googleUser->settings->merchantAccountId,
            'name' => $this->googleUser->settings->merchantAccountName,
            "users" => [
                [
                    "emailAddress" => $this->googleUser->settings->googleAccountEmail,
                    "admin" => true
                ]
            ]
        ];
        $response =  $this->ContentApiRequest('updateAccountInfo', $accounts, $data, 'put');
        return $response;
    }
    public function updateShippingtoMerchantAccount($user = null)
    {
        if (!$this->googleUser) :
            $this->googleUser = $user ? $user : auth()->user();
        endif;
        if (!$this->token) :
            $this->token = $this->googleUser->settings->googleAccessToken;
        endif;
        $accounts = [
            $this->googleUser->settings->merchantAccountId,
            $this->googleUser->settings->merchantAccountId
        ];
        /* $data = [
            "accountId" => $this->googleUser->settings->merchantAccountId,
            "services" => [
                [
                    "name" => config('googleApi.strings.AutomaticShippingName'),
                    "deliveryCountry" => auth()->user()->settings->country,
                    "currency" => auth()->user()->settings->currency,
                    "rateGroups" => [
                        [
                            "applicableShippingLabels" => [
                                "KG"
                            ],
                            "name" => "Free Shipping KG",
                            'mainTable' => [
                                "rowHeaders" => [
                                    "weights" => [
                                        [
                                            "value" => "100",
                                            "unit" => "kg"
                                        ],
                                        [
                                            "value" => "infinity",
                                            "unit" => "kg"
                                        ]
                                    ]
                                ],
                                "rows" => [
                                    [
                                        "cells" => [
                                            [
                                                "noShipping" => true
                                            ]
                                        ]
                                    ],
                                    [
                                        "cells" => [
                                            [
                                                "noShipping" => true
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ],
                        [
                            "applicableShippingLabels" => [
                                "LB"
                            ],
                            "name" => "Free Shipping LB",
                            'mainTable' => [
                                "rowHeaders" => [
                                    "weights" =>[
                                        [
                                            "value" => "100",
                                            "unit" => "lb"
                                        ],
                                        [
                                            "value" => "infinity",
                                            "unit" => "lb"
                                        ]
                                    ]
                                ],
                                "rows" => [
                                    [
                                        "cells" => [
                                            [
                                                "noShipping" => true
                                            ]
                                        ],
                                    ],
                                    [
                                        "cells" => [
                                            [
                                                "noShipping" => true
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ],
                    "deliveryTime" => [
                        "minTransitTimeInDays" => 7,
                        "maxTransitTimeInDays" => 9,
                        "minHandlingTimeInDays" => 1,
                        "maxHandlingTimeInDays" => 2,
                    ],
                    "active" => true,
                    "eligibility" => "All scenarios"
                ]
            ]
        ]; */
        $data = [
            "accountId" => $this->googleUser->settings->merchantAccountId,
            "services" => [
                [
                    "name" => config('googleApi.strings.AutomaticShippingName'),
                    "deliveryCountry" => $this->googleUser->settings->country,
                    "currency" => $this->googleUser->settings->currency,
                    "rateGroups" => [
                        [
                            "name" => "Price",
                            'mainTable' => [
                                "rowHeaders" => [
                                    "prices" => [
                                        [
                                            "value" => "100",
                                            "currency" => $this->googleUser->settings->currency
                                        ],
                                        [
                                            "value" => "infinity",
                                            "currency" => $this->googleUser->settings->currency
                                        ]
                                    ]
                                ],
                                "rows" => [
                                    [
                                        "cells" => [
                                            [
                                                "noShipping" => true
                                            ]
                                        ]
                                    ],
                                    [
                                        "cells" => [
                                            [
                                                "noShipping" => true
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ],
                    ],
                    "deliveryTime" => [
                        "minTransitTimeInDays" => 7,
                        "maxTransitTimeInDays" => 9,
                        "minHandlingTimeInDays" => 1,
                        "maxHandlingTimeInDays" => 2,
                    ],
                    "active" => true,
                    "eligibility" => "All scenarios"
                ]
            ]
        ];
        $response =  $this->ContentApiRequest('updateShippingSettings', $accounts, $data, 'put');
        return $response;
    }

    public function claimSite()
    {
        if (!$this->googleUser) :
            $this->googleUser = auth()->user();
        endif;
        if (!$this->token) :
            $this->token = auth()->user()->settings->googleAccessToken;
        endif;
        $accounts = [
            $this->googleUser->settings->merchantAccountId,
            $this->googleUser->settings->merchantAccountId
        ];
        $response =  $this->ContentApiRequest('claimWebsite', $accounts, [], 'post');
        if (isset($response['error'])) :
            if (Str::contains($response['error']['message'], $this->googleUser->settings->googleAccountEmail)) :
                return true;
            endif;
            return false;
        endif;
        return $response;
    }

    public function getSiteVerificationToken($user = null)
    {
        if (!$this->googleUser) :
            $this->googleUser = $user ? $user : auth()->user();
        endif;
        if (!$this->token) :
            $this->token = $this->googleUser->settings->googleAccessToken;
        endif;
        $data = [
            "site" =>  [
                "identifier" => "https://" . $this->googleUser->settings->domain,
                "type" => "SITE"
            ],
            "verificationMethod" => "META"
        ];
        return $this->siteVerificationApiRequest('getSiteVerificationToken', null, $data, 'POST');
    }

    public function verifySite()
    {
        if (!$this->googleUser) :
            $this->googleUser = auth()->user();
        endif;
        if (!$this->token) :
            $this->token = $this->googleUser->settings->googleAccessToken;
        endif;
        $data = [
            "site" => [
                "type" => "SITE",
                "identifier" => "https://" . $this->googleUser->settings->domain
            ]
        ];
        return isset($this->siteVerificationApiRequest('verifySite', null, $data, 'post')['id']) ? true : false;
    }

    // public function getMerchantAccountProducts($merchantId){
    //     $this->setup($merchantId);
    //     $response = $this->ContentApiRequest('getAllProducts',[$this->merchantId]);
    //     return $response->status() == 200 ?  $response['resources'] : null;
    // }

    // public function updateSingleProduct($toUpload,$productId, $shop = null){
    //     if($shop):
    //         $this->googleUser = $shop;
    //     else:
    //         $this->googleUser = auth()->user();
    //     endif;
    //     if(!$this->token):
    //         $this->token = $this->googleUser->settings->googleAccessToken;
    //     endif;
    //     $accounts = [
    //         $this->googleUser->settings->merchantAccountId.'/products/online:'.$productId.'?key='
    //     ];
    //     $response = $this->ContentApiRequest('updateSingleProduct',$accounts,$toUpload,'PATCH');
    //     return $response;
    // }

    public function refreshToken($googleUser)
    {
        if (!$this->googleUser) :
            $this->googleUser = $googleUser ? $googleUser : auth()->user();
        endif;
        $response =  Http::post($this->makeGoogleUrl('refreshToken', 'contentApis', null), [
            'client_id' => config('googleApi.client_id'),
            'client_secret' => config('googleApi.client_secret'),
            'refresh_token' =>  $this->googleUser->settings->googleRefreshToken,
            'grant_type' => 'refresh_token',
        ]);
        if ($response->status() == 200) :
            $settings = $this->googleUser->settings;
            $settings->googleAccessToken = $response['access_token'];
            if ($settings->save(['timestamps' => false])) :
                $this->googleUser->load('settings');
                $this->token = $response['access_token'];
                return true;
            endif;
        endif;
        return false;
    }

    public function disconnectGoogle()
    {
        $response =  Http::withHeaders(["Content-type" => "application/x-www-form-urlencoded"])->post($this->makeGoogleUrl('revokeToken', 'contentApis', null) . auth()->user()->settings->googleAccessToken);
        if ($response->status() == 200) :
            $update = [
                'googleAccessToken' => null,
                'googleRefreshToken' => null,
                'googleAccountId' => null,
                'googleAccountEmail' => null,
                'googleAccountName' => null,
                'googleAccountAvatar' => null,
                'merchantAccountId' => null,
                'merchantAccountName' => null
            ];
            if (auth()->user()->settings->update($update)) :
                return true;
            endif;
        endif;
        return false;
    }

    public function uploadProductToMerchantAccount($data, $shop = null)
    {
        if ($shop) :
            $this->googleUser = $shop;
        else :
            $this->googleUser = auth()->user();
        endif;
        if (!$this->token) :
            $this->token = $this->googleUser->settings->googleAccessToken;
        endif;
        return $this->ContentApiRequest('addProduct', [$this->googleUser->settings->merchantAccountId], $data, 'post');
    }

    public function uploadBulkProductsToMerchantAccount($toUpload, $shop = null)
    {
        if ($shop) :
            $this->googleUser = $shop;
        else :
            $this->googleUser = auth()->user();
        endif;
        if (!$this->token) :
            $this->token = $this->googleUser->settings->googleAccessToken;
        endif;
        $response = $this->ContentApiRequest('addBulkProducts', null, $toUpload, 'post');
        return $response;
    }

    public function SyncLocalInventoryFeedToMerchant($toUpload, $shop = null)
    {
        if ($shop) :
            $this->googleUser = $shop;
        else :
            $this->googleUser = auth()->user();
        endif;
        if (!$this->token) :
            $this->token = $this->googleUser->settings->googleAccessToken;
        endif;
        $response = $this->ContentApiRequest('syncLocalFeed', null, $toUpload, 'post');
        return $response;
    }

    public function SyncRegionalInventoryFeedToMerchant($toUpload, $shop = null)
    {
        if ($shop) :
            $this->googleUser = $shop;
        else :
            $this->googleUser = auth()->user();
        endif;
        if (!$this->token) :
            $this->token = $this->googleUser->settings->googleAccessToken;
        endif;
        $response = $this->ContentApiRequest('syncRegionalFeed', null, $toUpload, 'post');
        return $response;
    }

    public function deleteBulkProductsFromMerchantAccount($toDelete, $shop = null)
    {
        if ($shop) :
            $this->googleUser = $shop;
        else :
            $this->googleUser = auth()->user();
        endif;
        if (!$this->token) :
            $this->token = $this->googleUser->settings->googleAccessToken;
        endif;
        $response = $this->ContentApiRequest('removeBulkProducts', null, $toDelete, 'post');
        return $response;
    }

    public function updateProductStatuses($products, $googleUser = null, $token = null)
    {
        if (!$this->googleUser) :
            $this->googleUser = $googleUser ? $googleUser : auth()->user();
        endif;
        if (!$this->token) :
            $this->token = $token ? $token : $this->googleUser->settings->googleAccessToken;
        endif;
        $data['entries'] = [];
        $count = 0;
        foreach ($products as $key => $product) :
            $single = [
                "merchantId" => $this->googleUser->settings->merchantAccountId,
                "method" => "get",
                "includeAttributes" => false
            ];
            $flag = false;
            if ($this->googleUser->settings->whichProducts == "first") :
                $flag = true;
            endif;
            foreach ($product->variants as $key2 => $value) :
                $single['batchId'] = $count;
                $single['productId'] = $this->convertProductIdToGoogleFormat($product, $value);
                $data['entries'][] = $single;
                $count++;
                if ($flag) :
                    break;
                endif;
            endforeach;
        endforeach;
        $response = $this->ContentApiRequest('getStatuses', null, $data, 'POST');
        if (isset($response['entries'])) :
            foreach ($products as $product) :
                $statuses = [];
                foreach ($product->variants as $value) :
                    foreach ($response['entries'] as  $entry) :
                        if (isset($entry['productStatus'])) :
                            if ($this->convertProductIdToGoogleFormat($product, $value) == $entry['productStatus']['productId']) :
                                $status = $this->getStatusToProduct($entry['productStatus']['destinationStatuses']);
                                if ($status) :
                                    $value->update(['status' => $status]);
                                    $statuses[] = $status;
                                endif;
                                break;
                            endif;
                        endif;
                    endforeach;
                endforeach;
                if ($statuses) :
                    $product->update([
                        'status' => array_unique($statuses)
                    ]);
                endif;
            endforeach;
        endif;
    }

    public function updateProductStatusesFromMerchant($products, $feedSettings, $googleUser = null, $token = null)
    {
        $this->googleUser = $googleUser ?? auth()->user();
        $this->token = $token ?? $this->googleUser->settings->googleAccessToken;
        $count = 0;
        $data['entries'] = array_map(function ($product) use ($feedSettings, &$count) {
            $batchId = $count;
            $count++;
            return [
                "merchantId" => $feedSettings->merchantAccountId,
                "method" => "get",
                "includeAttributes" => false,
                "batchId" => $batchId,
                "productId" => $product['itemId'],
            ];
        }, json_decode(json_encode($products), true));
        $response = $this->ContentApiRequest('getStatusesParticularFields', null, $data, 'POST');
        if (isset($response['entries'])) :
            $entriesCollection = collect($response['entries']);
            $products->each(function ($product) use ($feedSettings, $entriesCollection) {
                $productStatuses = $entriesCollection->where('productStatus.productId', $product['itemId'])->first();
                if (isset($productStatuses['productStatus'])) {
                    $status = isset($productStatuses['productStatus']['destinationStatuses']) ? $this->getStatusToProduct($productStatuses['productStatus']['destinationStatuses']) : null;
                    $issues = isset($productStatuses['productStatus']['itemLevelIssues']) ? $this->getItemLevelIssues($productStatuses['productStatus']['itemLevelIssues']) : [];
                    if ($status) {
                        $product->update(['status' => $status, 'merchantErrors' => json_encode($issues)]);
                    }
                }
            });
        endif;
    }

    public function getAccountStatusesFromMerchant($googleUser = null, $token = null)
    {
        if (!$this->googleUser) :
            $this->googleUser = $googleUser ? $googleUser : auth()->user();
        endif;
        if (!$this->token) :
            $this->token = $token ? $token : $this->googleUser->settings->googleAccessToken;
        endif;
        $accountIssues = [];
        $singleBatch = [
            "batchId" => 0,
            "accountId" => $this->googleUser->settings->merchantAccountId,
            "merchantId" => $this->googleUser->settings->merchantAccountId,
            "method" => "get"
        ];
        $response = $this->ContentApiRequest('getAccountStatuses', null, ['entries' => $singleBatch], 'POST');
        if (isset($response['entries'])) :
            foreach ($response['entries'] as $entry) :
                if (isset($entry['accountStatus'])) :
                    if (isset($entry['accountStatus']['accountLevelIssues'])) :
                        foreach ($entry['accountStatus']['accountLevelIssues'] as $key => $issue) :
                            $accountIssues[$key] = $issue['title'];
                        endforeach;
                    endif;
                endif;
            endforeach;
        endif;
        $accountIssues = array_values(array_unique($accountIssues));
        return $accountIssues;
    }

    public function getItemLevelIssues($issues)
    {
        $descriptions = array_column($issues, 'description');
        return array_values(array_unique($descriptions));
    }


    public function convertProductIdToGoogleFormat($product, $variant, $full = true)
    {
        if ($this->googleUser->settings->productIdFormat == "global") :
            $formattedId =  "Shopify_" . $this->googleUser->settings->country . "_" . $product->productId . "_" . $variant->variantId;
        elseif ($this->googleUser->settings->productIdFormat == "sku") :
            $formattedId = $variant->sku;
        else :
            $formattedId = $variant->id;
        endif;
        return $full ? "online:" . $this->googleUser->settings->language . ":" . $this->googleUser->settings->country . ":" . $formattedId : $formattedId;
    }

    public function getStatusToProduct($entry)
    {
        foreach ($entry as $status) {
            if ($status['destination'] == "Shopping" || $status['destination'] == 'SurfacesAcrossGoogle') {
                $status = $status['status'];
                switch ($status) {
                    case 'approved':
                        return "Approved";
                    case 'disapproved':
                        return "Disapproved";
                    case 'pending':
                        return "Pending";
                }
            }
        }
        return null; // or a default value if necessary
    }


    public function getVariantStatuses($product, $variants, $googleUser = null, $token = null)
    {
        if (!$this->googleUser) :
            $this->googleUser = $googleUser ? $googleUser : auth()->user();
        endif;
        if (!$this->token) :
            $this->token = $token ? $token : $this->googleUser->settings->googleAccessToken;
        endif;
        $data['entries'] = [];
        foreach ($variants as $key => &$variant) :
            $data['entries'][] = [
                "batchId" => $key,
                "merchantId" => $this->googleUser->settings->merchantAccountId,
                "method" => "get",
                "productId" => $this->convertVariantToGoogleFormat($variant, $product['id']),
                "includeAttributes" => false
            ];
            if ($variant['image_id'] != null) :
                foreach ($product['images'] as $value) :
                    if ($value['id'] == $variant['image_id']) :
                        $variant['image'] = $value['src'];
                        $variants[$key] = $variant;
                        break;
                    endif;
                endforeach;
            else :
                $variant['image'] = $product['image']['src'] ?? '';
                $variants[$key] = $variant;
            endif;
        endforeach;
        $response = $this->ContentApiRequest('getStatuses', null, $data, 'POST');
        if (isset($response['entries'])) :
            foreach ($response['entries'] as  $entry) :
                foreach ($variants as $key2 => &$variant) :
                    if (isset($entry['productStatus'])) :
                        if ($this->convertVariantToGoogleFormat($variant, $product['id']) == $entry['productStatus']['productId']) :
                            $destinations = [];
                            foreach ($entry['productStatus']['destinationStatuses'] as $destination) :
                                $destinations[] = [
                                    'destination' => $destination['destination'],
                                    'status' => $destination['status']
                                ];
                            endforeach;
                            $variant['googleStatus'] = $destinations;
                            $errors = [];
                            if (isset($entry['productStatus']['itemLevelIssues'])) :
                                foreach ($entry['productStatus']['itemLevelIssues'] as $issue) :
                                    if (isset($issue['code'])) :
                                        $errors[] = $issue['code'];
                                    endif;
                                    if (isset($issue['detail'])) :
                                        $errors[] = $issue['detail'];
                                    endif;
                                endforeach;
                            endif;
                            $variant['errors'] = $errors;
                            $variants[$key2] = $variant;
                            break;
                        endif;
                    endif;
                endforeach;
            endforeach;
        endif;
        return $variants;
    }

    public function convertVariantToGoogleFormat($variant, $productId, $full = true, $object = false, $googleUser = null, $token = null)
    {
        if (!$this->googleUser) :
            $this->googleUser = $googleUser ? $googleUser : auth()->user();
        endif;
        if (!$this->token) :
            $this->token = $token ? $token : $this->googleUser->settings->googleAccessToken;
        endif;
        if ($object) :
            if ($this->googleUser->settings->productIdFormat == "global") :
                $formattedId =  "Shopify_" . $this->googleUser->settings->country . "_" . $productId . "_" . $variant->variantId;
            elseif ($this->googleUser->settings->productIdFormat == "sku") :
                $formattedId = $variant->sku;
            else :
                $formattedId = $variant->variantId;
            endif;
        else :
            if ($this->googleUser->settings->productIdFormat == "global") :
                $formattedId =  "Shopify_" . $this->googleUser->settings->country . "_" . $productId . "_" . $variant['id'];
            elseif ($this->googleUser->settings->productIdFormat == "sku") :
                $formattedId = $variant['sku'];
            else :
                $formattedId = $variant['id'];
            endif;
        endif;
        if ($full) :
            return "online:" . $this->googleUser->settings->language . ":" . $this->googleUser->settings->country . ":" . $formattedId;
        endif;
        return $formattedId;
    }

    public function updateProducts($products, $googleUser = null, $token = null)
    {
        if (!$this->googleUser) :
            $this->googleUser = $googleUser ? $googleUser : auth()->user();
        endif;
        if (!$this->token) :
            $this->token = $token ? $token : $this->googleUser->settings->googleAccessToken;
        endif;
        foreach ($products as $product) :
            if ($this->user->settings->whichProducts != "all") :
                $product['variants'] = $this->shopifyApiRequest("getVariants", $product['id'], ["limit" => 100], ['body', 'variants'], $this->googleUser);
            endif;
            $values = [
                // 'channel' => "online",
                // "targetCountry" => $this->user->settings->country,
                // "contentLanguage" => $this->user->settings->language,
                "googleProductCategory" => $this->user->settings->product_category_id,
                // "brand" => $this->user->settings->domain
            ];
            if ($this->user->settings->gender != "blank") :
                $this->values['gender'] = $this->user->settings->gender;
            endif;
            if ($this->user->settings->productCondition != "blank") :
                $this->values['condition'] = $this->user->settings->productCondition;
            endif;
            if ($this->user->settings->ageGroup != "blank") :
                $this->values['ageGroup'] = $this->user->settings->ageGroup;
            endif;
            $this->uploadProductToMerchantAccount($this->values, $this->user);
        endforeach;
    }

    public function convertIdToGoogleFormate($productIdFormate, $variant, $country, $language, $channel)
    {
        $formattedId = '';
        if ($productIdFormate == 'global') :
            $formattedId = 'Shopify_' . $country . '_' . $variant['productId'] . '_' . $variant['variantId'];
        elseif ($productIdFormate == 'sku') :
            $formattedId = $variant['sku'];
        else :
            $formattedId = $variant['variantId'];
        endif;
        return $channel . ":" . $language . ":" . $country . ":" . $formattedId;
    }

    // public function getGoogleProduct($variant,$productId,$googleUser =null, $token=null){
    //     if(!$this->googleUser):
    //         $this->googleUser = $googleUser ? $googleUser : auth()->user();
    //     endif;
    //     if(!$this->token):
    //         $this->token = $token ? $token : $this->googleUser->settings->googleAccessToken;
    //     endif;
    //     return $this->ContentApiRequest('getProduct',[$this->googleUser->settings->merchantAccountId,$this->convertVariantToGoogleFormat($variant,$productId,true,true)],null,'get');
    // }

    // public function deleteProductFromFeed($productId,$googleUser =null, $token=null)
    // {
    //     if(!$this->googleUser):
    //         $this->googleUser = $googleUser ? $googleUser : auth()->user();
    //     endif;
    //     if(!$this->token):
    //         $this->token = $token ? $token : $this->googleUser->settings->googleAccessToken;
    //     endif;
    //     return $this->ContentApiRequest('deleteProduct',[$this->googleUser->settings->merchantAccountId,$productId],null,'delete');
    // }

    public function scoreProduct($dbData, $validated = null, $dataFeed = null)
    {
        // for Score Work start
        $scoreCount = 0;
        if (isset($validated['title'])) :
            if (Str::length($validated['title']) < 30) {
                $scoreCount = $scoreCount + 5;
            } elseif (Str::length($validated['title']) >= 30 && Str::length($validated['title']) < 50) {
                $scoreCount = $scoreCount + 10;
            } elseif (Str::length($validated['title']) >= 50 && Str::length($validated['title']) < 70) {
                $scoreCount = $scoreCount + 15;
            } else {
                $scoreCount = $scoreCount + 20;
            }
        else :
            if (Str::length($dbData->title) < 30) {
                $scoreCount = $scoreCount + 5;
            } elseif (Str::length($dbData->title) >= 30 && Str::length($dbData->title) < 50) {
                $scoreCount = $scoreCount + 10;
            } elseif (Str::length($dbData->title) >= 50 && Str::length($dbData->title) < 70) {
                $scoreCount = $scoreCount + 15;
            } else {
                $scoreCount = $scoreCount + 20;
            }
        endif;
        if (isset($validated['description'])) :
            if (Str::length($validated['description']) < 300) {
                $scoreCount = $scoreCount + 5;
            } elseif (Str::length($validated['description']) >= 300 && Str::length($validated['description']) < 500) {
                $scoreCount = $scoreCount + 10;
            } elseif (Str::length($validated['description']) >= 500 && Str::length($validated['description']) < 750) {
                $scoreCount = $scoreCount + 15;
            } else {
                $scoreCount = $scoreCount + 20;
            }
        elseif (isset($validated['body_html'])) :
            if (Str::length($validated['body_html']) < 300) {
                $scoreCount = $scoreCount + 5;
            } elseif (Str::length($validated['body_html']) >= 300 && Str::length($validated['body_html']) < 500) {
                $scoreCount = $scoreCount + 10;
            } elseif (Str::length($validated['body_html']) >= 500 && Str::length($validated['body_html']) < 750) {
                $scoreCount = $scoreCount + 15;
            } else {
                $scoreCount = $scoreCount + 20;
            }
        else :
            if (Str::length($dbData->description) < 300) {
                $scoreCount = $scoreCount + 5;
            } elseif (Str::length($dbData->description) >= 300 && Str::length($dbData->description) < 500) {
                $scoreCount = $scoreCount + 10;
            } elseif (Str::length($dbData->description) >= 500 && Str::length($dbData->description) < 750) {
                $scoreCount = $scoreCount + 15;
            } else {
                $scoreCount = $scoreCount + 20;
            }
        endif;
        if (isset($dbData->productTypes)) :
            $scoreCount = $scoreCount + 10;
        elseif (isset($validated['productTypes']) || isset($validated['product_type'])) :
            $scoreCount = $scoreCount + 10;
        endif;
        if (isset($validated['brand']) || isset($validated['vendor'])) :
            $scoreCount = $scoreCount + 10;
        elseif (isset($dbData->brand)) :
            $scoreCount = $scoreCount + 10;
        endif;
        if (isset($validated['product_category_id']) || isset($dataFeed->product_category_id)) :
            $scoreCount = $scoreCount + 10;
        elseif (isset($dbData->product_category_id)) :
            $scoreCount = $scoreCount + 10;
        endif;
        if (isset($dbData->barcode) || isset($dbData['barcode'])) :
            $scoreCount = $scoreCount + 10;
        endif;
        if (isset($dbData->image) || isset($validated['image'])) :
            $scoreCount = $scoreCount + 10;
        endif;
        if (isset($validated['promotionIds'])) :
            $scoreCount = $scoreCount + 10;
        endif;
        return $scoreCount;
        // End Score Work
    }

    public function calculateProductScore($product, $variant, $feed)
    {
        $score = 0;
        if (isset($product['title']) && $product['title'] != null) :
            if (Str::length($product['title']) < 50) {
                $score = $score + 5;
            } elseif (Str::length($product['title']) >= 50 && Str::length($product['title']) < 70) {
                $score = $score + 10;
            } elseif (Str::length($product['title']) >= 70 && Str::length($product['title']) <= 100) {
                $score = $score + 15;
            } else {
                $score = $score + 20;
            }
        endif;
        if (isset($product['description'])) :
            if (Str::length($product['description']) < 300) {
                $score = $score + 5;
            } elseif (Str::length($product['description']) >= 300 && Str::length($product['description']) < 500) {
                $score = $score + 10;
            } elseif (Str::length($product['description']) >= 500 && Str::length($product['description']) < 2000) {
                $score = $score + 15;
            } else {
                $score = $score + 20;
            }
        elseif (isset($product['descriptionHtml'])) :
            if (Str::length($product['descriptionHtml']) < 300) {
                $score = $score + 5;
            } elseif (Str::length($product['descriptionHtml']) >= 300 && Str::length($product['descriptionHtml']) < 500) {
                $score = $score + 10;
            } elseif (Str::length($product['descriptionHtml']) >= 500 && Str::length($product['descriptionHtml']) < 2000) {
                $score = $score + 15;
            } else {
                $score = $score + 20;
            }
        elseif (isset($product['body_html'])) :
            if (Str::length($product['body_html']) < 300) {
                $score = $score + 5;
            } elseif (Str::length($product['body_html']) >= 300 && Str::length($product['body_html']) < 500) {
                $score = $score + 10;
            } elseif (Str::length($product['body_html']) >= 500 && Str::length($product['body_html']) < 2000) {
                $score = $score + 15;
            } else {
                $score = $score + 20;
            }
        endif;
        if ((isset($product['productType']) && $product['productType'] != null) || (isset($product['product_type']) && $product['product_type'] != null)) :
            $score = $score + 10;
        endif;
        if (isset($feed->product_category_id)) :
            $score = $score + 10;
        endif;
        if ($feed->brandSubmission == 'vendor' && isset($product['vendor']) && $product['vendor'] != null) :
            $score = $score + 10;
        elseif ($feed->brandSubmission == 'domain') :
            $score = $score + 10;
        endif;
        if (isset($variant['barcode']) && $variant['barcode'] != null) :
            $score = $score + 10;
        endif;
        if (isset($variant['image']['src']) || isset($variant['image']['url']) || isset($product['featuredImage']['url']) || isset($product['image']['src'])) :
            $score = $score + 10;
        endif;
        return $score;
    }

    public function calculatePlanLimitations($user = null)
    {
        if (!$this->googleUser) :
            $this->googleUser = $user ? $user : auth()->user();
        endif;
        $limits = [];
        if (config('shopify-app.billing_enabled')) :
            if ($this->googleUser->plan_id == null) :
                if ($this->googleUser->isFreemium()) :
                    $limits['skus'] = 50;
                    $limits['feeds'] = 1;
                elseif ($this->googleUser->isGrandfathered()) :
                    $limits['skus'] = "Unlimited";
                    $limits['feeds'] = "Unlimited";
                else :
                    $limits['skus'] = 50;
                    $limits['feeds'] = 1;
                endif;
            else :
                $calculatedLimits = config('appPlansLimits.planLimitations.' . $this->googleUser->plan_id);
                $limits['skus'] = $calculatedLimits[0];
                $limits['feeds'] = $calculatedLimits[1];
            endif;
        else :
            $limits['skus'] = "Unlimited";
            $limits['feeds'] = "Unlimited";
        endif;
        return $limits;
    }

    public function updateSingleProduct($toUpload, $productId, $merchantId, $shop = null)
    {
        if ($shop) :
            $this->googleUser = $shop;
        else :
            $this->googleUser = auth()->user();
        endif;
        if (!$this->token) :
            $this->token = $this->googleUser->settings->googleAccessToken;
        endif;
        $accounts = [
            $merchantId . '/products/' . $productId . '?key='
        ];
        $response = $this->ContentApiRequest('updateSingleProduct', $accounts, $toUpload, 'PATCH');
        return $response;
    }

    public function getPromotionDetails($promotions, $googleUser = null, $token = null)
    {
        $validated = [];
        $this->googleUser = $googleUser;
        $this->token = $token ? $token : $this->googleUser->settings->googleAccessToken;
        $merchantAccountId = $this->googleUser->settings->merchantAccountId;
        if (count($promotions) > 0) :
            $promotionIds = $promotions->map(function ($promotion) {
                $promotion->redemptionChannel = strtolower(implode(",", json_decode($promotion->redemptionChannel)));
                $promotionID = $promotion->redemptionChannel . ":" . $promotion->contentLanguage . ":" .
                    $promotion->targetCountry . ":" . $promotion->promotionId;
                return $promotionID;
            });
            foreach ($promotionIds as $key => $promoID) :
                $response = $this->ContentApiRequest('getPromotion', [$merchantAccountId, $promoID]);
                if (!$response) :
                    return false;
                endif;
                if (!isset($response["promotionStatus"])) :
                    Log::error(json_encode(['user' => $this->googleUser, 'contentApiResponse' => $response]));
                    continue;
                endif;
                $validated["promotionStatus"] = json_encode($response["promotionStatus"]);
                $test = Promotion::where(
                    [
                        'user_id' => $googleUser->id,
                        'promotionId' => $response["promotionId"],
                        'targetCountry' => $response["targetCountry"],
                        'contentLanguage' => $response["contentLanguage"],
                    ]
                )->update($validated);
            endforeach;
            return true;
        endif;
        return false;
    }
}
