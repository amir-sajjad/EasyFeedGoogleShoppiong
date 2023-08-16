<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use LaravelFillableRelations\Eloquent\Concerns\HasFillableRelations;

class FeatureRequest extends Model
{
    use HasFillableRelations;

    protected $fillable = [
        'user_id', 'feature_id', 'displayName', 'email', 'subject', 'description', 'status', 'created_at', 'updated_at'
    ];

    protected $fillable_relations = ['attachments'];

    protected $casts = [
        'created_at' => 'datetime:d M Y',
        // 'created_at' => 'datetime:Y-m-d H:00',
        // 'updated_at' => 'datetime:Y-m-d H:00',
        'updated_at' => 'datetime:d M Y',
    ];

    public function replies()
    {
        return $this->hasMany(Reply::class, 'feature_request_id', 'id');
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class, 'feature_request_id', 'id');
    }

    public function votes()
    {
        return $this->hasMany(Vote::class, 'feature_request_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
