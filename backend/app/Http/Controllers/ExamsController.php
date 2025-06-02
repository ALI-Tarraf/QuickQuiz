<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Requests\StoreExamRequest;
use App\Models\Exam;
use App\Http\Requests\UpdateExamRequest;
use App\Models\Question;
use App\Models\QuestionAnswers;
use App\Models\Teacher;
use Illuminate\Support\Facades\DB;
class ExamsController extends Controller
{
    public function index()
    {
        $exams = Exam::all();

        return response()->json([
            'exams' => $exams
        ]);
    }
  public function create(Request $request)
{
    $teacher = Teacher::where('user_id',Auth::id())->first();
    try {
        $exam = Exam::create([
            'title' => $request->testName,
            'teacher_id' => $teacher->id,
            'total_marks' => $request->totalMark,
            'duration_minutes' => $request->testDuration,
            'date' => $request->testDate,  // Expected format: 'YYYY-MM-DD'
            'time' => $request->testHour,  // Expected format: 'HH:MM:SS'
        ]);

        foreach ($request->questions as $q) {
            $question = Question::create([
                'exam_id' => $exam->id,
                'question_text' => $q['questionText'],
                'mark' => $q['questionScore'],
            ]);

            foreach ($q['options'] as $option) {
                QuestionAnswers::create([
                    'question_id' => $question->id,
                    'answer_text' => $option,
                    'is_correct' => $option === $q['correctAnswer'],
                ]);
            }
        }

        DB::commit();

        return response()->json(['success' => true, 'exam_id' => $exam->id], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => 'Failed to create exam', 'message' => $e->getMessage()], 500);
    }



}



    // Get single exam by ID
    public function show($id)
    {
        $exam = Exam::find($id);
        $exam = Exam::with('questions')->find($id);

        if (!$exam) {
            return response()->json(['message' => 'Exam not found'], 404);
        }

        return response()->json(['exam' => $exam]);
    }
    // Update exam
    public function update(UpdateExamRequest $request, $id)
    {
        $exam = Exam::find($id);

        if (!$exam) {
            return response()->json(['message' => 'Exam not found'], 404);
        }

        $exam->update([
            'title' => $request->title,
            'subject_id' => $request->subject_id,
            'total_marks' => $request->total_marks,
            'duration_minutes' => $request->duration_minutes,
            'max_attempts' => $request->max_attempts,
        ]);

        return response()->json([
            'message' => 'Exam updated successfully',
            'exam' => $exam
        ]);
    }
    public function destroy($id)
    {
        $exam = Exam::find($id);

        if (!$exam) {
            return response()->json(['message' => 'Exam not found'], 404);
        }

        $exam->delete();

        return response()->json(['message' => 'Exam deleted successfully']);
    }
}
