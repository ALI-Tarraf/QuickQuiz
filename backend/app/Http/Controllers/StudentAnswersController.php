<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\QuestionAnswers;
use Illuminate\Http\Request;
use App\Models\StudentAnswer;
use Exception;
use Illuminate\Support\Facades\Auth;
use App\Models\ExamResult;
use App\Models\User;

class StudentAnswersController extends Controller
{
    public function create(Request $request, $examId)
    {
        $data = $request->all();
        $savedAnswers = [];

        try {
            //  Get the current authenticated student
            $student = User::where('id', Auth::id())->first();
            if (!$student) {
                return response()->json(['message' => 'Student not found'], 404);
            }

            //  Delete previous answers for this exam (if any)
            $questionIds = Question::where('exam_id', $examId)->pluck('id');
            StudentAnswer::where('user_id', $student->id)
                ->whereIn('question_id', $questionIds)
                ->delete();

            //  Loop through submitted answers
            foreach ($data as $item) {
                $questionId = $item['questionId'] ?? null;
                $answerId = $item['answerId'] ?? null;

                // Check that the question exists and belongs to the given exam
                $question = Question::where('id', $questionId)
                    ->where('exam_id', $examId)
                    ->first();

                if (!$question) continue;

                // Check that the selected answer belongs to this question
                $option = QuestionAnswers::where('id', $answerId)
                    ->where('question_id', $questionId)
                    ->first();

                $textAnswer = $item['textAnswer'] ?? null;
                $isCorrect = 0;

                if ($option) {
                    // If MCQ, mark as correct or incorrect
                    $isCorrect = $option->is_correct;
                    $textAnswer = $option->answer_text;
                } else {
                    // If text question, compare with the correct stored answer
                    $correctAnswer = QuestionAnswers::where('question_id', $questionId)
                        ->where('is_correct', 1)
                        ->value('answer_text');

                    if (trim(strtolower($textAnswer)) === trim(strtolower($correctAnswer))) {
                        $isCorrect = 1;
                    }
                }

                // Save student answer
                $savedAnswers[] = StudentAnswer::create([
                    'user_id' => $student->id,
                    'question_id' => $question->id,
                    'selected_option_id' => $option?->id,
                    'text_answer' => $textAnswer,
                    'is_correct' => $isCorrect,
                ]);
            }

            //  Save the exam result (score)
            $this->saveExamResult($student->id, $examId);

            return response()->json([
                'message' => 'Answers saved successfully',
                'saved' => $savedAnswers,
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
        // Calculate the score by summing the marks of correctly answered questions
        $score = StudentAnswer::where('student_answers.user_id', $studentId)
            ->where('student_answers.is_correct', 1)
            ->join('question_bank', 'student_answers.question_id', '=', 'question_bank.id')
            ->where('question_bank.exam_id', $examId)
            ->sum('question_bank.mark');

        // Store or update the exam result
        ExamResult::updateOrCreate(
            ['user_id' => $studentId, 'exam_id' => $examId],
            ['score' => $score]
        );
    }
}
