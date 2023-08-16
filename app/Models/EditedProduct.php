<?php

namespace App\Models;

use App\Models\User;
use App\Models\FeedSetting;
use App\Models\ShopProductVariant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use LaravelFillableRelations\Eloquent\Concerns\HasFillableRelations;

class EditedProduct extends Model
{
    use HasFillableRelations;

    protected $fillable = ['user_id', 'feed_setting_id', 'shop_product_variant_id', 'productId', 'variantId', 'color', 'sizes', 'material', 'pattern', 'sizeSystem', 'sizeType', 'unitPricingMeasure', 'unitPricingBaseMeasure', 'multipack', 'isBundle', 'promotionIds', 'salePriceEffectiveDate', 'adult', 'identifierExists', 'costOfGoodsSold', 'availabilityDate', 'availability', 'expirationDate', 'installment', 'loyaltyPoints', 'energyEfficiencyClass', 'minEnergyEfficiencyClass', 'maxEnergyEfficiencyClass', 'maxHandlingTime', 'minHandlingTime', 'shipping', 'shippingHeight', 'shippingWidth', 'shippingLength', 'shippingWeight', 'productHighlights', 'productDetails', 'productHeight', 'productLength', 'productWidth', 'productWeight', 'return_policy_label', 'transitTimeLabel', 'pause', 'subscriptionCost'];

    protected $fillable_relations = ['productVariant'];

    public function productVariant()
    {
        return $this->belongsTo(ShopProductVariant::class, 'shop_product_variant_id', 'id');
    }

    public function feedSetting()
    {
        return $this->belongsTo(FeedSetting::class, 'feed_setting_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
