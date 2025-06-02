<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\Student;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\StudentAnswer;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use PHPUnit\Framework\MockObject\Builder\Stub;

class ExamResultController extends Controller
{

public function getStudentResults()
{

  $user = User::where('id',Auth::id())->first();
  $student = Student::where('user_id',$user->id)->first();
  $results = ExamResult::where('student_id',$student->id)->get();
    return response()->json([
            'Results' => $results
        ]);


}
public function getTeacherExamResultsById($examId)
{
    $user = Auth::user();

    $teacher = Teacher::where('user_id', $user->id)->first();

    // التأكد أن الامتحان يخص المدرّس الحالي
    $exam = Exam::where('id', $examId)->where('teacher_id', $teacher->id)->first();

    if (!$exam) {
        return response()->json(['error' => 'الامتحان غير موجود أو لا يتبع هذا المدرس'], 404);
    }

    // جلب النتائج مع علاقات الطالب
    $results = ExamResult::where('exam_id', $exam->id)
        ->with(['student.user'])
        ->get();

    // تنسيق النتائج
    $formattedResults = $results->map(function ($result) use ($exam) {
        return [
            'student_name' => $result->student ? $result->student?->user?->first_name . ' ' . $result->student?->user?->last_name : null,
            'exam_title'   => $exam->title,
            'score'        => $result->score,
            'started_at'   => $result->started_at,
            'completed_at' => $result->completed_at,
        ];
    });

    return response()->json([
        'exam_id' => $exam->id,
        'exam_title' => $exam->title,

        'results' => $formattedResults
    ]);
}


}
