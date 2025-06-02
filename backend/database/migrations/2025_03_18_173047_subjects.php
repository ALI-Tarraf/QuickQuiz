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
        Schema::create('subjects', function (Blueprint $table) {
            $table->id(); // id INT AUTO_INCREMENT PRIMARY KEY
            $table->string('name', 100); // name VARCHAR(100)
            $table->text('description')->nullable(); // description TEXT (nullable if optional)
            $table->unsignedBigInteger('teacher_id'); // teacher_id INT (foreign key)
            $table->timestamps(); // created_at and updated_at

            // Foreign key constraint
            $table->foreign('teacher_id')->references('id')->on('users')->onDelete('cascade');
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
