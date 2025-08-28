<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Exam;
use App\Models\Question;
use App\Models\QuestionAnswers;
use App\Models\Teacher;
use Carbon\Carbon;

class ExamsController extends Controller
{
    /**
     * List all upcoming exams (for both students and teachers).
     * Students will only see exams they have not already taken.
     */
    public function index()
    {
        $user = Auth::user();
        $today = Carbon::today();

        $query = Exam::whereDate('date', '>=', $today);

        if (in_array($user->role, ['student', 'teacher'])) {
            $query->whereDoesntHave('results', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $exams = $query->get();

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

        return response()->json(['exams' => $exams]);
    }

    /**
     * Create a new exam with questions and answers (Teacher only).
     */
    public function create(Request $request)
    {
        $teacher = Teacher::where('user_id', Auth::id())->first();

        if (!$teacher) {
            return response()->json(['error' => 'Teacher not found'], 404);
        }

        DB::beginTransaction();
        try {
            $exam = Exam::create([
                'title' => $request->testName,
                'teacher_id' => $teacher->id,
                'total_marks' => $request->totalMark,
                'duration_minutes' => $request->testDuration,
                'date' => $request->testDate,
                'time' => $request->testHour,
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
            return response()->json(['error' => 'Failed to create exam'], 500);
        }
    }

    /**
     * Show exam details (students cannot see correct answers).
     */
    public function show($id)
{
    $exam = Exam::with('questions.questionAnswers')->find($id);

    if (!$exam) {
        return response()->json(['error' => 'Exam not found'], 404);
    }

    $user = Auth::user();
    $startDateTime = Carbon::parse($exam->date . ' ' . $exam->time);
    $endDateTime = $startDateTime->copy()->addMinutes($exam->duration_minutes);
    $now = Carbon::now();

    // نفس الشروط تنطبق على الطالب والأستاذ
    if (in_array($user->role, ['student', 'teacher'])) {
        if ($now->lt($startDateTime)) {
            return response()->json(['error' => 'You cannot access the exam before it starts'], 403);
        }

        if ($now->gt($endDateTime)) {
            return response()->json(['error' => 'The exam has already ended'], 403);
        }

        $gracePeriodEnd = $startDateTime->copy()->addMinutes(5);
        if ($now->gt($gracePeriodEnd)) {
            return response()->json(['error' => 'You are more than 5 minutes late. You cannot access the exam'], 403);
        }

        // التحقق من أن المستخدم لم يقدم الامتحان سابقاً
        $hasResult = $exam->results()->where('user_id', $user->id)->exists();
        if ($hasResult) {
            return response()->json(['error' => 'You have already submitted this exam'], 403);
        }
    }

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
        return response()->json(['error' => 'Exam not found'], 404);
    }

    $teacher = Teacher::where('user_id', Auth::id())->first();
    if (!$teacher || $exam->teacher_id !== $teacher->id) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    // منع الوصول إذا بدأ الامتحان
    $examDateTime = Carbon::parse($exam->date . ' ' . $exam->time);
    if (Carbon::now()->gte($examDateTime)) {
        return response()->json(['error' => 'You cannot access this exam because it has already started'], 403);
    }

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
                'options' => $question->questionAnswers ? $question->questionAnswers->map(function ($answer) {
                    return $answer->answer_text;
                }) : [],
                'correctAnswer' => optional($question->questionAnswers->firstWhere('is_correct', 1))->answer_text,
            ];
        }) : [],
    ];

    return response()->json(['exam' => $data]);
}

    /**
     * Update an existing exam (Teacher only).
     */
    public function update(Request $request, $examId)
    {
        $teacher = Teacher::where('user_id', Auth::id())->first();
        if (!$teacher) {
            return response()->json(['error' => 'Teacher not found'], 404);
        }

        DB::beginTransaction();
        try {
            $exam = Exam::find($examId);

            if (!$exam) {
                return response()->json(['error' => 'Exam not found'], 404);
            }

            if ($exam->teacher_id !== $teacher->id) {
                return response()->json(['error' => 'Unauthorized: This exam does not belong to you'], 403);
            }

            if (empty($exam->date) || empty($exam->time)) {
                return response()->json(['error' => 'Exam time information is incomplete'], 400);
            }

            $currentExamDateTime = Carbon::parse($exam->date . ' ' . $exam->time);
            if (Carbon::now()->gte($currentExamDateTime)) {
                return response()->json(['error' => 'The exam cannot be updated because it has already started'], 400);
            }

            $exam->update([
                'title' => $request->testName,
                'date' => $request->testDate,
                'time' => $request->testHour,
                'total_marks'=>$request->totalMark,
                'duration_minutes' => $request->testDuration,
            ]);

            $existingQuestions = Question::where('exam_id', $exam->id)->get();
            foreach ($existingQuestions as $q) {
                QuestionAnswers::where('question_id', $q->id)->delete();
                $q->delete();
            }

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
            return response()->json(['success' => true, 'message' => 'Exam updated successfully']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update exam', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete an exam if it hasn't started yet.
     */
    public function destroy($id)
    {
        $exam = Exam::find($id);

        if (!$exam) {
            return response()->json(['error' => 'Exam not found'], 404);
        }

        $examDateTime = Carbon::parse($exam->date . ' ' . $exam->time);
        $now = Carbon::now();

        if ($examDateTime <= $now) {
            return response()->json(['error' => 'You cannot delete an exam that has already started or passed'], 403);
        }

        $exam->delete();
        return response()->json(['success' => true, 'message' => 'Exam deleted successfully']);
    }

    /**
     * Get all upcoming exams for the logged-in teacher.
     */
    public function getUpcomingExamsToday()
    {
        $teacher = Teacher::where('user_id', Auth::id())->first();

        if (!$teacher) {
            return response()->json(['error' => 'Teacher not found'], 404);
        }

        $exams = DB::table('exams')
            ->where('teacher_id', $teacher->id)
            ->whereRaw("STR_TO_DATE(CONCAT(date, ' ', time), '%Y-%m-%d %H:%i:%s') > NOW()")
            ->orderBy('date')
            ->orderBy('time')
            ->get();

        return response()->json($exams);
    }
}
