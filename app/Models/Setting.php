<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'user_id', 'setup', 'storeFrontAccessToken', 'googleAccessToken', 'googleRefreshToken', 'googleAccountId', 'googleAccountName', 'googleAccountEmail', 'googleAccountAvatar', 'merchantAccountId', 'merchantAccountName', 'connectedMerchants', 'country', 'language', 'currency', 'themeId', 'domain', 'store_name', 'store_email', 'store_phone', 'feedsCount', 'notification_setting', 'country_name', 'plan_display_name', 'last_updated', 'created_at', 'updated_at'
    ];

    protected $dates = [
        'last_updated', 'notification_date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
