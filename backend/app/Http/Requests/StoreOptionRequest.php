<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOptionRequest extends FormRequest
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

                'question_id' => [
                    'required',
                    'exists:question_bank,id',
                    function ($attribute, $value, $fail) {
                        $question = \App\Models\Question::find($value);
                        if (!$question) {
                            $fail('The selected question is not valid.');
                        }
                    },
                ],
                'option_text' => 'required|string|max:255',
                'is_correct'=>'required|integer|min:0|max:1',
            ];

    }
}
