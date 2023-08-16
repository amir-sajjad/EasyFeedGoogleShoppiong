<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $fillable = [
        'support_ticket_id','feature_request_id','reply_id','ticket_id','feature_id','attachment','created_at','updated_at'
    ];

    public function supportTicket()
    {
        return $this->belongsTo(SupportTicket::class, 'support_ticket_id', 'id');
    }

    public function featureRequest()
    {
        return $this->belongsTo(FeatureRequest::class, 'feature_request_id', 'id');
    }
    
    public function reply()
    {
        return $this->belongsTo(Reply::class, 'reply_id', 'id');
    }
}
