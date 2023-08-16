<?php

namespace App\Http\Traits;

use Illuminate\Support\Facades\Http;


trait ShopifyApiTrait
{

	private $shop;

	public function shopifyApiRequest($api = "", $api_get_fields = null, $api_post_fields = null, $api_required_fields = null, $shop = null, $method = "GET")
	{
		$this->shop($shop);
		$response =  $this->shop->api()->rest($method, $this->makeUrl($api, $api_get_fields), $api_post_fields);
		if ($response['errors'] === true) :
			return $response['errors'];
		endif;
		if ($api_required_fields) :
			return $this->getRequiredFields($api_required_fields, $response);
		endif;
		return $response;
	}
	public function shopifyApiGraphQuery($api = "", $api_get_fields = null, $api_post_fields = null, $api_required_fields = null, $shop = null)
	{
		$this->shop($shop);
		if ($api_post_fields) :
			$response =  $this->shop->api()->graph($this->makeGraphUrl($api, $api_get_fields), $api_post_fields);
		else :
			$response =  $this->shop->api()->graph($this->makeGraphUrl($api, $api_get_fields));
		endif;
		if ($response['errors'] === true) :
			return $response['errors'];
		endif;
		if ($api_required_fields) :
			return $this->getRequiredFields($api_required_fields, $response);
		endif;
		return $response;
	}

	public function getRequiredFields($api_required_fields, $response)
	{
		foreach ($api_required_fields as $key => $value) {
			if (!isset($response[$value])) :
				return $response;
			endif;
			$response = $response[$value];
		}
		return $response;
	}

	public function makeUrl($api, $data = [])
	{
		$url = [];
		foreach (config("shopifyApi.apis.$api") as $value) {
			if ($data) :
				$url[] = $value;
				$url[] = $data;
				$data = null;
			else :
				$url[] = $value;
			endif;
		}
		return implode('', $url);
	}

	public function makeGraphUrl($api, $data = null)
	{
		$url = [];
		foreach (config("shopifyApi.graphQl.apis.$api") as $key => $aPart) {
			if ($data) :
				$url[] = $aPart;
				if (isset($data[$key])) :
					$url[] = $data[$key];
				endif;
			else :
				$url[] = $aPart;
			endif;
		}
		return implode('', $url);
	}

	public function makeStoreFrontUrl($api, $data = [])
	{
		$url = [];
		foreach (config("shopifyApi.storeFront.apis.$api") as $key => $aPart) {
			if ($data) :
				$url[] = $aPart;
				if (isset($data[$key])) :
					$url[] = $data[$key];
				endif;
			else :
				$url[] = $aPart;
			endif;
		}
		return implode('', $url);
	}

	public function shop($shop = null)
	{
		if (!$this->shop) :
			$this->shop = ($shop ?  $shop : auth()->user());
		endif;
	}

	public function shopifyApiStoreFront($api = "", $api_get_fields = null, $api_required_fields = null, $shop = null)
	{
		$this->shop($shop);
		$count = 1;
		$response = Http::withHeaders(['X-Shopify-Storefront-Access-Token' => $this->shop->settings->storeFrontAccessToken])->post('https://' . $this->shop->settings->domain . '/api/2022-10/graphql.json', ["query"=>$this->makeStoreFrontUrl($api, $api_get_fields)]);
		while (!isset($response['data'])) :
			info("Inside While Loop");
			sleep(5);
			$response = Http::withHeaders(['X-Shopify-Storefront-Access-Token' => $this->shop->settings->storeFrontAccessToken])->post('https://' . $this->shop->settings->domain . '/api/2022-07/graphql.json', ["query"=>$this->makeStoreFrontUrl($api, $api_get_fields)]);
			if($count == 10):
				break;
			endif;
			$count++;
		endwhile;
		if ($api_required_fields) :
			return $this->getRequiredFields($api_required_fields, $response);
		endif;
		return $response;
	}

	public function getLocaleWebPresence($language)
	{
		$languageWebPresence = '';
		$locales = $this->shopifyApiGraphQuery('getLocaleWebPresence',null, null, ['body','data','shopLocales']);
		foreach($locales as $locale):
            if($locale['locale'] == $language):
                foreach($locale['marketWebPresences'] as $webPresence):
					if($webPresence['domain']):
						$languageWebPresence = $webPresence['domain']['url'];
						break;
					else:
						foreach($webPresence['rootUrls'] as $rootUrl):
							if($rootUrl['locale'] == $language):
								$languageWebPresence = $rootUrl['url'];
								break;
							endif;
						endforeach;
					endif;
				endforeach;
            endif;
        endforeach;
		return $languageWebPresence;
	}

	public function getProductMetafields()
	{
		$metafieldsArr = [];
		$count = 0;
		$response = $this->shopifyApiGraphQuery("getProductMetafields", null, null, ['body']);
		foreach($response['data']['metafieldDefinitions']['nodes'] as $meta):
			$metafieldsArr[$count]['label'] = $meta['name'];
			$metafieldsArr[$count]['value'] = $meta['namespace']."|".$meta['key'];
			$count++;
		endforeach;
		while($response['data']['metafieldDefinitions']['pageInfo']['hasNextPage'] == true)
        {
			$arr[] = "after:";
            $arr[] = '"'.$response['data']['metafieldDefinitions']['pageInfo']['endCursor'].'"';
            $response = $this->shopifyApiGraphQuery('getVariantMetafields', $arr, null, ['body']);
            foreach($response['data']['metafieldDefinitions']['nodes'] as $meta):
				$metafieldsArr[$count]['label'] = $meta['name'];
				$metafieldsArr[$count]['value'] = $meta['namespace']."|".$meta['key'];
				$count++;
			endforeach;
			if ($response['extensions']['cost']['throttleStatus']['currentlyAvailable'] > 550) :
				$sleepTime = 0;
			else :
				$sleepTime = 5;
			endif;
			sleep($sleepTime);
        }
		return $metafieldsArr;
	}

	public function getVariantMetafields()
	{
		$metafieldsArr = [];
		$count = 0;
		$response = $this->shopifyApiGraphQuery("getVariantMetafields", null, null, ['body']);
		foreach($response['data']['metafieldDefinitions']['nodes'] as $meta):
			$metafieldsArr[$count]['label'] = $meta['name'];
			$metafieldsArr[$count]['value'] = $meta['namespace']."|".$meta['key'];
			$count++;
		endforeach;
		while($response['data']['metafieldDefinitions']['pageInfo']['hasNextPage'] == true)
        {
			$arr[] = "after:";
            $arr[] = '"'.$response['data']['metafieldDefinitions']['pageInfo']['endCursor'].'"';
            $response = $this->shopifyApiGraphQuery('getVariantMetafields', $arr, null, ['body']);
            foreach($response['data']['metafieldDefinitions']['nodes'] as $meta):
				$metafieldsArr[$count]['label'] = $meta['name'];
				$metafieldsArr[$count]['value'] = $meta['namespace']."|".$meta['key'];
				$count++;
			endforeach;
			if ($response['extensions']['cost']['throttleStatus']['currentlyAvailable'] > 550) :
				$sleepTime = 0;
			else :
				$sleepTime = 5;
			endif;
			sleep($sleepTime);
        }
		return $metafieldsArr;
	}
	
}
