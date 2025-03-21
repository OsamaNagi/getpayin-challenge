<?php

use App\Enums\PostStatus;
use App\Jobs\ProcessDuePosts;
use App\Jobs\ProcessPost;
use App\Models\Platform;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Queue;

test('process due posts dispatches individual post jobs', function () {
    Queue::fake();

    // Create a user with active platforms
    $user = User::factory()->create();
    $platforms = Platform::factory()->count(3)->create();
    $user->activePlatforms()->attach($platforms->pluck('id'));

    // Create scheduled posts
    $posts = Post::factory()
        ->count(5)
        ->for($user)
        ->create([
            'status' => PostStatus::SCHEDULED,
            'scheduled_time' => now()->subHour(),
        ]);

    // Attach platforms to posts
    foreach ($posts as $post) {
        $post->platforms()->attach($platforms->pluck('id'));
    }

    // Run the job
    (new ProcessDuePosts)->handle();

    // Assert that individual post jobs were dispatched
    Queue::assertPushed(ProcessPost::class, 5);

    // Assert each post was queued with correct data
    foreach ($posts as $post) {
        Queue::assertPushed(function (ProcessPost $job) use ($post) {
            return $job->post->id === $post->id;
        });
    }

    // Assert jobs were pushed to the correct queue
    Queue::assertPushedOn('posts', ProcessPost::class);
});
