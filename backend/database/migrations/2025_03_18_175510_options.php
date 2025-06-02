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
        Schema::create('options', function (Blueprint $table) {
        $table->id(); // Primary key
        $table->unsignedBigInteger('question_id'); // Foreign key to question_bank
        $table->text('option_text'); // The text of the option/answer
        $table->boolean('is_correct')->default(false); // Whether this option is correct or not
        $table->timestamps();

        // Foreign key constraint
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
