<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\DB;

use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;

class AuthController extends Controller
{
    /**
     * Register new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => ['required', Password::min(8)->mixedCase()->letters()->numbers()->symbols()],
            'role' => 'required|in:student,teacher',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'specialization' => 'required_if:role,teacher|string|max:255',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $imgPath = null;
        if ($request->hasFile('img')) {
           $imgPath = $request->file('img')->store('images', 'public'); // تحفظ الصورة في storage/app/public/images
        }
        DB::beginTransaction();

        try {
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'img' => $imgPath??null,
            ]);

            if ($user->role === 'student') {
                Student::create(['user_id' => $user->id]);
            } else {
                Teacher::create([
                    'user_id' => $user->id,
                    'specialization' => $request->specialization,
                ]);
            }

            DB::commit();

            $accessToken = JWTAuth::fromUser($user);

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'img' => $user->img ? asset("storage/{$user->img}") : null,
                ],
                'access_token' => $accessToken,

            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Registration failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * User login
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();


        return response()->json([
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'role' => $user->role,
                'img' => $user->img,
            ],
            'access_token' => $token,

        ]);
    }


    /**
     * User logout
     */
    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Logged out successfully.']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to logout.'], 500);
        }
    }
}
