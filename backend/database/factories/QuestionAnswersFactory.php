<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Question;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class QuestionAnswersFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
public function definition()
{
    return [
        'question_id' => Question::inRandomOrder()->first()?->id ?? 1,
        'answer_text' => $this->faker->sentence(4),
        'is_correct' => false, // سنعدّل الصحيح لاحقًا في seeder
    ];
}


}
