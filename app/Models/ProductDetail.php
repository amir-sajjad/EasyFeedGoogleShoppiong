<?php

namespace App\Models;

use App\Models\ShopProductVariant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use LaravelFillableRelations\Eloquent\Concerns\HasFillableRelations;

class ProductDetail extends Model
{
    use HasFillableRelations;

    protected $fillable = ['shop_product_variant_id','variantId','sectionName','attributes'];

    protected $fillable_relations = ['productVariant'];

    public function productVariant(){
        return $this->belongsTo(ShopProductVariant::class,'shop_product_variant_id','id');
    }
}
