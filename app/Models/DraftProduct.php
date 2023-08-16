<?php

namespace App\Models;

use App\Models\ShopProductVariant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DraftProduct extends Model
{
    // use HasFillableRelations;

    protected $fillable = ['shop_product_variant_id','originalProductId','draftProductId','imagesCount'];

    // protected $fillable_relations = ['productVariant'];

    public function productVariant(){
        return $this->belongsTo(ShopProductVariant::class,'shop_product_variant_id','id');
    }
}
