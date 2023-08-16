<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id', 'notification_type', 'title', 'productId', 'image', 'read', 'update_at_shopify', 'expiration_date'
    ];
    protected $casts = [
        'created_at' => 'datetime:F d, Y',
        'update_at_shopify' => 'datetime:F d, Y',
        // 'update_at_shopify' => 'datetime:M d, Y',
        // 'created_at' => 'datetime:d M Y H:i:s',
        // 'updated_at' => 'datetime:d M Y H:i:s',
        'updated_at' => 'datetime:F d, Y',
    ];
}
