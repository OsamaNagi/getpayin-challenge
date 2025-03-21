<?php

use App\Enums\PlatformType;
use App\Services\MockSocialMediaService;
use Illuminate\Support\Sleep;

test('mock social media service simulates network latency', function () {
    Sleep::fake();

    $service = new MockSocialMediaService();
    $service->publish(PlatformType::INSTAGRAM, [
        'content' => 'Test content',
        'image_url' => 'https://example.com/image.jpg',
    ]);

    // Assert that Sleep was called with milliseconds between 100 and 500
    Sleep::assertSleptTimes(1);
    Sleep::assertSequence([
        fn ($duration) => $duration->milliseconds >= 100 && $duration->milliseconds <= 500,
    ]);
});

test('mock social media service returns successful response', function () {
    Sleep::fake();

    $service = new MockSocialMediaService();
    $response = $service->publish(PlatformType::INSTAGRAM, [
        'content' => 'Test content',
        'image_url' => 'https://example.com/image.jpg',
    ]);

    expect($response)
        ->toHaveKey('success', true)
        ->toHaveKey('platform_post_id')
        ->toHaveKey('published_at');
});

test('mock social media service can simulate rate limit', function () {
    Sleep::fake();
    
    // Mock rand to always return rate limit
    $mock = mock(MockSocialMediaService::class)
        ->makePartial()
        ->shouldAllowMockingProtectedMethods()
        ->expect(shouldSimulateRateLimit: fn () => true);

    $response = $mock->publish(PlatformType::INSTAGRAM, [
        'content' => 'Test content',
        'image_url' => 'https://example.com/image.jpg',
    ]);

    expect($response)
        ->toHaveKey('success', false)
        ->toHaveKey('error', 'rate_limit')
        ->toHaveKey('retry_after');
});

test('mock social media service can simulate validation error', function () {
    Sleep::fake();
    
    // Mock rand to always return validation error
    $mock = mock(MockSocialMediaService::class)
        ->makePartial()
        ->shouldAllowMockingProtectedMethods()
        ->expect(shouldSimulateValidationError: fn () => true);

    $response = $mock->publish(PlatformType::INSTAGRAM, [
        'content' => 'Test content',
        'image_url' => 'https://example.com/image.jpg',
    ]);

    expect($response)
        ->toHaveKey('success', false)
        ->toHaveKey('error', 'validation')
        ->toHaveKey('errors.content');
});

test('mock social media service can simulate server error', function () {
    Sleep::fake();
    
    // Mock rand to always return server error
    $mock = mock(MockSocialMediaService::class)
        ->makePartial()
        ->shouldAllowMockingProtectedMethods()
        ->expect(shouldSimulateServerError: fn () => true);

    $response = $mock->publish(PlatformType::INSTAGRAM, [
        'content' => 'Test content',
        'image_url' => 'https://example.com/image.jpg',
    ]);

    expect($response)
        ->toHaveKey('success', false)
        ->toHaveKey('error', 'server');
}); 