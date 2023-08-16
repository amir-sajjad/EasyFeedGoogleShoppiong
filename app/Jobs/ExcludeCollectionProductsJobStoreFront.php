<?php

namespace App\Jobs;

use App\Models\FeedSetting;
use Illuminate\Bus\Queueable;
use App\Models\ExcludedProduct;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Traits\ShopifyApiTrait;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class ExcludeCollectionProductsJobStoreFront implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, ShopifyApiTrait;
    protected $user;
    protected $feed;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($user, $feed)
    {
        $this->user = $user;
        $this->feed = $feed;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        DB::transaction(function () {
            try {
                $excludedCollections = json_decode($this->feed->excludedCollections);
                foreach ($excludedCollections as $collection) :
                    $arr[0] = $this->feed->country;
                    $arr[1] = strtoupper($this->feed->language);
                    $arr[2] = $collection->id;
                    $requests =  $this->shopifyApiStoreFront("collectionProducts", $arr, ['data', 'collection', 'products'], $this->user);
                    foreach ($requests['nodes'] as $product) :
                        foreach ($product['variants']['nodes'] as $var => $variant) :
                            $titlearr = [];
                            foreach ($variant['selectedOptions'] as $option) :
                                if ($option['value'] != "Default Title") :
                                    $titlearr[] = $option['value'];
                                endif;
                            endforeach;
                            $varTitle = $product['title'] . ((count($titlearr) > 0) ? "/" . implode('/', $titlearr) : '');
                            $data = [
                                'user_id' => $this->user->id,
                                "feed_setting_id" => $this->feed->id,
                                'productId' => str_replace('gid://shopify/Product/', '', $product['id']),
                                'variantId' => str_replace('gid://shopify/ProductVariant/', '', $variant['id']),
                                'title' => $varTitle,
                                'image' => isset($variant['image']['url']) ? $variant['image']['url'] : (isset($product['featuredImage']['url']) ? $product['featuredImage']['url'] : null),
                                'collectionId' => $collection->id,
                                'status' => "CollectionBasedExclusion"
                            ];
                            ExcludedProduct::create($data);
                        endforeach;
                    endforeach;
                    while ($requests['pageInfo']['hasNextPage'] == true) :
                        $arr[3] = "after:";
                        $arr[4] = '"' . $requests['pageInfo']['endCursor'] . '"';
                        $requests =  $this->shopifyApiStoreFront("collectionProducts", $arr, ['data', 'collection', 'products'], $this->user);
                        foreach ($requests['nodes'] as $product) :
                            foreach ($product['variants']['nodes'] as $var => $variant) :
                                $titlearr = [];
                                foreach ($variant['selectedOptions'] as $option) :
                                    if ($option['value'] != "Default Title") :
                                        $titlearr[] = $option['value'];
                                    endif;
                                endforeach;
                                $varTitle = $product['title'] . ((count($titlearr) > 0) ? "/" . implode('/', $titlearr) : '');
                                $data = [
                                    'user_id' => $this->user->id,
                                    "feed_setting_id" => $this->feed->id,
                                    'productId' => str_replace('gid://shopify/Product/', '', $product['id']),
                                    'variantId' => str_replace('gid://shopify/ProductVariant/', '', $variant['id']),
                                    'title' => $varTitle,
                                    'image' => isset($variant['image']['url']) ? $variant['image']['url'] : (isset($product['featuredImage']['url']) ? $product['featuredImage']['url'] : null),
                                    'collectionId' => $collection->id,
                                    'status' => "CollectionBasedExclusion"
                                ];
                                ExcludedProduct::create($data);
                            endforeach;
                        endforeach;
                    endwhile;
                endforeach;
            } catch (\Exception $e) {
                Db::rollBack();
                $this->feed->delete();
                Log::error($e);
            }
        });
    }
}
