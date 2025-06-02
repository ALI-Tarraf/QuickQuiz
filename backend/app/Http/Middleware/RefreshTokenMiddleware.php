<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\Request;

class RefreshTokenMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $token = $request->cookie('access_token');
            if (!$token) {
                return response()->json(['error' => 'Token not found'], 401);
            }

            // Set the token for JWTAuth to parse
            JWTAuth::setToken($token);
            $user = JWTAuth::authenticate();

        } catch (TokenExpiredException $e) {
            // Access token expired, try refresh token
            $refreshToken = $request->cookie('refresh_token');

            if (!$refreshToken) {
                return response()->json(['error' => 'Refresh token not found'], 401);
            }

            try {
                JWTAuth::setToken($refreshToken);
                $newAccessToken = JWTAuth::refresh();

                // Optionally, refresh the refresh token too, or keep same
                // Here, just keep the refresh token as is

                // Set new access token cookie
                $accessTokenCookie = cookie('access_token', $newAccessToken, 15, null, null, true, true, false, 'Strict');

                // Continue request and attach new cookie
                $response = $next($request);
                return $response->cookie($accessTokenCookie);

            } catch (JWTException $ex) {
                return response()->json(['error' => 'Invalid refresh token'], 401);
            }
        } catch (JWTException $ex) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        return $next($request);
    }
}
