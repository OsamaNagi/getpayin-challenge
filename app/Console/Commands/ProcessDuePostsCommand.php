<?php

namespace App\Console\Commands;

use App\Jobs\ProcessDuePosts;
use Illuminate\Console\Command;

class ProcessDuePostsCommand extends Command
{
    protected $signature = 'posts:process-due';
    protected $description = 'Process all posts that are due to be published';

    public function handle(): int
    {
        $this->info('Dispatching due posts processing job...');

        ProcessDuePosts::dispatch();

        $this->info('Due posts processing job dispatched successfully.');

        return Command::SUCCESS;
    }
} 