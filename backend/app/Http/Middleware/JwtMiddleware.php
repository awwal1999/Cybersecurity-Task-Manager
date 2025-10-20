<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Verify token
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json([
                    'message' => 'User not found',
                ], 404);
            }

        } catch (TokenExpiredException $e) {
            return response()->json([
                'message' => 'Token has expired',
                'code' => 'TOKEN_EXPIRED',
            ], 401);

        } catch (TokenInvalidException $e) {
            return response()->json([
                'message' => 'Token is invalid',
                'code' => 'TOKEN_INVALID',
            ], 401);

        } catch (JWTException $e) {
            return response()->json([
                'message' => 'Token is missing',
                'code' => 'TOKEN_MISSING',
            ], 401);
        }

        return $next($request);
    }
}
