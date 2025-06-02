<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Middleware\HandleCors as Middleware;

class HandleCors extends Middleware
{
    protected function configureCors(Request $request): array
    {
        return [
            'paths' => ['api/*'],
            'allowed_methods' => ['*'],
            'allowed_origins' => ['http://localhost:3000'],
            'allowed_headers' => ['*'],
            'exposed_headers' => [],
            'max_age' => 0,
            'supports_credentials' => false,
        ];
    }
}
