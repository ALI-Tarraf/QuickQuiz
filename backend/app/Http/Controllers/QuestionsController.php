<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Models\Question;
use App\Models\QuestionAnswers;

class QuestionsController extends Controller
{
    public function index()
    {
        $questions = Question::all();

        return response()->json([
            'questions' => $questions
        ]);
    }
    public function create(StoreQuestionRequest $request)
    {

    }


    public function show($id){
        $question = Question::with('answers')->find($id);


        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        return response()->json(['question' => $question]);
    }
    public function update(UpdateQuestionRequest $request, $id){
        $question = Question::find($id);

        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        $question->update([
            'exam_id' => $request->exam_id,
            'question_text' => $request->question_text,
            'type' => $request->type,
            'mark' => $request->mark,
        ]);

        return response()->json([
            'message' => 'Question updated successfully',
            'question' => $question
        ]);
    }
    public function destroy($id){
        $question = Question::find($id);

        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        $question->delete();

        return response()->json(['message' => 'Question deleted successfully']);

    }
}
