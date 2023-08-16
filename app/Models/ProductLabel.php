<?php

namespace App\Models;

use App\Models\ShopProductVariant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use LaravelFillableRelations\Eloquent\Concerns\HasFillableRelations;

class ProductLabel extends Model
{
    use HasFillableRelations;

    protected $fillable = ['shop_product_variant_id','feed_setting_id','variantId','customLabel0','customLabel1','customLabel2','customLabel3','customLabel4','adsLabels','adsGrouping','shippingLabel','taxCategory'];

    protected $fillable_relations = ['productVariant'];

    public function productVariant(){
        return $this->belongsTo(ShopProductVariant::class,'shop_product_variant_id','id');
    }
}
