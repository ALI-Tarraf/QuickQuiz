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
    Schema::table('student_answers', function (Blueprint $table) {
      //  $table->dropColumn('attempt_id');
        $table->unsignedBigInteger('student_id')->after('id');

        // Optional: add foreign key if needed
        $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
    });
}

public function down()
{
    Schema::table('student_answers', function (Blueprint $table) {
        $table->dropForeign(['student_id']);
        $table->dropColumn('student_id');
        $table->unsignedBigInteger('attempt_id')->after('id');
    });
}

};
