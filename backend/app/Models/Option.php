<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    protected $table = 'options';
    public $timestamps = false;
    protected $fillable = [
        'question_id',
        'answer_text',


    ];

    public function user()
    {
        return $this->belongsTo(Question::class);
    }
}
