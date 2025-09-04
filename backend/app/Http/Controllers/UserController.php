<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
class UserController extends Controller
{
    /**
     * Get the currently authenticated user.
     */
    public function getUser(Request $request)
    {
        // Return the authenticated user as JSON
        return response()->json(Auth::user());
    }

    /**
     * Get all users except the currently authenticated one,
     * including teacher specialization if the user is a teacher.
     */
    public function getUsers(Request $request)
    {
        $users = User::where('id', '!=', Auth::id()) // Exclude current user
            ->with('teacher') // Eager load teacher relation
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'img' => $user->img,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                    // Include teacher specialization if role is teacher
                    'specialization' => $user->role === 'teacher' ? $user->teacher?->specialization : " ",
                ];
            });

        return response()->json([
            'users' => $users
        ]);
    }

    /**
     * Delete a user and all related data based on the user's role.
     */
    public function deleteUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->role === 'teacher' && $user->teacher) {
            // Delete exams associated with the teacher
            $user->teacher->exams()->delete();

            // Delete the teacher record
            $user->teacher->delete();
        } elseif ($user->role === 'student' && $user->student) {
            // Delete student's answers
            DB::table('student_answers')->where('user_id', $user->id)->delete();

            // Delete exam results if any
            DB::table('exam_results')->where('user_id', $user->id)->delete();

            // Delete the student record
            $user->student->delete();
        }

        // Finally, delete the user
        $user->delete();

        return response()->json(['message' => 'User and related data deleted successfully']);
    }


public function changePassword(Request $request, $id)
{
    $request->validate([
        'password' => 'required|string|min:8',
    ]);

    $user = User::find($id);
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Hash the incoming plain password and save
    $user->password = Hash::make($request->password);
    $user->save();

    return response()->json(['message' => 'Password edited successfully']);
}


}
