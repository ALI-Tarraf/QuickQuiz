<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_attempts', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->unsignedBigInteger('student_id'); // Foreign key to users (students)
            $table->unsignedBigInteger('exam_id'); // Foreign key to exams
            $table->integer('attempt_number'); // Attempt number (1st, 2nd, etc.)
            $table->timestamp('started_at')->nullable(); // When the attempt started
            $table->timestamp('completed_at')->nullable(); // When the attempt finished
            $table->integer('score')->nullable(); // Final score of the attempt
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('exam_id')->references('id')->on('exams')->onDelete('cascade');

            // Prevent duplicate same attempt number
            $table->unique(['student_id', 'exam_id', 'attempt_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
