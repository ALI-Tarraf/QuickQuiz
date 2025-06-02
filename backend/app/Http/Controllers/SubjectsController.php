<?php

namespace App\Http\Controllers;
use App\Models\Subject;
use Illuminate\Http\Request;
use App\Http\Requests\StoreSubjectRequest;
class SubjectsController extends Controller
{
    public function createSubject(StoreSubjectRequest $request)
    {

        $subject = Subject::create([
            'name' => $request->name,
            'description' => $request->description,
            'teacher_id' => $request->teacher_id,
        ]);

        return response()->json([
            'message' => 'Subject created successfully',
            'subject' => $subject
        ]);
    }
}
