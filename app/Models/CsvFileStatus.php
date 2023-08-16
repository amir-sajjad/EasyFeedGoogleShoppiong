<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CsvFileStatus extends Model
{
    protected $fillable = [
        'user_id',
        'uuid',
        'hasError',
        'isChecked',
        'isDispached',
        'isCompleted',
    ];

    public function csvFiles()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    use HasFactory;
}
