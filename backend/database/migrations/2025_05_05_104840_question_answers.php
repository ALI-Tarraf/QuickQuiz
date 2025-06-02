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
        Schema::create('question_answers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('question_id');
            $table->text('answer_text'); // نص الإجابة أو الخيار
            $table->boolean('is_correct')->default(false); // لتحديد إذا هذا الخيار صحيح (لـ mcq و true_false)
            $table->timestamps();

            $table->foreign('question_id')->references('id')->on('question_bank')->onDelete('cascade');
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
