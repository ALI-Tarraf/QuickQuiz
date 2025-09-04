<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\OptionsController;
use App\Http\Controllers\ExamsController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\ExamResultController;
use App\Http\Controllers\QuestionsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StudentAnswersController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
|
| Routes accessible without authentication.
|
*/

// User registration
Route::post('/register', [AuthController::class, 'register']);

// User login
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Routes for Authenticated Users
|--------------------------------------------------------------------------
|
| Routes accessible only if the user is logged in (authenticated).
|
*/

// Logout route
Route::middleware('auth:api')->post('/logout', [AuthController::class, 'logout']);

// Get authenticated user info
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Routes only accessible to users with "admin" role.
|
*/
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    // Get all users (excluding self)
    Route::get('/users', [UserController::class, 'getUsers']);

    // Delete a specific user and related data
    Route::delete('user/{id}', [UserController::class, 'deleteUser']);


Route::post('/users/{id}/change-password', [UserController::class, 'changePassword']);

    // Example: Additional admin routes can be added here
    // Route::post('/subjects', [SubjectsController::class, 'createSubject']);
});

/*
|--------------------------------------------------------------------------
| Student Routes
|--------------------------------------------------------------------------
|
| Routes only accessible to users with "student" role.
|
*/
Route::middleware(['auth:api', 'role:student'])->group(function () {
    Route::prefix('/student/tests')->group(function () {
        // Get results for the authenticated student
        Route::get('/results', [ExamResultController::class, 'getStudentResults']);
    });
});

/*
|--------------------------------------------------------------------------
| Teacher Routes
|--------------------------------------------------------------------------
|
| Routes only accessible to users with "teacher" role.
|
*/
Route::middleware(['auth:api', 'role:teacher'])->group(function () {

    // Routes related to exams (tests)
    Route::prefix('tests')->group(function () {
        Route::post('/', [ExamsController::class, 'create']); // Create a new exam
        Route::get('/dashboard', [ExamsController::class, 'getUpcomingExamsToday']); // Get upcoming exams
        Route::get('/dashboard/{id}', [ExamsController::class, 'get']); // Get specific exam

        // Teacher exam results
        Route::get('/results', [ExamResultController::class, 'getTeacherExamResults']); // All results
        Route::get('/results/{examId}', [ExamResultController::class, 'getTeacherExamResultsById']); // Results by exam ID

        // Get questions of exams
        Route::get('/questions', [ExamsController::class, 'getQuestions']);

        // Update or delete exams
        Route::put('/{id}', [ExamsController::class, 'update']);
        Route::delete('/{id}', [ExamsController::class, 'destroy']);
    });

    // Routes related to questions
    Route::prefix('questions')->group(function () {
        Route::post('/', [QuestionsController::class, 'create']); // Create a new question
        Route::get('/', [QuestionsController::class, 'index']); // Get all questions
        Route::get('/{id}', [QuestionsController::class, 'show']); // Get specific question
        Route::put('/{id}', [QuestionsController::class, 'update']); // Update a question
        Route::delete('/{id}', [QuestionsController::class, 'destroy']); // Delete a question
    });

    // Routes related to options (answers choices)
    Route::prefix('options')->group(function () {
        Route::post('/', [OptionsController::class, 'create']); // Create a new option
        Route::get('/', [OptionsController::class, 'index']); // Get all options
        Route::get('/{id}', [OptionsController::class, 'show']); // Get specific option
        Route::put('/{id}', [OptionsController::class, 'update']); // Update an option
        Route::delete('/{id}', [OptionsController::class, 'destroy']); // Delete an option
    });
});

/*
|--------------------------------------------------------------------------
| Routes for All Authenticated Users (Students & Teachers)
|--------------------------------------------------------------------------
|
| Routes accessible to any authenticated user, e.g., taking exams.
|
*/
Route::prefix('tests')->middleware('auth:api')->group(function () {
    Route::get('/', [ExamsController::class, 'index']); // List all exams
    Route::get('/{id}', [ExamsController::class, 'show']); // Show specific exam
    Route::post('/answer/{examId}', [StudentAnswersController::class, 'create']); // Submit answers
});
