<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
class StoreQuestionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && $user->role === 'teacher';
    }



public function withValidator($validator)
{
    $validator->after(function ($validator) {
        $type = $this->input('type');

        if ($type === 'mcq') {
            if (!$this->has('options') || !is_array($this->input('options')) || count($this->input('options')) < 2) {
                $validator->errors()->add('options', 'MCQ questions must have at least two options.');
            }
        }

        if ($type === 'short_answer') {
            if (!$this->filled('answer_text')) {
                $validator->errors()->add('answer_text', 'Short answer questions require an answer.');
            }
        }

        if ($type === 'true_false') {
            if (!$this->has('is_correct') || !in_array($this->input('is_correct'), [true, false, 0, 1, "true", "false", "0", "1"], true)) {
                $validator->errors()->add('is_correct', 'True/False questions must have a valid boolean value.');
            }
        }
    });
}

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'exam_id' => [
                'required',
                'exists:exams,id',
                function ($attribute, $value, $fail) {
                    $subject = \App\Models\Exam::find($value);
                    if (!$subject) {
                        $fail('The selected exam is not valid.');
                    }
                },
            ],
            'question_text' => 'required|string|max:255',
            'type' => 'required|in:mcq,true_false,short_answer',
            'mark'=>'required|integer|min:1',
        ];
    }
}
