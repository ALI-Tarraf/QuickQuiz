<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentAnswer extends Model
{
      protected $fillable = [
        'student_id',
        'question_id',
        'selected_option_id',
        'text_answer',
        'is_correct',
    ];


    public function question()
{
    return $this->belongsTo(Question::class);
}

}
