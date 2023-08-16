<?php

namespace App\Jobs;

use App\Models\FeedSetting;
use App\Models\ShopProduct;
use Illuminate\Support\Str;
use App\Models\ProductLabel;
use App\Models\EditedProduct;
use Illuminate\Bus\Queueable;
use App\Models\ShopProductVariant;
use App\Http\Traits\GoogleApiTrait;
use Illuminate\Support\Facades\Http;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Schema;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;


class UpdateProductDetailsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, GoogleApiTrait;
    public $timeout = 9000;
    public $tries = 1;
    protected $user;
    protected $validated;
    protected $values;
    protected $toUpload;
    protected $count;
    protected $feedId;
    protected $pId;

    public function __construct($shop, $validated, $feed_id, $pId)
    {
        $this->user = $shop;
        $this->validated = $validated;
        $this->feedId = $feed_id;
        $this->pId = $pId;
        $this->toUpload = [];
        $this->count = 0;
    }

    public function handle()
    {
        $datafeed = FeedSetting::where([
            ['user_id', '=', $this->user->id],
            ['id', '=', $this->feedId]
        ])->first();
        $product =  ShopProductVariant::where(
            ['feed_setting_id' => $this->feedId, 'id' => $this->pId],
        )->first();
        $score = $this->scoreProduct($product, $this->validated);
        $product->update(['score' => $score]);
        $toUpdate = [];
        foreach ($this->validated as $key => $field) :
            $this->values = [];
            if ($key == 'isBundle') :
                $field = $field == 'yes' ? true : false;
            endif;
            if ($key == 'identifierExists') :
                $field = $field == 'yes' ? true : false;
            endif;
            if (is_array($field) || is_object($field)) :
                $this->values[$key] = json_encode($field);
            else :
                $this->values[$key] = $field;
            endif;
            if ($key == 'subscriptionCostPeriod' && isset($this->validated['subscriptionCostAmount']) && isset($this->validated['subscriptionCostPeriodLength'])) :
                $this->values['subscriptionCost'] = json_encode(['period' => $this->validated['subscriptionCostPeriod'], 'periodLength' => $this->validated['subscriptionCostPeriodLength'], 'amount' => ['value' => $this->validated['subscriptionCostAmount'], 'currency' => $datafeed->currency]]);
            endif;
            if ($key == 'installmentMonths' && isset($this->validated['installmentAmount'])) :
                $this->values['installment'] = json_encode(['months' => $this->validated['installmentMonths'], 'amount' => ['value' => $this->validated['installmentAmount'], 'currency' => $datafeed->currency]]);
            endif;
            if ($key == "salePriceEffectiveDate" && isset($this->validated['salePriceEffectiveDate']['start']) && isset($this->validated['salePriceEffectiveDate']['end'])) :
                $this->values['salePriceEffectiveDate'] = $this->validated['salePriceEffectiveDate']['start'] . "/" . $this->validated['salePriceEffectiveDate']['end'];
            endif;
            if ($key == 'costOfGoodsSold') :
                $this->values['costOfGoodsSold'] = json_encode([
                    "value" => $this->validated['costOfGoodsSold'],
                    'currency' => $datafeed->currency
                ]);
            endif;
            if (Schema::hasColumn('shop_product_variants', $key)) :
                $product->update($this->values);
            elseif (Schema::hasColumn('edited_products', $key) || $key == 'subscriptionCostPeriod' || $key == 'installmentMonths') :
                $this->values['user_id'] = $this->user->id;
                $this->values['feed_setting_id'] = $product['feed_setting_id'];
                $this->values['productId'] = $product['productId'];
                $this->values['variantId'] = $product['variantId'];
                EditedProduct::updateOrCreate(['shop_product_variant_id' => $product['id']], $this->values);
            elseif (Schema::hasColumn('product_labels', $key)) :
                $this->values['variantId'] = $product['variantId'];
                $this->values['feed_setting_id'] = $product['feed_setting_id'];
                ProductLabel::updateOrCreate(['shop_product_variant_id' => $product['id']], $this->values);
            endif;
            if ($key != 'product_category_id' && $key != 'costOfGoodsSold' && $key != 'subscriptionCostPeriod' && $key != 'subscriptionCostAmount' && $key != 'subscriptionCostPeriodLength' && $key != 'installmentMonths' && $key != 'installmentAmount' && $key != 'isBundle' && $key != 'productCondition' && $key != 'identifierExists' && $key != 'return_policy_label') :
                $toUpdate[$key] = $field;
            endif;
        endforeach;
        // For feed..............
        if (isset($this->validated['product_category_id'])) :
            $toUpdate['googleProductCategory'] =  $product->category->value;
        endif;
        if (isset($this->validated['costOfGoodsSold'])) :
            $toUpdate['costOfGoodsSold'] = [
                "value" => $this->validated['costOfGoodsSold'],
                'currency' => $datafeed->currency
            ];
        endif;
        if (isset($this->validated['subscriptionCostPeriod']) && isset($this->validated['subscriptionCostAmount']) && isset($this->validated['subscriptionCostPeriodLength'])) :
            $toUpdate['subscriptionCost'] = ['period' => $this->validated['subscriptionCostPeriod'], 'periodLength' => $this->validated['subscriptionCostPeriodLength'], 'amount' => ['value' => $this->validated['subscriptionCostAmount'], 'currency' => $datafeed->currency]];
        endif;
        if (isset($this->validated['installmentMonths']) && isset($this->validated['installmentAmount'])) :
            $toUpdate['installment'] = ['months' => $this->validated['installmentMonths'], 'amount' => ['value' => $this->validated['installmentAmount'], 'currency' => $datafeed->currency]];
        endif;
        $toUpdate['isBundle'] = ($this->validated['isBundle'] == "yes") ? true : false;
        if (isset($this->validated['identifierExists'])) :
            $toUpdate['identifierExists'] = ($this->validated['identifierExists'] == "yes") ? true : false;
        endif;
        if (isset($this->validated['salePriceEffectiveDate']['start']) && isset($this->validated['salePriceEffectiveDate']['end'])) :
            $toUpdate['salePriceEffectiveDate'] =  $this->validated['salePriceEffectiveDate']['start'] . "/" . $this->validated['salePriceEffectiveDate']['end'];
        else :
            $toUpdate['salePriceEffectiveDate'] = "";
        endif;
        if (isset($this->validated['productCondition'])) :
            $toUpdate['condition'] = $this->validated['productCondition'];
        endif;
        $productId = $product['itemId'];
        $this->updateSingleProduct($toUpdate, $productId, $datafeed->merchantAccountId, $this->user);
    }
}
