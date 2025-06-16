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
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
class ExamsController extends Controller
{

public function index()
{
    // الحصول على تاريخ اليوم
    $today = Carbon::today();

    // جلب الامتحانات من اليوم وما بعده
    $exams = Exam::whereDate('date', '>=', $today)->get();

    // تنسيق البيانات
    $exams = $exams->map(function ($exam) {
        return [
            'id' => $exam->id,
            'title' => $exam->title,
            'total_marks' => $exam->total_marks,
            'duration_minutes' => $exam->duration_minutes,
            'date' => $exam->date,
            'time' => $exam->time,
            'teacher_name' => $exam->teacher?->user?->first_name . ' ' . $exam->teacher?->user?->last_name,
        ];
    });

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

        return response()->json(['success' => true, 'test_title' => $exam->title], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => 'Failed to create test'], 500);
    }



}



    // Get single exam by ID
   public function show($id)
{
    $exam = Exam::with('questions.questionAnswers')->find($id);

    if (!$exam) {
        return response()->json(['message' =>'Exam not found'], 404);
    }

    $data = [
        'testName' => $exam->title,
        'questions' => $exam->questions ? $exam->questions->map(function ($question) {
            return [
                'id' => $question->id,
                'question' => $question->question_text,
                'mark' => $question->mark,
                'options' => $question->questionAnswers ? $question->questionAnswers->map(function ($answer) {
                    return [
                        'id' => $answer->id,
                        'text' => $answer->answer_text,

                    ];
                }) : [],
            ];
        }) : [],
    ];

    return response()->json(['exam' => $data]);
}


    // Update exam
   public function update(Request $request, $examId)
{
    $teacher = Teacher::where('user_id', Auth::id())->first();

    DB::beginTransaction();
    try {
        $exam = Exam::where('id', $examId)->where('teacher_id', $teacher->id)->firstOrFail();

        // ✅ تحديث بيانات الامتحان
        $exam->update([
            'title' => $request->testName,
            'total_marks' => $request->totalMark,
            'duration_minutes' => $request->testDuration,
            'date' => $request->testDate,
            'time' => $request->testHour,
        ]);

        // ✅ جلب الأسئلة الحالية من قاعدة البيانات
        $existingQuestions = Question::where('exam_id', $exam->id)->get();

        // ✅ استخراج معرفات الأسئلة الجديدة من الطلب
        $newQuestionIds = collect($request->questions)->pluck('id')->filter()->toArray();

        // ✅ حذف الأسئلة التي لم تعد موجودة
        foreach ($existingQuestions as $existingQuestion) {
            if (!in_array($existingQuestion->id, $newQuestionIds)) {
                QuestionAnswers::where('question_id', $existingQuestion->id)->delete();
                $existingQuestion->delete();
            }
        }

        // ✅ تحديث أو إنشاء الأسئلة
        foreach ($request->questions as $q) {
            if (isset($q['id'])) {
                // تحديث سؤال موجود
                $question = Question::where('id', $q['id'])->where('exam_id', $exam->id)->first();
                if ($question) {
                    $question->update([
                        'question_text' => $q['questionText'],
                        'mark' => $q['questionScore'],
                    ]);

                    // حذف الإجابات القديمة
                    QuestionAnswers::where('question_id', $question->id)->delete();

                    // إضافة الإجابات الجديدة
                    foreach ($q['options'] as $option) {
                        QuestionAnswers::create([
                            'question_id' => $question->id,
                            'answer_text' => $option,
                            'is_correct' => $option === $q['correctAnswer'],
                        ]);
                    }
                }
            } else {
                // إنشاء سؤال جديد
                $newQuestion = Question::create([
                    'exam_id' => $exam->id,
                    'question_text' => $q['questionText'],
                    'mark' => $q['questionScore'],
                ]);

                foreach ($q['options'] as $option) {
                    QuestionAnswers::create([
                        'question_id' => $newQuestion->id,
                        'answer_text' => $option,
                        'is_correct' => $option === $q['correctAnswer'],
                    ]);
                }
            }
        }

        DB::commit();
        return response()->json(['success' => true, 'message' => 'تم تحديث الامتحان بنجاح.']);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'error' => 'فشل في تحديث الامتحان',
            'message' => $e->getMessage()
        ], 500);
    }
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





public function getUpcomingExamsToday()
{
    $now = Carbon::now();
    $threshold = $now->copy()->addMinutes(30);

    // دمج التاريخ والوقت في استعلام MySQL باستخدام CONCAT ثم تحويلهم إلى DATETIME للمقارنة
   $exams = DB::table('exams')
    ->whereRaw("STR_TO_DATE(CONCAT(date, ' ', time), '%Y-%m-%d %H:%i:%s') >= DATE_ADD(NOW(), INTERVAL 30 MINUTE)")
    ->orderBy('date')
    ->orderBy('time')
    ->get();


    return response()->json($exams);
}



}
