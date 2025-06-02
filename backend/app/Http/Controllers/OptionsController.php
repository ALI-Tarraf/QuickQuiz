<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Option;
use App\Http\Requests\StoreOptionRequest;
use App\Http\Requests\UpdateOptionRequest;
class OptionsController extends Controller
{
        public function index()
    {
        $options = Option::all();

        return response()->json([
            'options' => $options
        ]);
    }
    public function create(StoreOptionRequest $request){
        $option = Option::create([
            'question_id' => $request->question_id,
            'option_text' => $request->option_text,
            'is_correct' => $request->is_correct,

        ]);
        return response()->json([
            'message' => 'Option created successfully',
            'option' => $option
        ]);

    }
    public function show($id){
        $option = Option::find($id);

        if (!$option) {
            return response()->json(['message' => 'Option not found'], 404);
        }

        return response()->json(['option' => $option]);
    }
    public function update(UpdateOptionRequest $request, $id){
        $option = Option::find($id);

        if (!$option) {
            return response()->json(['message' => 'Option not found'], 404);
        }

        $option->update([
            'question_id' => $request->question_id,
            'option_text' => $request->option_text,
            'is_correct' => $request->is_correct,

        ]);

        return response()->json([
            'message' => 'Option updated successfully',
            'option' => $option
        ]);
    }
    public function destroy($id){
        $option = Option::find($id);

        if (!$option) {
            return response()->json(['message' => 'Option not found'], 404);
        }

        $option->delete();

        return response()->json(['message' => 'Option deleted successfully']);

    }
}
