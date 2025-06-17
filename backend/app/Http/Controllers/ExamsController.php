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
        'testHour'=> $exam->time,
        'testDate'=> $exam->date,
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
    if (!$teacher) {
        return response()->json(['error' => 'المدرس غير موجود'], 404);
    }

    DB::beginTransaction();
    try {
        $exam = Exam::find($examId);

        if (!$exam) {
            return response()->json([
                'error' => 'الامتحان غير موجود',
                'message' => 'لم يتم العثور على الامتحان.'
            ], 404);
        }

        if ($exam->teacher_id !== $teacher->id) {
            return response()->json([
                'error' => 'No permissions',
                'message' => 'This exam is not for this teacher'
            ], 403);
        }

        // التحقق من وجود التاريخ والوقت
        if (empty($exam->date) || empty($exam->time)) {
            return response()->json([
                'error' => 'بيانات وقت الامتحان غير مكتملة',
                'message' => 'لا يمكن التحقق من توقيت الامتحان لعدم توفر التاريخ أو الوقت.'
            ], 400);
        }

        // منع التعديل بعد بدء الامتحان
        $currentExamDateTime = Carbon::parse($exam->date . ' ' . $exam->time);
        $now = Carbon::now();

        if ($now->gte($currentExamDateTime)) {
            return response()->json([
                'error' => 'The exam cannot be updated',
                'message' => 'The exam has already started'
            ], 400);
        }

        // تحديث معلومات الامتحان
        $exam->update([
            'title' => $request->exam['testName'],
            'date' => $request->exam['date'],
            'time' => $request->exam['time'],
            'duration_minutes' => $request->exam['duration'],
        ]);

        // الأسئلة القديمة
        $existingQuestions = Question::where('exam_id', $exam->id)->get();
        $newIds = collect($request->exam['questions'])->pluck('id')->filter()->toArray();

        // حذف الأسئلة غير الموجودة في الطلب
        foreach ($existingQuestions as $q) {
            if (!in_array($q->id, $newIds)) {
                QuestionAnswers::where('question_id', $q->id)->delete();
                $q->delete();
            }
        }

        // معالجة الأسئلة الجديدة أو المعدلة
        foreach ($request->exam['questions'] as $qData) {
            if (isset($qData['id'])) {
                $question = Question::where('id', $qData['id'])
                                    ->where('exam_id', $exam->id)
                                    ->first();
                if ($question) {
                    $question->update([
                        'question_text' => $qData['question'],
                        'mark' => $qData['mark'],
                    ]);
                    QuestionAnswers::where('question_id', $question->id)->delete();
                } else {
                    $question = Question::create([
                        'exam_id' => $exam->id,
                        'question_text' => $qData['question'],
                        'mark' => $qData['mark'],
                    ]);
                }
            } else {
                $question = Question::create([
                    'exam_id' => $exam->id,
                    'question_text' => $qData['question'],
                    'mark' => $qData['mark'],
                ]);
            }

            foreach ($qData['options'] as $option) {
                QuestionAnswers::create([
                    'question_id' => $question->id,
                    'answer_text' => $option['text'],
                    'is_correct' => $option['text'] === $qData['correctAnswer']
                ]);
            }
        }

        DB::commit();
        return response()->json(['success' => true, 'message' => 'تم تحديث الامتحان بنجاح.']);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'error' => 'Failed to update exam',
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
    $teacher = Teacher::where('user_id', Auth::id())->first();

    if (!$teacher) {
        return response()->json(['error' => 'Teacher doesn\'t exist'], 404);
    }

    // جلب الامتحانات التي لم تبدأ بعد والخاصة بالمدرس الحالي
    $exams = DB::table('exams')
        ->where('teacher_id', $teacher->id)
        ->whereRaw("STR_TO_DATE(CONCAT(date, ' ', time), '%Y-%m-%d %H:%i:%s') > NOW()")
        ->orderBy('date')
        ->orderBy('time')
        ->get();

    return response()->json($exams);
}





}
