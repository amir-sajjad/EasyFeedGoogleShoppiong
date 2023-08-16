<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use LaravelFillableRelations\Eloquent\Concerns\HasFillableRelations;

class SupportTicket extends Model
{
    use HasFillableRelations;

    protected $fillable = [
        'user_id', 'ticket_id', 'email', 'subject', 'description', 'status', 'role', 'priority', 'created_at', 'updated_at'
    ];

    protected $fillable_relations = ['attachments'];

    protected $casts = [
        'created_at' => 'datetime:d M Y',
        // 'created_at' => 'datetime:d F Y',
        // 'created_at' => 'datetime:d M Y H:i:s',
        // 'updated_at' => 'datetime:d M Y H:i:s',
        'updated_at' => 'datetime:d M Y',
    ];

    // protected $dates = ['created_at','updated_at'];

    public function replies()
    {
        return $this->hasMany(Reply::class, 'support_ticket_id', 'id');
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class, 'support_ticket_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
