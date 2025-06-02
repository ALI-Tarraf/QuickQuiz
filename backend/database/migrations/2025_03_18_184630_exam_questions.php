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
        Schema::create('exam_questions', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->unsignedBigInteger('exam_id'); // Foreign key to exams
            $table->unsignedBigInteger('question_id'); // Foreign key to question_bank
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('exam_id')->references('id')->on('exams')->onDelete('cascade');
            $table->foreign('question_id')->references('id')->on('question_bank')->onDelete('cascade');

            // Optional: Prevent duplicate question assignment
            $table->unique(['exam_id', 'question_id']);
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
