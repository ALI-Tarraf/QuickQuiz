<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // public function up()
    // {
    //     Schema::table('exams', function (Blueprint $table) {
    //         $table->unsignedBigInteger('teacher_id')->after('id'); // ممكن تغيري الموقع
    //         $table->foreign('teacher_id')->references('id')->on('teachers')->onDelete('cascade');
    //     });
    // }

    // public function down()
    // {
    //     Schema::table('exams', function (Blueprint $table) {
    //         $table->dropForeign(['teacher_id']);
    //         $table->dropColumn('teacher_id');
    //     });
    // }
};
