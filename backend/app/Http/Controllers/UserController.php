<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class UserController extends Controller
{
    public function getUser(Request $request)
    {
        return response()->json(Auth::user());
    }

 public function getUsers(Request $request)
{
    $users = User::where('id', '!=', Auth::id())
        ->with('teacher') // يجلب بيانات المدرس المرتبطة بالمستخدم
        ->get()
        ->map(function ($user) {
            return [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email'=>$user->email,
                'img'=>$user->img,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'specialization' => $user->role === 'teacher' ? $user->teacher?->specialization : " ", // الاختصاص من جدول teachers
            ];
        });

    return response()->json([
        'users' => $users
    ]);
}

public function deleteUser($id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    if ($user->role === 'teacher' && $user->teacher) {
        // حذف الامتحانات المرتبطة بالأستاذ
        $user->teacher->exams()->delete();

        // حذف سجل الأستاذ نفسه
        $user->teacher->delete();
    } elseif ($user->role === 'student' && $user->student) {
        // حذف سجل الطالب
        $user->student->delete();
    }

    // أخيرًا حذف المستخدم
    $user->delete();

    return response()->json(['message' => 'User and related data deleted successfully']);
}



}
