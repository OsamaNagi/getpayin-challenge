<?php

use App\Enums\PlatformStatus;
use App\Enums\PostStatus;
use App\Jobs\ProcessPost;
use App\Models\Platform;
use App\Models\Post;
use App\Models\User;
use App\Services\MockSocialMediaService;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Sleep;

test('post is published successfully to all platforms', function () {
    Sleep::fake();

    // Create test data
    $user = User::factory()->create();
    $platforms = Platform::factory()->count(2)->create();

    $post = Post::factory()
        ->for($user)
        ->create(['status' => PostStatus::SCHEDULED]);

    $post->platforms()->attach($platforms->pluck('id'));

    // Mock successful responses
    $mockService = mock(MockSocialMediaService::class);
    $mockService->expects('publish')
        ->times(2)
        ->andReturn([
            'success' => true,
            'platform_post_id' => fake()->uuid(),
            'published_at' => now()->toIso8601String(),
        ]);

    // Process the post
    (new ProcessPost($post))->handle($mockService);

    // Assert post status was updated
    expect($post->fresh()->status)->toBe(PostStatus::PUBLISHED);

    // Assert platform statuses were updated
    foreach ($platforms as $platform) {
        $pivot = $post->platforms()->where('platform_id', $platform->id)->first()->pivot;
        expect($pivot->platform_status)->toBe(PlatformStatus::PUBLISHED->value)
            ->and($pivot->platform_post_id)->not->toBeNull()
            ->and($pivot->published_at)->not->toBeNull();
    }
});

test('post handles validation errors (422)', function () {
    Sleep::fake();

    // Create test data
    $user = User::factory()->create();
    $platform = Platform::factory()->create();

    $post = Post::factory()
        ->for($user)
        ->create(['status' => PostStatus::SCHEDULED]);

    $post->platforms()->attach($platform->id);

    // Create a mock response for validation error
    $response = new \Illuminate\Http\Client\Response(new \GuzzleHttp\Psr7\Response(422, [], json_encode([
        'message' => 'The given data was invalid.',
        'errors' => [
            'content' => ['Content is too long for this platform'],
        ],
    ])));

    // Mock validation error response
    $mockService = mock(MockSocialMediaService::class);
    $mockService->expects('publish')
        ->andThrow(new RequestException($response));

    // Process the post
    (new ProcessPost($post))->handle($mockService);

    // Assert post status remains scheduled
    expect($post->fresh()->status)->toBe(PostStatus::SCHEDULED);

    // Assert platform status was updated
    $pivot = $post->platforms()->where('platform_id', $platform->id)->first()->pivot;
    expect($pivot->platform_status)->toBe(PlatformStatus::FAILED->value)
        ->and($pivot->error)->toContain('Content is too long for this platform');
});

test('post retries on rate limit (429)', function () {
    Sleep::fake();

    // Create test data
    $user = User::factory()->create();
    $platform = Platform::factory()->create();

    $post = Post::factory()
        ->for($user)
        ->create(['status' => PostStatus::SCHEDULED]);

    $post->platforms()->attach($platform->id);

    // Create a mock response for rate limit
    $response = new \Illuminate\Http\Client\Response(new \GuzzleHttp\Psr7\Response(429, [], json_encode([
        'message' => 'Too Many Requests',
        'retry_after' => 60,
    ])));

    // Mock rate limit response
    $mockService = mock(MockSocialMediaService::class);
    $mockService->expects('publish')
        ->andThrow(new RequestException($response));

    // Process the post
    (new ProcessPost($post))->handle($mockService);

    // Assert post status remains scheduled
    expect($post->fresh()->status)->toBe(PostStatus::SCHEDULED);
});

test('post handles server errors (500) after max retries', function () {
    Sleep::fake();

    // Create test data
    $user = User::factory()->create();
    $platform = Platform::factory()->create();

    $post = Post::factory()
        ->for($user)
        ->create(['status' => PostStatus::SCHEDULED]);

    $post->platforms()->attach($platform->id);

    // Create a mock response for server error
    $response = new \Illuminate\Http\Client\Response(new \GuzzleHttp\Psr7\Response(500, [], json_encode([
        'message' => 'Internal Server Error',
    ])));

    // Mock server error response
    $mockService = mock(MockSocialMediaService::class);
    $mockService->expects('publish')
        ->times(3) // Expect 3 attempts (initial + 2 retries)
        ->andThrow(new RequestException($response));

    // Process the post with max retries
    $job = new ProcessPost($post);

    // Simulate job being processed multiple times
    for ($attempt = 1; $attempt <= 3; $attempt++) {
        $job->handle($mockService);
    }

    // Assert post status remains scheduled
    expect($post->fresh()->status)->toBe(PostStatus::SCHEDULED);

    // Assert platform status was updated
    $pivot = $post->platforms()->where('platform_id', $platform->id)->first()->pivot;
    expect($pivot->platform_status)->toBe(PlatformStatus::FAILED->value)
        ->and($pivot->error)->toBe('Internal Server Error');
})->skip();
