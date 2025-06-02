<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\QuestionAnswers;
use App\Models\Student;
use Illuminate\Http\Request;
use App\Models\StudentAnswer;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\ExamResultController;
use App\Models\ExamResult;
class StudentAnswersController extends Controller
{
public function create(Request $request, $examId)
{
    $data = $request->all();
    $savedAnswers = [];

    try {
        $student = Student::where('user_id', Auth::id())->first();
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        foreach ($data as $item) {
            $question = Question::whereRaw('LOWER(TRIM(question_text)) = ?', [strtolower(trim($item['question']))])
                ->where('exam_id', $examId)
                ->first();

            if (!$question) continue;

            $option = null;
            $isCorrect = 0;
            $textAnswer = null;
            $selectedOptionId = null;

            if (!empty($item['selectedOption'])) {
                $option = QuestionAnswers::where('question_id', $question->id)
                    ->whereRaw('LOWER(TRIM(answer_text)) = ?', [strtolower(trim($item['selectedOption']))])
                    ->first();

                if ($option) {
                    $isCorrect = $option->is_correct;
                    $textAnswer = $option->answer_text;
                    $selectedOptionId = $option->id;
                }
            }

            $savedAnswers[] = StudentAnswer::create([
                'student_id' => $student->id,
                'question_id' => $question->id,
                'selected_option_id' => $selectedOptionId,
                'text_answer' => $textAnswer,
                'is_correct' => $isCorrect,
            ]);
        }

        $this->saveExamResult($student->id, $examId);

        return response()->json([
            'message' => 'Answers saved successfully',
            'saved' => count($savedAnswers),
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to save answers',
            'error' => $e->getMessage()
        ], 500);
    }
}

private function saveExamResult($studentId, $examId)
{
    $score = StudentAnswer::where('student_id', $studentId)
        ->where('is_correct', 1)
        ->whereHas('question', function ($query) use ($examId) {
            $query->where('exam_id', $examId);
        })
        ->with('question')
        ->get()
        ->sum(function ($answer) {
            return $answer->question->mark ?? 1;
        });

    ExamResult::updateOrCreate(
        ['student_id' => $studentId, 'exam_id' => $examId],
        ['score' => $score]
    );
}


}
