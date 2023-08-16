<?php

namespace App\Jobs;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Bus\Queueable;
use App\Http\Traits\GoogleApiTrait;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class GetPromotionDetails implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, GoogleApiTrait;

    /**
     * Create a new job instance.
     *
     * @return void
     */

    public $timeout = 9000;
    public $tries = 1;
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $shops = User::whereNotNull('password')
            ->whereHas('settings', function ($query) {
                $query->whereNotNull('merchantAccountId');
                $query->where('setup', 1);
            })
            ->has('promotions')
            ->with('promotions')
            ->get();


        foreach ($shops as $user) :
            $chunkLimit = 10;
            foreach ($user->promotions->chunk($chunkLimit) as $chunk) :
                $this->getPromotionDetails($chunk, $user);
            endforeach;
        // $user->touch();
        endforeach;
    }
}
