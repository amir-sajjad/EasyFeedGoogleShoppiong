<?php

namespace App\Models;

use App\Models\ShopProduct;
use Osiset\ShopifyApp\Traits\ShopModel;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Osiset\ShopifyApp\Contracts\ShopModel as IShopModel;

class User extends Authenticatable implements IShopModel
{
    use Notifiable;
    use ShopModel;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'shopify_freemium', 'plan_id', 'updated_at',
        'pendingFeeds', 'shopify_grandfathered'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];
    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $with = ['settings'];
    protected $withCount = ['shopProductVariants', 'shopProducts'];

    public function settings()
    {
        return $this->hasOne(Setting::class);
    }

    public function feedSettings()
    {
        return $this->hasMany(FeedSetting::class);
    }

    public function shopProducts()
    {
        return $this->hasMany(ShopProduct::class);
    }

    public function shopProductVariants()
    {
        return $this->hasMany(ShopProductVariant::class);
    }

    public function promotions()
    {
        return $this->hasMany(Promotion::class);
    }
}
