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
     * Register new user (Student or Teacher)
     */
    public function register(Request $request)
    {
        //  Validate user input
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users',
            'password'   => ['required', Password::min(8)->mixedCase()->letters()->numbers()->symbols()],
            'role'       => 'required|in:student,teacher', // only student or teacher allowed
            'img'        => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'specialization' => 'required_if:role,teacher|string|max:255', // required if role = teacher
        ]);

        if ($validator->fails()) {
            //  Return validation errors
            return response()->json($validator->errors(), 422);
        }

        //  Save uploaded image to storage/app/public/images (optional)
        $imgPath = null;
        if ($request->hasFile('img')) {
           $imgPath = $request->file('img')->store('images', 'public');
        }

        DB::beginTransaction(); // start database transaction

        try {
            //  Create user in "users" table
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name'  => $request->last_name,
                'email'      => $request->email,
                'password'   => Hash::make($request->password), // hash the password
                'role'       => $request->role,
                'img'        => $imgPath ?? null,
            ]);

            //  If user is a student → create record in "students" table
            if ($user->role === 'student') {
                Student::create(['user_id' => $user->id]);
            }
            //  If user is a teacher → create record in "teachers" table
            else {
                Teacher::create([
                    'user_id' => $user->id,
                    'specialization' => $request->specialization,
                ]);
            }

            DB::commit(); // commit transaction

            //  Generate JWT access token for the newly registered user
            $accessToken = JWTAuth::fromUser($user);

            //  Return user info + token in JSON response
            return response()->json([
                'user' => [
                    'id'         => $user->id,
                    'first_name' => $user->first_name,
                    'last_name'  => $user->last_name,
                    'email'      => $user->email,
                    'role'       => $user->role,
                    'img'        => $user->img
                ],
                'access_token' => $accessToken,

            ], 201);

        } catch (\Exception $e) {
            //  Rollback transaction in case of error
            DB::rollBack();
            return response()->json(['error' => 'Registration failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * User login
     */
    public function login(Request $request)
    {
        //  Get login credentials from request
        $credentials = $request->only('email', 'password');

        //  If login fails → return error
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        //  Get authenticated user
        $user = Auth::user();

        //  Return user info + JWT token
        return response()->json([
            'user' => [
                'id'         => $user->id,
                'first_name' => $user->first_name,
                'last_name'  => $user->last_name,
                'role'       => $user->role,
                'img'        => $user->img,
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
            //  Invalidate current JWT token (user logged out)
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Logged out successfully.']);
        } catch (\Exception $e) {
            //  Failed to logout
            return response()->json(['error' => 'Failed to logout.'], 500);
        }
    }
}
