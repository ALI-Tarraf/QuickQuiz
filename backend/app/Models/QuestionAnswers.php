<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestionAnswers extends Model
{
    protected $fillable = [
        'question_id',
        'answer_text',
        'option_text',
        'is_correct',

    ];
}
