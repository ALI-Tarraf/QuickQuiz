<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getUser(Request $request)
    {
        return response()->json(Auth::user());
    }
    // public function getUser(Request $request)
    // {
    //     return response()->json(Auth::user());
    // }
    // public function getUser(Request $request)
    // {
    //     return response()->json(Auth::user());
    // }

}
