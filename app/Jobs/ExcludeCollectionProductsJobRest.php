<?php

namespace App\Jobs;

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

class ExcludeCollectionProductsJobRest implements ShouldQueue
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
                    $requests =  $this->shopifyApiRequest("getCollectionProducts", $collection->id, null, null, $this->user);
                    foreach ($requests['body']['products'] as $product) :
                        $product['variants'] = $this->shopifyApiRequest("getVariants", $product['id'], ["limit" => 100], ['body', 'variants'], $this->user);
                        foreach ($product['variants'] as $variant) :
                            $data = [];
                            $titlearr = [];
                            $src = false;
                            foreach ($product['images'] as $image) :
                                foreach ($image['variant_ids'] as $variantImageId) {
                                    if ($variantImageId == $variant['id']) :
                                        $src = $image['src'];
                                        break;
                                    endif;
                                }
                                if ($src) :
                                    break;
                                endif;
                            endforeach;
                            for ($i = 1; $i <= 3; $i++) :
                                if ($variant["option" . $i] != null) :
                                    if ($variant["option" . $i] != 'Default Title') :
                                        $titlearr[] = $variant["option" . $i];
                                    endif;
                                endif;
                            endfor;
                            $varTitle = $product['title'] . ((count($titlearr) > 0) ? "/" . implode('/', $titlearr) : '');
                            $data = [
                                'user_id' => $this->user->id,
                                "feed_setting_id" => $this->feed->id,
                                'productId' => $product['id'],
                                'variantId' => $variant['id'],
                                'title' => $varTitle,
                                'image' => $src ? $src : (isset($product['image']['src']) ? $product['image']['src'] : null),
                                'collectionId' => $collection->id,
                                'status' => "CollectionBasedExclusion"
                            ];
                            ExcludedProduct::create($data);
                        endforeach;
                    endforeach;
                    while (isset($requests['link']['next'])) :
                        $requests =  $this->shopifyApiRequest("getCollectionProducts", $collection->id, ['page_info' => $requests['link']['next']], null, $this->user);
                        foreach ($requests['body']['products'] as $product) :
                            $product['variants'] = $this->shopifyApiRequest("getVariants", $product['id'], ["limit" => 100], ['body', 'variants'], $this->user);
                            foreach ($product['variants'] as $variant) :
                                $data = [];
                                $titlearr = [];
                                $src = false;
                                foreach ($product['images'] as $image) :
                                    foreach ($image['variant_ids'] as $variantImageId) {
                                        if ($variantImageId == $variant['id']) :
                                            $src = $image['src'];
                                            break;
                                        endif;
                                    }
                                    if ($src) :
                                        break;
                                    endif;
                                endforeach;
                                for ($i = 1; $i <= 3; $i++) :
                                    if ($variant["option" . $i] != null) :
                                        if ($variant["option" . $i] != 'Default Title') :
                                            $titlearr[] = $variant["option" . $i];
                                        endif;
                                    endif;
                                endfor;
                                $varTitle = $product['title'] . ((count($titlearr) > 0) ? "/" . implode('/', $titlearr) : '');
                                $data = [
                                    'user_id' => $this->user->id,
                                    "feed_setting_id" => $this->feed->id,
                                    'productId' => $product['id'],
                                    'variantId' => $variant['id'],
                                    'title' => $varTitle,
                                    'image' => $src ? $src : (isset($product['image']['src']) ? $product['image']['src'] : null),
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
