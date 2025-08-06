<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\OptionsController;
use App\Http\Controllers\ExamsController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectsController;
use App\Http\Controllers\QuestionsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\StudentAnswersController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\ExamResultController;
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:api')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


// Routes for admin
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::get('/users', [UserController::class, 'getUsers']);
      Route::delete('user/{id}', [UserController::class, 'deleteUser']);


});
// Routes for students
Route::middleware(['auth:api', 'role:student'])->group(function () {
    Route::get('/student/dashboard', [StudentController::class, 'dashboard']);
    Route::get('/student/profile', [StudentController::class, 'profile']);

    Route::prefix('/student/tests')->group(function () {

    Route::get('/results', [ExamResultController::class, 'getStudentResults']);

    });
});
// Routes for teachers
Route::middleware(['auth:api','role:teacher'])->group(function () {
    Route::get('/teacher/dashboard', [TeacherController::class, 'dashboard']);
    Route::get('/teacher/profile', [TeacherController::class, 'profile']);
    Route::prefix('tests')->group(function () {
        Route::post('/', [ExamsController::class, 'create']);
        Route::get('/dashboard', [ExamsController::class, 'getUpcomingExamsToday']);
        Route::get('/dashboard/{id}', [ExamsController::class, 'get']);

    Route::get('/results', [ExamResultController::class, 'getTeacherExamResults']);
    Route::get('/results/{examId}', [ExamResultController::class, 'getTeacherExamResultsById']);
    Route::get('/questions', [ExamsController::class, 'getQuestions']);
    Route::put('/{id}', [ExamsController::class, 'update']);
    Route::delete('/{id}', [ExamsController::class, 'destroy']);
});
    Route::prefix('questions')->group(function () {
        Route::post('/', [QuestionsController::class, 'create']);
        Route::get('/', [QuestionsController::class, 'index']);
        Route::get('/{id}', [QuestionsController::class, 'show']);
        Route::put('/{id}', [QuestionsController::class, 'update']);
        Route::delete('/{id}', [QuestionsController::class, 'destroy']);
    });
    Route::prefix('options')->group(function () {
        Route::post('/', [OptionsController::class, 'create']);
        Route::get('/', [OptionsController::class, 'index']);
        Route::get('/{id}', [OptionsController::class, 'show']);
    Route::put('/{id}', [OptionsController::class, 'update']);
    Route::delete('/{id}', [OptionsController::class, 'destroy']);
});
});


//Routs for users
Route::prefix('tests')->middleware('auth:api')->group(function () {
    Route::get('/', [ExamsController::class, 'index']);
     Route::get('/{id}', [ExamsController::class, 'show']);
    Route::post('/answer/{examId}', [StudentAnswersController::class, 'create']);
});
// Routes for admins
// Route::middleware(['auth:api', 'role:admin'])->group(function () {
//     Route::post('/subjects', [SubjectsController::class, 'createSubject']);
// });
