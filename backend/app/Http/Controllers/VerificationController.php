<?php

namespace App\Http\Controllers;

use App\Mail\VerifyCodeMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class VerificationController extends Controller
{
    public function sendVerificationCode(Request $request)
    {
        $code = rand(100000, 999999); // رمز عشوائي 6 أرقام

        // خزن الكود بالـ session للمقارنة لاحقاً
        $request->session()->put('verification_code', $code);

        Mail::to($request->email)->send(new VerifyCodeMail($code));

        return response()->json(['message' => 'تم إرسال رمز التحقق إلى بريدك الإلكتروني']);
    }

    public function verifyCode(Request $request)
    {
        $storedCode = $request->session()->get('verification_code');

        if ($request->code == $storedCode) {
            return response()->json(['message' => 'تم التحقق بنجاح']);
        }

        return response()->json(['error' => 'رمز غير صحيح'], 400);
    }
}
