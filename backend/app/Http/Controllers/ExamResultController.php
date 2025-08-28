<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\Student;
use App\Models\Teacher;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class ExamResultController extends Controller
{
    /**
     * Get results of the currently logged-in student
     */
    public function getStudentResults()
    {
        //  Get authenticated user
        $user = Auth::user();

        //  Find student record linked to this user
        $student = Student::where('user_id', $user->id)->first();

        if (!$student) {
            //  If no student found → return error
            return response()->json(['error' => 'Student not found.'], 404);
        }

        //  Fetch all exam results for this student and include exam info
        $results = ExamResult::where('user_id', $user->id)
            ->with('exam') // eager load exam relation
            ->get()
            ->map(function ($result) {
                return [
                    'exam_id'     => $result->exam->id,
                    'exam_title'  => $result->exam->title,
                    'total_marks' => $result->exam->total_marks,
                    'score'       => $result->score,
                ];
            });

        //  Return formatted results
        return response()->json(['results' => $results]);
    }

    /**
     * Get results of a specific exam created by the authenticated teacher
     */
    public function getTeacherExamResultsById($examId)
    {
        $user = Auth::user();

        //  Find teacher record linked to this user
        $teacher = Teacher::where('user_id', $user->id)->first();

        if (!$teacher) {
            return response()->json(['error' => 'Teacher doesnt exist'], 404);
        }

        //  Ensure that the exam belongs to this teacher
        $exam = Exam::where('id', $examId)
            ->where('teacher_id', $teacher->id)
            ->first();

        if (!$exam) {
            return response()->json(['error' => 'Exam not found or it doesnt relate to this teacher'], 404);
        }

        //  Get results for this exam, including student (user) info
        $results = ExamResult::where('exam_id', $exam->id)
            ->with('user') // eager load user relation
            ->get();

        //  Format student results
        $formattedResults = $results->map(function ($result) {
            return [
                'id'           => $result->user->id,
                'student_name' => $result->user ? $result->user->first_name . ' ' . $result->user->last_name : null,
                'score'        => $result->score,
                'img'          => $result->user ? $result->user->img : null
            ];
        });

        //  Return exam info + student results
        return response()->json([
            'test_id'        => $exam->id,
            'test_title'     => $exam->title,
            'total_marks'    => $exam->total_marks,
            'participants'   => $formattedResults->count(),
            'student_results'=> $formattedResults,

        ]);
    }

    /**
     * Get all exams (with results) created by the authenticated teacher
     */
    public function getTeacherExamResults()
    {
        Log::info('getTeacherExamResults reached');

        $user = Auth::user();

        //  Find teacher record linked to this user
        $teacher = Teacher::where('user_id', $user->id)->first();

        if (!$teacher) {
            return response()->json(['error' => 'Teacher doesnt exist'], 404);
        }

        //  Fetch all exams created by this teacher that already have results
        $exams = Exam::where('teacher_id', $teacher->id)
            ->whereHas('results') // only exams with results
            ->get();

        //  Format exam details
        $response = $exams->map(function ($exam) {
            return [
                'id'              => $exam->id,
                'title'           => $exam->title,
                'date'            => $exam->date,
                'time'            => $exam->time,
                'total_marks'     => $exam->total_marks,
                'duration_minutes'=> $exam->duration_minutes
            ];
        });

        //  Return exams list
        return response()->json($response);
    }
}
