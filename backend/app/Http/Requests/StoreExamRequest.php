<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExamRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && $user->role === 'teacher';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
   public function rules(): array
{
    return [
        'title' => 'required|string|max:255',
        'total_marks' => 'required|integer|min:1',
        'duration_minutes' => 'required|integer|min:10',
        'date_time' => 'required|date|after:now',
        'questions' => 'required|array|min:1',
        'questions.*.question_text' => 'required|string',
        'questions.*.type' => 'required|in:mcq,true_false,short_answer',
        'questions.*.mark' => 'required|integer|min:1',
        'questions.*.options' => 'required_if:questions.*.type,mcq|array',
        'questions.*.options.*.answer_text' => 'required_with:questions.*.options|string',
        'questions.*.options.*.is_correct' => 'required_with:questions.*.options|boolean',
        'questions.*.answer_text' => 'required_if:questions.*.type,short_answer|string',
        'questions.*.is_correct' => 'required_if:questions.*.type,true_false|boolean',
    ];
}


}
