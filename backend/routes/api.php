<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1');

    Route::middleware('jwt.auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

Route::middleware('jwt.auth')->group(function () {
    Route::apiResource('tasks', TaskController::class);
    Route::patch('tasks/{task}/complete', [TaskController::class, 'markComplete']);
    Route::patch('tasks/{task}/reopen', [TaskController::class, 'reopen']);
});
