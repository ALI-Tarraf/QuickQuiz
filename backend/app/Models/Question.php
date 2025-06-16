<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\QuestionAnswers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Question extends Model
{
    use HasFactory;
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
    return $this->hasMany(QuestionAnswers::class, 'question_id');
}

}
