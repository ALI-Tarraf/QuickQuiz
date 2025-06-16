<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Exam;
use App\Models\Question;
use App\Models\QuestionAnswers;

class ExamsSeeder extends Seeder
{
    public function run(): void
    {
        // إنشاء 5 امتحانات
        Exam::factory(5)->create()->each(function ($exam) {
            // لكل امتحان، إنشاء 5 أسئلة
            $questions = Question::factory(5)->create([
                'exam_id' => $exam->id,
            ]);

            // لكل سؤال، أنشئ 4 إجابات، واحدة منها صحيحة
            $questions->each(function ($question) {
                $correctIndex = rand(0, 3); // اختر واحدة لتكون صحيحة

                for ($i = 0; $i < 4; $i++) {
                    QuestionAnswers::factory()->create([
                        'question_id' => $question->id,
                        'is_correct' => $i === $correctIndex,
                    ]);
                }
            });
        });
    }
}
