<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Exam;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
   public function definition()
{
    return [
        'exam_id' => Exam::inRandomOrder()->first()?->id ?? 1,
        'question_text' => $this->faker->sentence(6),
        'mark'=> $this->faker->numberBetween(1, 10),
    ];
}

}
