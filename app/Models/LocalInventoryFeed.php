<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LocalInventoryFeed extends Model
{

    protected $fillable = [
        'uuid', 'user_id', 'feed_setting_id', 'feed_name', 'feed_url', 'feed_type', 'code', 'availability', 'salePriceEffectiveDate', 'salePrice', 'pickupMethod', 'pickupSla', 'instoreProductLocation', 'skus', 'status'
    ];

    protected $casts = [
        // 'created_at' => 'datetime:d F Y',
        // 'created_at' => 'datetime:Y-m-d H:00',
        // 'updated_at' => 'datetime:Y-m-d H:00',
        'created_at' => 'datetime:Y-m-d',
        'updated_at' => 'datetime:Y-m-d',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function feedSetting()
    {
        return $this->belongsTo(FeedSetting::class, 'feed_setting_id', 'id');
    }
}
