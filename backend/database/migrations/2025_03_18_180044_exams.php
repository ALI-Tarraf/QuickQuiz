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
        Schema::create('exams', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('title', 100); // Exam title
            $table->unsignedBigInteger('subject_id'); // Foreign key to subjects
            $table->integer('total_marks'); // Total marks of the exam
            $table->integer('duration_minutes'); // Time limit for the exam in minutes
            $table->integer('max_attempts')->default(1); // Maximum allowed attempts
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('subject_id')->references('id')->on('subjects')->onDelete('cascade');
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
