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
use App\Models\User;

class StudentAnswersController extends Controller
{
public function create(Request $request, $examId)
{
    $data = $request->all();
    $savedAnswers = [];

    try {
        $student = User::where('id', Auth::id())->first();
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

            // 🧹 Delete previous answers for this exam
        $questionIds = Question::where('exam_id', $examId)->pluck('id');
        StudentAnswer::where('user_id', $student->id)
            ->whereIn('question_id', $questionIds)
            ->delete();
        foreach ($data as $item) {
            $questionId = $item['questionId'] ?? null;
            $answerId = $item['answerId'] ?? null;

            // التأكد من وجود السؤال وينتمي لنفس الامتحان
            $question = Question::where('id', $questionId)
                ->where('exam_id', $examId)
                ->first();

            if (!$question) continue;

            // التأكد من أن هذه الإجابة تابعة لنفس السؤال
            $option = QuestionAnswers::where('id', $answerId)
                ->where('question_id', $questionId)
                ->first();

            $isCorrect = 0;
            $textAnswer = null;

            if ($option) {
                $isCorrect = $option->is_correct;
                $textAnswer = $option->answer_text;
            }

            $savedAnswers[] = StudentAnswer::create([
                'user_id' => $student->id,
                'question_id' => $question->id,
                'selected_option_id' => $option?->id,
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
    $score = StudentAnswer::where('student_answers.user_id', $studentId)
        ->where('student_answers.is_correct', 1)
        ->join('question_bank', 'student_answers.question_id', '=', 'question_bank.id')
        ->where('question_bank.exam_id', $examId)
        ->sum('question_bank.mark');

    ExamResult::updateOrCreate(
        ['user_id' => $studentId, 'exam_id' => $examId],
        ['score' => $score]
    );
}


}
