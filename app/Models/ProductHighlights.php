<?php

namespace App\Models;

use App\Models\ShopProductVariant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use LaravelFillableRelations\Eloquent\Concerns\HasFillableRelations;

class ProductHighlights extends Model
{
    use HasFillableRelations;

    protected $fillable = ['shop_product_variant_id','variantId','highlight1','highlight2','highlight3','highlight4','highlight5','highlight6'];

    protected $fillable_relations = ['productVariant'];

    public function productVariant(){
        return $this->belongsTo(ShopProductVariant::class,'shop_product_variant_id','id');
    }
}
