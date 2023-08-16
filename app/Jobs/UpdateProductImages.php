<?php

namespace App\Jobs;

use App\Models\FeedSetting;
use Illuminate\Bus\Queueable;
use App\Models\ShopProductImage;
use App\Models\ShopProductVariant;
use App\Http\Traits\GoogleApiTrait;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class UpdateProductImages implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, GoogleApiTrait;
    public $timeout = 9000;
    public $tries = 1;
    protected $user;
    protected $images;
    protected $toUpload;
    protected $feedId;
    protected $pId;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($shop, $pId, $feed_id, $images)
    {
        $this->user = $shop;
        $this->images = $images;
        $this->feedId = $feed_id;
        $this->pId = $pId;
        $this->toUpload = [];
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        //null additional images in DB...
        ShopProductImage::where('shop_product_variant_id', $this->pId)->update(['additionalImage01' => null, 'additionalImage02' => null, 'additionalImage03' => null, 'additionalImage04' => null, 'additionalImage05' => null, 'additionalImage06' => null, 'additionalImage07' => null, 'additionalImage08' => null, 'additionalImage09' => null, 'additionalImage10' => null]);
        //....end
        //update images in DB according to image indexes....
        foreach ($this->images as $key => $img) :
            // update feature image if exist...
            if ($key == 0) {
                ShopProductVariant::where('id', $this->pId)->update(['image' => $img['image']]);
                // .... end
                //update additional images....
            } elseif ($key == 10) {
                ShopProductImage::updateOrCreate([
                    'shop_product_variant_id' => $this->pId
                ], [
                    'additionalImage10' => $img['image'],
                ]);
            } else {
                ShopProductImage::updateOrCreate([
                    'shop_product_variant_id' => $this->pId
                ], [
                    'additionalImage0' . $key => $img['image'],
                ]);
            }
        // ...end
        endforeach;
        // ... end

        // For Feed Get additional images from DB
        $dbImages = ShopProductImage::select('additionalImage01', 'additionalImage02', 'additionalImage03', 'additionalImage04', 'additionalImage05', 'additionalImage06', 'additionalImage07', 'additionalImage08', 'additionalImage09', 'additionalImage10')->where('shop_product_variant_id',  $this->pId)->first();
        //.... end
        $this->imageFeed($dbImages);
    }

    public function imageFeed($dbImages)
    {
        // feed data for check additional images setting
        $datafeed = FeedSetting::where('id', $this->feedId)->first();
        // Get Merchant Id from DB
        $product = ShopProductVariant::where([
            'feed_setting_id' => $this->feedId,
            'id' => $this->pId
        ])->first();
        // $merchantId = ShopProductVariant::select('merchantProductId')->where([
        //     'feed_setting_id' => $this->feedId,
        //     'id' => $this->pId
        // ])->first();

        // for feature image....
        if (isset($this->images)) :
            $this->toUpload['imageLink'] = $this->images[0]['image'];
        endif;
        // ...end
        // for additional images...
        if ($datafeed->additionalImages) :
            if (sizeof($this->images) == 1) :
                $this->toUpload['additionalImageLinks'] = [$this->images[0]['image']];
            else :
                $this->toUpload['additionalImageLinks'] = [
                    $dbImages['additionalImage01'], $dbImages['additionalImage02'], $dbImages['additionalImage03'], $dbImages['additionalImage04'], $dbImages['additionalImage05'], $dbImages['additionalImage06'], $dbImages['additionalImage07'], $dbImages['additionalImage08'],
                    $dbImages['additionalImage09'], $dbImages['additionalImage10']
                ];
            endif;
        endif;
        // ... end
        // make product Id for update in merchant 
        $productId = $product['itemId'];
        // funtion call for update single product images
        $this->updateSingleProduct($this->toUpload, $productId, $this->user);
    }
}
