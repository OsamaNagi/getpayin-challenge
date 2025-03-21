<?php

namespace App\Jobs;

use App\Enums\PostStatus;
use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessDuePosts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private const CHUNK_SIZE = 100;

    public function handle(): void
    {
        Log::info('Starting to process due posts');

        Post::query()
            ->where('status', PostStatus::SCHEDULED->value)
            ->where('scheduled_for', '<=', now())
            ->with(['user', 'platforms'])
            ->chunk(self::CHUNK_SIZE, function ($posts) {
                foreach ($posts as $post) {
                    ProcessPost::dispatch($post)->onQueue('posts');
                }
            });

        Log::info('Finished dispatching post processing jobs');
    }
} 