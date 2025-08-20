<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class QuestionAnswers extends Model
{
    use HasFactory;
    protected $fillable = [
        'question_id',
        'answer_text',

        'is_correct',

    ];
}
