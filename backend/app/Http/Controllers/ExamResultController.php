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
use Illuminate\Support\Facades\DB;
class ExamResultController extends Controller
{

public function getStudentResults()
{
    $user = Auth::user();
    $student = Student::where('user_id', $user->id)->first();

    if (!$student) {
        return response()->json(['error' => 'Student not found.'], 404);
    }

    $results = ExamResult::where('user_id', $user->id)
        ->with('exam')
        ->get()
        ->map(function ($result) {
            return [
                'exam_id'    => $result->exam->id,
                'exam_title' => $result->exam->title,
                'total_marks'=> $result->exam->total_marks,
                'score'      => $result->score,
            ];
        });

    return response()->json(['results' => $results]);
}


public function getTeacherExamResultsById($examId)
{
    $user = Auth::user();


    $teacher = Teacher::where('user_id', $user->id)->first();

    if (!$teacher) {
        return response()->json(['error' => 'Teacher doesnt exist'], 404);
    }

    // التأكد أن الامتحان يخص المدرّس الحالي
    $exam = Exam::where('id', $examId)->where('teacher_id', $teacher->id)->first();

    if (!$exam) {
        return response()->json(['error' => 'Exam not found or it doesnt relate to this teacher'], 404);
    }

    // جلب النتائج مع بيانات الطالب (المستخدم)
    $results = ExamResult::where('exam_id', $exam->id)
        ->with('user')  // علاقة user موجودة في ExamResult
        ->get();

    // تنسيق النتائج
    $formattedResults = $results->map(function ($result) {
        return [
            'id' => $result->user->id,
            'student_name' => $result->user ? $result->user->first_name . ' ' . $result->user->last_name : null,
            'score'        => $result->score,
        ];
    });

    return response()->json([
        'test_id' => $exam->id,
        'test_title' => $exam->title,
        'total_marks' => $exam->total_marks,
        'participants' => $formattedResults->count(),
        'student_results' => $formattedResults
    ]);
}

public function getTeacherExamResults()
{
    Log::info('getTeacherExamResults reached');

    $user = Auth::user();
    $teacher = Teacher::where('user_id', $user->id)->first();

    if (!$teacher) {
        return response()->json(['error' => 'Teacher doesnt exist'], 404);
    }

    // جلب الامتحانات التي لها نتائج
    $exams = Exam::where('teacher_id', $teacher->id)
        ->whereHas('results')
        ->get();



    // تجهيز الرد مع المعلومات الأساسية فقط
    $response = $exams->map(function ($exam) {
        return [
            'id' => $exam->id,
            'title' => $exam->title,
            'date' => $exam->date,
            'time' => $exam->time,
            'total_marks' => $exam->total_marks,
            'duration_minutes' => $exam->duration_minutes
        ];
    });

    return response()->json($response);
}


}
