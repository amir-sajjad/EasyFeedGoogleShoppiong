<?php

namespace App\Models;

use App\Models\User;
use App\Models\ShopProduct;
use App\Models\EditedProduct;
use App\Models\ExcludedProduct;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rules\ExcludeIf;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;

class FeedSetting extends Model
{
    protected $fillable = [
        'user_id', 'merchantAccountId', 'merchantAccountName', 'market', 'name', 'country', 'language', 'currency', 'channel', 'shipping', 'productIdFormat', 'whichProducts', 'includedCollections', 'excludedCollections', 'productTitle', 'productDescription', 'variantSubmission', 'brandSubmission', 'productIdentifiers', 'barcode', 'salePrice', 'secondImage', 'additionalImages', 'product_category_id', 'ageGroup', 'gender', 'productCondition', 'utm_campaign', 'utm_source', 'utm_medium', 'status', 'last_updated'
    ];

    // protected $withCount = ['shopProducts', 'shopProductVariants'];

    protected $with = ['category'];

    protected $casts = [
        // 'created_at' => 'datetime:d F Y',
        // 'created_at' => 'datetime:Y-m-d H:00',
        // 'updated_at' => 'datetime:Y-m-d H:00',
        'created_at' => 'datetime:Y-m-d',
        'updated_at' => 'datetime:Y-m-d',
    ];

    public function shopProducts()
    {
        return $this->hasMany(ShopProduct::class);
    }

    public function shopProductVariants()
    {
        return $this->hasMany(ShopProductVariant::class);
    }

    public function editedProducts()
    {
        return $this->hasMany(EditedProduct::class);
    }

    public function excludedProducts()
    {
        return $this->hasMany(ExcludedProduct::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id', 'id');
    }
}
