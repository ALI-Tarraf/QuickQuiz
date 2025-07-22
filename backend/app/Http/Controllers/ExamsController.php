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

    $user = Auth::user();

    $today = Carbon::today();

    $query = Exam::whereDate('date', '>=', $today);

    if ($user->role === 'student') {
        $query->whereDoesntHave('results', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        });
    }

    $exams = $query->get();

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




public function show($id)
{
    $exam = Exam::with('questions.questionAnswers')->find($id);

    if (!$exam) {
        return response()->json(['message' => 'Exam not found'], 404);
    }

    $user = Auth::user();

    // دمج التاريخ والوقت لوقت بداية الامتحان
    $startDateTime = Carbon::parse($exam->date . ' ' . $exam->time);

    // حساب وقت نهاية الامتحان
    $endDateTime = $startDateTime->copy()->addMinutes($exam->duration_minutes);

    // التحقق مما إذا كان المستخدم طالب (وليس أستاذًا)
    if ($user->role === 'student') {
    $now = Carbon::now();

    // Exam start and end time
    $startDateTime = Carbon::parse($exam->date . ' ' . $exam->time);
    $endDateTime = $startDateTime->copy()->addMinutes($exam->duration);

    // Before exam start
    if ($now->lt($startDateTime)) {
        return response()->json(['message' => 'You cannot access the exam before it starts.'], 403);
    }

    // More than 5 minutes late
    $startGraceLimit = $startDateTime->copy()->addMinutes(5);
    if ($now->gt($startGraceLimit)) {
        return response()->json(['message' => 'You are more than 5 minutes late. You cannot access the exam now.'], 403);
    }

    // Already submitted
    $hasResult = $exam->results()->where('user_id', $user->id)->exists();
    if ($hasResult) {
        return response()->json(['message' => 'You have already submitted this exam.'], 403);
    }
}


    // تجهيز البيانات للإرجاع
    $data = [
        'testName' => $exam->title,
        'testHour' => $exam->time,
        'testDate' => $exam->date,
        'testDuration' => $exam->duration_minutes,
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




public function get($id)
{
    $exam = Exam::with('questions.questionAnswers')->find($id);

    if (!$exam) {
        return response()->json(['message' => 'Exam not found'], 404);
    }

    $user = Auth::user();

    $data = [
        'testName' => $exam->title,
        'testDuration' => $exam->duration_minutes,
        'testHour' => $exam->time,
        'testDate' => $exam->date,
        'totalMark' => $exam->total_marks,
        'questions' => $exam->questions ? $exam->questions->map(function ($question) {
            return [
                'questionText' => $question->question_text,
                'questionScore' => $question->mark,

                // الخيارات
                'options' => $question->questionAnswers ? $question->questionAnswers->map(function ($answer) {
                    return
                        $answer->answer_text
                    ;
                }) : [],

                // الجواب الصحيح
                'correctAnswer' => optional($question->questionAnswers->firstWhere('is_correct', 1))->answer_text,
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
        if (Carbon::now()->gte($currentExamDateTime)) {
            return response()->json([
                'error' => 'The exam cannot be updated',
                'message' => 'Update failed, The exam has already started'
            ], 400);
        }

        // تحديث معلومات الامتحان
        $exam->update([
            'title' => $request->testName,
            'date' => $request->testDate,
            'time' => $request->testHour,
            'duration_minutes' => $request->testDuration,
        ]);

        // حذف جميع الأسئلة والإجابات القديمة
        $existingQuestions = Question::where('exam_id', $exam->id)->get();
        foreach ($existingQuestions as $q) {
            QuestionAnswers::where('question_id', $q->id)->delete();
            $q->delete();
        }

        // إضافة الأسئلة والإجابات الجديدة
        foreach ($request->questions as $qData) {
            $question = Question::create([
                'exam_id' => $exam->id,
                'question_text' => $qData['questionText'],
                'mark' => $qData['questionScore'],
            ]);

            foreach ($qData['options'] as $optionText) {
                QuestionAnswers::create([
                    'question_id' => $question->id,
                    'answer_text' => $optionText,
                    'is_correct' => $optionText === $qData['correctAnswer']
                ]);
            }
        }

        DB::commit();
        return response()->json(['success' => true, 'message' => 'The test has been successfully modified']);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'error' => 'Failed to update test',
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

    $examDateTime = Carbon::parse($exam->date . ' ' . $exam->time);
    $now = Carbon::now();

    // تتبع القيم
    logger("Exam DateTime: $examDateTime | Now: $now");

    if ($examDateTime <= $now) {
        return response()->json(['message' => 'You cannot delete an exam that has already started or passed.'], 403);
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
