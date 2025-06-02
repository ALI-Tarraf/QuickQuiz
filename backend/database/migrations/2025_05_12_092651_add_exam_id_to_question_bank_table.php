<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('question_bank', function (Blueprint $table) {
            // إضافة العمود exam_id
            $table->unsignedBigInteger('exam_id')->after('id'); // أو حسب ترتيبك

            // إنشاء المفتاح الأجنبي
            $table->foreign('exam_id')
                  ->references('id')
                  ->on('exams')
                  ->onDelete('cascade'); // لحذف الأسئلة إذا انحذف الامتحان
        });
    }

    public function down()
    {
        Schema::table('question_bank', function (Blueprint $table) {
            $table->dropForeign(['exam_id']);
            $table->dropColumn('exam_id');
        });
    }
};
