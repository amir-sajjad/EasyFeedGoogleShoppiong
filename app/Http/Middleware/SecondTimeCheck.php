<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecondTimeCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if(auth()->user()->settings->setup):
            return redirect()->route('dashboard',['host' => $request['host'],'shop'=>$request['shop'], 'token'=>$request['token']]);
        else:
            return $next($request);
        endif;
    }
}
