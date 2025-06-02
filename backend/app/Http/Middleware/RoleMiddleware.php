<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
  public function handle(Request $request, Closure $next, $role)
{
    $user = Auth::user();
    Log::info('User trying to access route', ['id' => $user?->id, 'role' => $user?->role]);

    if (!$user || $user->role != $role) {
        return response()->json(['message' => 'Unauthorized.'], 403);
    }

    return $next($request);
}

}
