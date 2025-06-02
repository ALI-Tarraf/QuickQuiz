<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\QuestionAnswers;
class Question extends Model
{
    protected $table = 'question_bank';
    public $timestamps = false;
    protected $fillable = [
        'exam_id',
        'question_text',
        'type',
        'mark',
    ];


public function questionAnswers()
{
    return $this->hasMany(\App\Models\QuestionAnswers::class, 'question_id');
}

}
