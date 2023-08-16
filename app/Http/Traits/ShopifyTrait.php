<?php
namespace App\Http\Traits;

use App\Models\ExcludedProduct;
use App\Models\ShopProduct;

use function PHPUnit\Framework\returnSelf;

trait ShopifyTrait {

    use ShopifyApiTrait;

    public function cancelCharge($shop = null)
    {
        $this->shop($shop);
        $this->shopifyApiRequest("cancelCharge",$this->shop->currentCharge->charge_id,null,null,null,'DELETE');
    }

    public function premiumChecks($shop = null)
    {
        $this->shop($shop);
        if($this->shop->plan_id == null):
            return false;
        endif;
        if($this->shop->isFreemium()):
            return false;
        endif;
        return true;
    }

    public function planCheck($shop)
    {
        $this->shop($shop);
        if(!$this->shop->isFreemium() && !$this->shop->isGrandfathered()):
            $productCount = ShopProduct::selectRaw('count(*) as count')->where('user_id', $this->shop->id)->first()->count;
            switch ($this->shop->plan->name):
                case config('shopifyApi.plans')[0]:
                    if($productCount >= 50000):
                        $this->user->settings->update([
                            'limit_notification' => 1
                        ]);
                        return true;
                    endif;
                    break;
                case config('shopifyApi.plans')[1]:
                    if($productCount >= 100000):
                        $this->user->settings->update([
                            'limit_notification' => 1
                        ]);
                        return true;
                    endif;
                    break;
                case config('shopifyApi.plans')[2]:
                    if($productCount >= 200000):
                        $this->user->settings->update([
                            'limit_notification' => 1
                        ]);
                        return true;
                    endif;
                    break;
            endswitch;
        endif;
    }

    public function getAllProducts($shop = null)
    {
        $this->shop($shop);
        $products =[];
        $requests =  $this->shopifyApiRequest("getProducts", null , ['limit' => 250]);
        $products = array_merge($products,json_decode(json_encode($requests['body']['products'])));
        while(isset($requests['link']['next'])){
            $requests =  $this->shopifyApiRequest("getProducts", null , ['limit' => 250, 'page_info' => $requests['link']['next']]);
            if(isset($requests['body']['products'])):
                $products = array_merge($products,json_decode(json_encode($requests['body']['products'])));
            else:
                return [];
            endif;
        }
        return $products;
    }

    public function getProductsByIds($productIds,$shop = null)
    {
        $this->shop($shop);
        $products =[];
        $requests =  $this->shopifyApiRequest("getProducts", null , ['limit' => 250,'ids' => $productIds,'fields' => 'id,variants']);
        $products = array_merge($products,json_decode(json_encode($requests['body']['products'])));
        while(isset($requests['link']['next'])){
            $requests =  $this->shopifyApiRequest("getProducts", null , ['limit' => 250, 'ids' => $productIds,'fields' => 'id,variants', 'page_info' => $requests['link']['next']]);
            if(isset($requests['body']['products'])):
                $products = array_merge($products,json_decode(json_encode($requests['body']['products'])));
            else:
                return [];
            endif;
        }
        return $products;
    }
    
    public function includeSnippet($meta)
    {
        $html =  $this->shopifyApiRequest("getSingleAsset",auth()->user()->settings->themeId,["asset[key]" => config('shopifyApi.strings.theme_liquid_file')],['body','asset','value']);
        if($html):
            if(strpos($html, config('shopifyApi.strings.app_start_identifier')) === false):
                $pos = strpos($html,config('shopifyApi.strings.app_include_before_tag'));
                $newhtml = substr($html,0,$pos).config('shopifyApi.strings.app_include')[0].$meta.config('shopifyApi.strings.app_include')[1].substr($html,$pos);
                $toupdate = [
                    "asset" => [
                        "key" => config('shopifyApi.strings.theme_liquid_file'),
                        "value" => $newhtml
                    ]
                ];
                if($this->shopifyApiRequest("saveSingleAsset",auth()->user()->settings->themeId,$toupdate,['status'],null,'PUT')):
                    return true;
                endif;
            else:
                $openpos = strpos($html,config('shopifyApi.strings.app_start_identifier'));
                $closepos = strpos($html,config('shopifyApi.strings.app_end_identifier'));
                $newhtml = substr($html,0,$openpos).config('shopifyApi.strings.app_include')[0].$meta.config('shopifyApi.strings.app_include')[1].substr($html,$closepos);
                $toupdate = [
                    "asset" => [
                        "key" => config('shopifyApi.strings.theme_liquid_file'),
                        "value" => $newhtml
                    ]
                ];
                if($this->shopifyApiRequest("saveSingleAsset",auth()->user()->settings->themeId,$toupdate,['status'],null,'PUT')):
                    return true;
                endif;
            endif;
        endif;
        return false;
	}
	
    public function shopApi($required_fields = null, $shop=null)
    {
        $this->shop($shop);
        return $this->shopifyApiRequest("shop", null, null ,$required_fields);
    }

    public function getMainThemeId($shop = null)
    {
        $this->shop($shop);
        $requests =  $this->shopifyApiRequest("getAllThemes",null , null , ['body','themes']);
        $themeid = null;
        foreach($requests as $theme){
                if($theme['role'] == "main"){
                    $themeid = $theme['id'];
                    break;
                }
        }
        return $themeid;
    }

    public function createStoreFrontAccessToken($shop = null)
    {
        $this->shop($shop);
        $tokenExist = $this->getStoreFrontAccessToken();
        if(isset($tokenExist['token'])):
            return $tokenExist['token'];
        else:
            $storeFrontData = [
                "storefront_access_token" => [
                "title" => "EasyFeedForGoogleShopping"
                ]
            ];
            $requests =  $this->shopifyApiRequest("storeFrontAccessToken",null , $storeFrontData , ['body','storefront_access_token','access_token'], null, 'POST');
            return $requests;
        endif;
    }

    public function getStoreFrontAccessToken()
    {
        $this->shop();
        $token = [];
        $requests =  $this->shopifyApiRequest("storeFrontAccessToken",null , null , ['body','storefront_access_tokens']);
        foreach($requests as $tokens):
            if($tokens['title'] == 'EasyFeedForGoogleShopping'):
                $token['token'] = $tokens['access_token'];
                break;
            endif;
        endforeach;
        return $token;
    }

    public function addTokenToTheme($meta,$shop = null)
    {
        $this->shop($shop);
        if($this->includeSnippet($meta)):
            return true;
        else:
            return false;
        endif;

    }

    public function getCustomCollectionIds()
    {
        $this->shop();
        $collectionIds = [];
        $requests =  $this->shopifyApiRequest("getCustomCollection", null , ['limit' => 250]);
        foreach ($requests['body']['custom_collections'] as $value) {
            $collectionIds[] = [
                "id" => $value['id'],
                "title" => $value['title']
            ];
        }
        while(isset($requests['link']['next'])){
            $requests =  $this->shopifyApiRequest("getCustomCollection", null , ['limit' => 250, 'page_info' => $requests['link']['next']]);
            foreach ($requests['body']['custom_collections'] as $value) {
                $collectionIds[] = [
                    "id" => $value['id'],
                    "title" => $value['title']
                ];
            }
        }
        return $collectionIds;
    }

    public function getAutomaticCollectionIds()
    {
        $this->shop();
        $collectionIds = [];
        $requests =  $this->shopifyApiRequest("getAutomaticCollection", null , ['limit' => 250]);
        foreach ($requests['body']['smart_collections'] as $value) {
            $collectionIds[] = [
                "id" => $value['id'],
                "title" => $value['title']
            ];
        }
        while(isset($requests['link']['next'])){
            $requests =  $this->shopifyApiRequest("getAutomaticCollection", null , ['limit' => 250, 'page_info' => $requests['link']['next']]);
                foreach ($requests['body']['smart_collections'] as $value) {
                    $collectionIds[] = [
                        "id" => $value['id'],
                        "title" => $value['title']
                    ];
                }
        }
        return $collectionIds;
    }

    public function checkSingleAutoCollection($collectionId)
    {
        $this->shop();
        return $this->shopifyApiRequest("getSingleAutomaticCollection", $collectionId)['status'] == 200 ? true : false;
    }

    public function checkSingleCustomCollection($collectionId)
    {
        $this->shop();
        return $this->shopifyApiRequest("getSingleCustomCollection", $collectionId)['status'] == 200 ? true : false;
    }

    public function checkProductForGraphOrRest($product)
    {
        return isset($product['variants']) ? "Rest" : "Graph";
    }

    public function getVariantsByProductId($id)
    {
        $this->shop();
        $requests =  $this->shopifyApiGraphQuery("getVarientByProductId", [$id] , null ,['body','data','product','variants','edges']);
        return $requests;
    }

    public function getProductById($id)
    {
        $this->shop();
        $requests =  $this->shopifyApiRequest("getProductById", $id ,null ,['body','product']);
        return $requests;
    }

    public function getProductCollectionIds($productId,$shop){
        $this->shop($shop);
        $requests =  $this->shopifyApiRequest("getProductCollectionIds",null ,['product_id' => $productId] ,['body','collects']);
        return $requests;
    }

    // public function addGoogleTagsToShopifyProduct($productId,$tags)
    // {
    //     $this->shop();
    //     return $this->shopifyApiGraphQuery("insertGoogleStatusTags",null,[
    //         "id" => config('shopifyApi.strings.graphQlProductIdentifier').$productId,
    //         "tags" => $tags
    //     ]);
    // }

    // public function removeGoogleTagsFromShopifyProduct($productId)
    // {
    //     $this->shop();
    //     return $this->shopifyApiGraphQuery("removeGoogleStatusTags",null,[
    //         "id" => config('shopifyApi.strings.graphQlProductIdentifier').$productId,
    //         "tags" => [
    //             config('shopifyApi.strings.googleStatusApproved'),
    //             config('shopifyApi.strings.googleStatusDisapproved'),
    //             config('shopifyApi.strings.googleStatusPending')
    //         ]
    //     ]);
    // }

    public function getExcludedCollectionProductsRest($feed)
    {
        $excludedCollections = json_decode($feed->excludedCollections);
        foreach($excludedCollections as $collection):
            $requests =  $this->shopifyApiRequest("getCollectionProducts", $collection->id);
            foreach($requests['body']['products'] as $product):
                $data = [
                    "feed_setting_id" => $feed->id,
                    'productId' => $product['id'],
                    'title' => $product['title'],
                    'image' => $product['image']['src'] ?? '',
                    'collectionId' => $collection->id
                ];
                ExcludedProduct::create($data);
            endforeach;
            while(isset($requests['link']['next'])):
                $requests =  $this->shopifyApiRequest("getCollectionProducts", $collection->id ,['page_info' => $requests['link']['next']],null);
                foreach($requests['body']['products'] as $product):
                    $data = [
                        "feed_setting_id" => $feed->id,
                        'productId' => $product['id'],
                        'title' => $product['title'],
                        'image' => $product['image']['src'] ?? '',
                        'collectionId' => $collection->id
                    ];
                    ExcludedProduct::create($data);
                endforeach;
            endwhile;
        endforeach;
        return $feed;
    }

    public function getExcludedCollectionProductsStoreFront($feed)
    {
        $excludedCollections = json_decode($feed->excludedCollections);
        foreach($excludedCollections as $collection):
            $arr[0] = $feed->country;
            $arr[1] = strtoupper($feed->language);
            $arr[2] = $collection->id;
            $requests =  $this->shopifyApiStoreFront("collectionProducts", $arr, ['data','collection','products']);
            foreach($requests['nodes'] as $product):
                $data = [
                    "feed_setting_id" => $feed->id,
                    'productId' => str_replace('gid://shopify/Product/', '', $product['id']),
                    'title' => $product['title'],
                    'image' => $product['featuredImage']['url'] ?? '',
                    'collectionId' => $collection->id
                ];
                ExcludedProduct::create($data);
            endforeach;
            while($requests['pageInfo']['hasNextPage'] == true):
                $arr[3] = "after:";
                $arr[4] = '"'.$requests['pageInfo']['endCursor'].'"';
                $requests =  $this->shopifyApiStoreFront("collectionProducts", $arr, ['data','collection','products']);
                foreach($requests['nodes'] as $product):
                    $data = [
                        "feed_setting_id" => $feed->id,
                        'productId' => str_replace('gid://shopify/Product/', '', $product['id']),
                        'title' => $product['title'],
                        'image' => $product['featuredImage']['url'] ?? '',
                        'collectionId' => $collection->id
                    ];
                    ExcludedProduct::create($data);
                endforeach;
            endwhile;
        endforeach;
        return true;
    }


}