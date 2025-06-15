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
    $user = Auth::user();
    $student = Student::where('user_id', $user->id)->first();

    $results = ExamResult::where('user_id', $student->id)
        ->with(['exam', 'user'])  // جلب العلاقات
        ->get()
        ->map(function ($result) {
            return [
                'id' =>$result->exam->id ,
                'exam_title' => $result->exam->title,
                'total_marks' => $result->exam->total_marks,
                'score' => $result->score,
            ];
        });

    return response()->json([
        'results' => $results
    ]);
}

public function getTeacherExamResultsById($examId)
{
    $user = Auth::user();

    $teacher = Teacher::where('user_id', $user->id)->first();

    if (!$teacher) {
        return response()->json(['error' => 'لم يتم العثور على المدرّس'], 404);
    }

    // التأكد أن الامتحان يخص المدرّس الحالي
    $exam = Exam::where('id', $examId)->where('teacher_id', $teacher->id)->first();

    if (!$exam) {
        return response()->json(['error' => 'الامتحان غير موجود أو لا يتبع هذا المدرس'], 404);
    }

    // جلب النتائج مع بيانات الطالب (المستخدم)
    $results = ExamResult::where('exam_id', $exam->id)
        ->with('user')  // علاقة user موجودة في ExamResult
        ->get();

    // تنسيق النتائج
    $formattedResults = $results->map(function ($result) {
        return [
            'id' => $result->id,
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
        return response()->json(['error' => 'لم يتم العثور على المدرّس'], 404);
    }

    // جلب الامتحانات التي لها نتائج
    $exams = Exam::where('teacher_id', $teacher->id)
        ->whereHas('results')
        ->get();

    if ($exams->isEmpty()) {
        return response()->json(['error' => 'لا يوجد امتحانات منتهية بعد'], 404);
    }

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
