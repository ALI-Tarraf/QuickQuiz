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
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->letters()->numbers()->symbols()],
            'role' => 'required|in:student,teacher',
            'specialization' => 'required_if:role,1|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        DB::beginTransaction();

        try {
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);

            if ($user->role === 0) {
                Student::create(['user_id' => $user->id]);
            } else {
                Teacher::create([
                    'user_id' => $user->id,
                    'specialization' => $request->specialization,
                ]);
            }

            DB::commit();

            // Create tokens
         // Create tokens
$accessToken = JWTAuth::fromUser($user);
$refreshToken = JWTAuth::claims(['exp' => now()->addDays(7)->timestamp])->fromUser($user);

            // Create cookies (15 minutes for access token, 7 days for refresh token)
            $accessTokenCookie = cookie('access_token', $accessToken, 15, null, null, true, true, false, 'Strict');
            $refreshTokenCookie = cookie('refresh_token', $refreshToken, 60 * 24 * 7, null, null, true, true, false, 'Strict');

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'token_type' => 'bearer',
                'expires_in' => JWTAuth::factory()->getTTL() * 60
            ], 201)
            ->cookie($accessTokenCookie)
            ->cookie($refreshTokenCookie);

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

    // ✅ الطريقة الصحيحة لإنشاء refresh token
    $refreshToken = JWTAuth::setToken($token)->refresh();

    // Create cookies
    $accessTokenCookie = cookie('access_token', $token, 15, null, null, true, true, false, 'Strict');
    $refreshTokenCookie = cookie('refresh_token', $refreshToken, 60 * 24 * 7, null, null, true, true, false, 'Strict');

    return response()->json([
        'user' => [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'email' => $user->email,
            'role' => $user->role,
        ],
         'access_token' => $token,
        'token_type' => 'bearer',
        'expires_in' => JWTAuth::factory()->getTTL() * 60
    ])
    ->cookie($accessTokenCookie)
    ->cookie($refreshTokenCookie);
}


    /**
     * Refresh token endpoint
     */
    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return response()->json(['error' => 'Refresh token not found'], 401);
        }

        try {
            JWTAuth::setToken($refreshToken);
            $newAccessToken = JWTAuth::refresh();

            $accessTokenCookie = cookie('access_token', $newAccessToken, 15, null, null, true, true, false, 'Strict');

            // Optionally rotate refresh token or keep same
            // Here we keep same refresh token cookie

            return response()->json([
                'token_type' => 'bearer',
                'expires_in' => JWTAuth::factory()->getTTL() * 60,
            ])->cookie($accessTokenCookie);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid refresh token'], 401);
        }
    }

    /**
     * User logout
     */
    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());

            // Clear cookies
            $clearAccessToken = cookie()->forget('access_token');
            $clearRefreshToken = cookie()->forget('refresh_token');

            return response()->json(['message' => 'Logged out successfully.'])
                ->cookie($clearAccessToken)
                ->cookie($clearRefreshToken);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to logout.'], 500);
        }
    }
}
