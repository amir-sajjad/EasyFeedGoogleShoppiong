<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use LaravelFillableRelations\Eloquent\Concerns\HasFillableRelations;

class Reply extends Model
{
    use HasFillableRelations;

    protected $fillable = [
        'user_id','feature_request_id','support_ticket_id','ticket_id','feature_id','role','displayName','description','created_at','updated_at'
    ];

    protected $with = ['attachments'];

    protected $fillable_relations = ['attachments'];

    protected $casts = [
        'created_at' => 'datetime:d M Y',
        // 'created_at' => 'datetime:d M Y H:i:s',
        // 'updated_at' => 'datetime:d M Y H:i:s',
        'updated_at' => 'datetime:d M Y',
    ];

    public function supportTicket()
    {
        return $this->belongsTo(SupportTicket::class, 'support_ticket_id', 'id');
    }

    public function featureRequest()
    {
        return $this->belongsTo(FeatureRequest::class, 'feature_request_id', 'id');
    }
    
    public function attachments()
    {
        return $this->hasMany(Attachment::class, 'reply_id', 'id');
    }
        
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
