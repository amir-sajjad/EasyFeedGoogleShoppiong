<?php

namespace App\Models;

use App\Models\FeedSetting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExcludedProduct extends Model
{
    protected $fillable = [
        'user_id','feed_setting_id', 'productId', 'variantId', 'title','image','collectionId','status'
    ];

    public function feedSetting(){
        return $this->belongsTo(FeedSetting::class,'feed_setting_id','id');
    }

    public function user(){
        return $this->belongsTo(User::class,'user_id','id');
    }
}
