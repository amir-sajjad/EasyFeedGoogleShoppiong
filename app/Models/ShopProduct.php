<?php

namespace App\Models;

use App\Models\FeedSetting;
use App\Models\ShopProductVariant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use LaravelFillableRelations\Eloquent\Concerns\HasFillableRelations;

class ShopProduct extends Model
{
    use HasFillableRelations;
    
    protected $fillable = [
        'user_id', 'feed_setting_id', 'productId'
    ];

    protected $fillable_relations = ['variants'];

    protected $withCount = ['variants'];

    public function variants()
    {
        return $this->hasMany(ShopProductVariant::class,'shop_product_id','id');
    }

    public function feedSetting(){
        return $this->belongsTo(FeedSetting::class,'feed_setting_id','id');
    }
}
