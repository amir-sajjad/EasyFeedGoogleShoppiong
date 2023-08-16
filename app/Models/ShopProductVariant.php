<?php

namespace App\Models;

use App\Models\ShopProduct;
use App\Models\DraftProduct;
use App\Models\ProductLabel;
use App\Models\EditedProduct;
use App\Models\ProductDetail;
use App\Models\ProductCategory;
use App\Models\ShopProductImage;
use App\Models\ProductHighlights;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use LaravelFillableRelations\Eloquent\Concerns\HasFillableRelations;

class ShopProductVariant extends Model
{
    use HasFillableRelations;

    protected $fillable = [
        'user_id',
        'feed_setting_id',
        'shop_product_id',
        'productId',
        'variantId',
        'itemId',
        'title',
        'description',
        'handle',
        'image',
        'product_category_id',
        'productTypes',
        'brand',
        'barcode',
        'sku',
        'quantity',
        'ageGroup',
        'gender',
        'productCondition',
        'status',
        'merchantErrors',
        'score',
        'salePrice',
        'comparePrice',
    ];

    protected $fillable_relations = ['product', 'productImage', 'editedProduct', 'productLabel', 'productHighlight', 'productDetails'];

    // protected $with = ['category','productLabel', 'editedProduct', 'productImage'];

    public function product()
    {
        return $this->belongsTo(ShopProduct::class, 'shop_product_id', 'id');
    }

    public function feedSetting()
    {
        return $this->belongsTo(FeedSetting::class, 'feed_setting_id', 'id');
    }

    public function productImage()
    {
        return $this->hasOne(ShopProductImage::class, 'shop_product_variant_id', 'id');
    }

    public function editedProduct()
    {
        return $this->hasOne(EditedProduct::class, 'shop_product_variant_id', 'id');
    }

    public function productLabel()
    {
        return $this->hasOne(ProductLabel::class, 'shop_product_variant_id', 'id');
    }

    public function productHighlight()
    {
        return $this->hasOne(ProductHighlights::class, 'shop_product_variant_id', 'id');
    }

    public function productDetails()
    {
        return $this->hasMany(ProductDetail::class, 'shop_product_variant_id', 'id');
    }

    public function draftProduct()
    {
        return $this->hasOne(DraftProduct::class, 'shop_product_variant_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id', 'id');
    }
}
