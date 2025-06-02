<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::rename('student_attempts', 'student_results');
}

public function down()
{
    Schema::rename('student_results', 'student_attempts');
}

};
