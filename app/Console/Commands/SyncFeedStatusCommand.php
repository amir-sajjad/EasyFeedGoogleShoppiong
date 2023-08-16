<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\FeedSetting;
use Illuminate\Console\Command;
use App\Jobs\GetPromotionDetails;
use App\Jobs\SyncSingleFeedStatusJob;

class SyncFeedStatusCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:feed-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Feed Status Update Command';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $users = User::whereNull('deleted_at')->whereNotNull('password')
            ->whereHas('settings', function ($query) {
                $query->whereNotNull('merchantAccountId');
                $query->where('setup', 1);
            })->get();
        foreach ($users as $user) {
            $feeds = FeedSetting::where('user_id', $user->id)->get();
            foreach ($feeds as $feed) {
                SyncSingleFeedStatusJob::dispatch($user, $feed, false)->onQueue('googleStatus');
            }
            sleep(3);
        }
        GetPromotionDetails::dispatch();
        return Command::SUCCESS;
    }
}
