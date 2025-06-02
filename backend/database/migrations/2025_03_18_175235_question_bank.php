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
        Schema::create('question_bank', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->unsignedBigInteger('subject_id'); // Foreign key to subjects
            $table->text('question_text'); // The question content
            $table->enum('type', ['mcq', 'true_false', 'short_answer'])->default('mcq'); // Type of question
            $table->integer('mark'); // Marks for the question
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
