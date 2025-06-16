<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Exam extends Model
{
    use HasFactory;
    protected $table = 'exams';
    public $timestamps = false;
    protected $fillable = [
        'title',
        'teacher_id',
        'total_marks',
        'duration_minutes',
        'date',
        'time'

    ];

    public function teacher()
{
    return $this->belongsTo(Teacher::class);
}
public function questions()
{
    return $this->hasMany(Question::class);
}
public function results()
{
    return $this->hasMany(ExamResult::class);
}

}
