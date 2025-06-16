<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class ExamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
  public function definition()
{
    return [
        'title' => $this->faker->sentence(3),
        'duration_minutes' => $this->faker->numberBetween(10, 100),
        'total_marks' => 100,
        'teacher_id' => 1 // أو أي قيمة موجودة
    ];
}

}
