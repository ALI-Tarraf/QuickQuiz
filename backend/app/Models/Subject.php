<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'name',
        'description',
        'teacher_id'
    ];

    public function user()
    {
        return $this->belongsTo(Teacher::class);
    }
}

