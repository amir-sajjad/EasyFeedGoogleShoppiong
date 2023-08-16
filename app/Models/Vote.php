<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    protected $fillable = [
        'user_id','feature_request_id','feature_id','email','positive','negative','created_at','updated_at'
    ];

    public function featureRequest()
    {
        return $this->belongsTo(FeatureRequest::class, 'feature_request_id', 'id');
    }
    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
