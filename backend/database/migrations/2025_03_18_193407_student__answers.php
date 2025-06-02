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
        Schema::create('student_answers', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->unsignedBigInteger('attempt_id'); // Foreign key to student_attempts
            $table->unsignedBigInteger('question_id'); // Foreign key to question_bank
            $table->unsignedBigInteger('selected_option_id')->nullable(); // Foreign key to options (nullable for text answers)
            $table->text('text_answer')->nullable(); // For short answers or non-MCQ
            $table->boolean('is_correct')->nullable(); // Whether the answer is correct
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('attempt_id')->references('id')->on('student_attempts')->onDelete('cascade');
            $table->foreign('question_id')->references('id')->on('question_bank')->onDelete('cascade');
            $table->foreign('selected_option_id')->references('id')->on('options')->onDelete('set null');

            // Prevent duplicate answers
            $table->unique(['attempt_id', 'question_id']);
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
