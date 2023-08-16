<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use LaravelFillableRelations\Eloquent\Concerns\HasFillableRelations;


class Promotion extends Model
{
    use HasFillableRelations;

    protected $fillable = [
        'user_id',
        'promotionId',
        'longTitle',
        'targetCountry',
        'contentLanguage',
        'selectedRegion',
        'couponValueType',
        'promotionTypeName',
        'couponValueCategory',
        'promotionDestinationIds',
        'offerType',
        'genericRedemptionCode',
        'promotionDisplayTimePeriod',
        'promotionEffectiveTimePeriod',
        'redemptionChannel',
        'minimumPurchaseAmount',
        'moneyOffAmount',
        'minimumPurchaseQuantity',
        'productApplicability',
        'getThisQuantityDiscounted',
        'percentOff',
        'freeGiftDescription',
        'freeGiftValue',
        'freeGiftItemId',
        'promotionStatus',

    ];
    use HasFactory;
}
