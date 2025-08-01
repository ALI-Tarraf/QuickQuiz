<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamResult extends Model
{
    protected $table = 'exam_results';
    public $timestamps = false;
    protected $fillable = [

        'user_id',
        'exam_id',
        'started_at',
        'completed_at',
        'score'

    ];
public function user()
{
    return $this->belongsTo(User::class, 'user_id');
}


public function exam()
{
    return $this->belongsTo(Exam::class);
}

}
