<?php

namespace App\Models;

use App\Models\ShopProductVariant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use LaravelFillableRelations\Eloquent\Concerns\HasFillableRelations;

class ShopProductImage extends Model
{
    use HasFillableRelations;

    protected $fillable = ['shop_product_variant_id','productId','variantId','additionalImage01','additionalImage02','additionalImage03','additionalImage04','additionalImage05','additionalImage06','additionalImage07','additionalImage08','additionalImage09','additionalImage10'];

    protected $fillable_relations = ['productVariant'];

    public function productVariant(){
        return $this->belongsTo(ShopProductVariant::class,'shop_product_variant_id','id');
    }
}
