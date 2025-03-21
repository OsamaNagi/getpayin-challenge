<?php

use App\Enums\PlatformType;
use App\Services\MockSocialMediaService;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Sleep;

test('mock social media service simulates network latency', function () {
    Sleep::fake();

    $service = new MockSocialMediaService;
    $service->publish(PlatformType::INSTAGRAM, [
        'content' => 'Test content',
        'image_url' => 'https://example.com/image.jpg',
    ]);

    // Assert that Sleep was called with milliseconds between 100 and 500
    Sleep::assertSleptTimes(1);
    Sleep::assertSlept(function ($duration) {
        return $duration->milliseconds >= 100 && $duration->milliseconds <= 500;
    });
});

test('mock social media service returns successful response', function () {
    Sleep::fake();

    $service = new MockSocialMediaService;
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

    // Mock the service to simulate rate limit
    $mock = mock(MockSocialMediaService::class)
        ->makePartial()
        ->shouldAllowMockingProtectedMethods()
        ->shouldReceive('shouldSimulateRateLimit')
        ->once()
        ->andReturn(true)
        ->getMock();

    try {
        $mock->publish(PlatformType::INSTAGRAM, [
            'content' => 'Test content',
            'image_url' => 'https://example.com/image.jpg',
        ]);

        $this->fail('Expected RequestException was not thrown');
    } catch (RequestException $e) {
        $response = $e->response->json();
        test()->assertArrayHasKey('success', $response);
        test()->assertArrayHasKey('error', $response);
        test()->assertArrayHasKey('retry_after', $response);
        test()->assertEquals(false, $response['success']);
        test()->assertEquals('rate_limit', $response['error']);
        test()->assertEquals(60, $response['retry_after']);
    }
});

test('mock social media service can simulate validation error', function () {
    Sleep::fake();

    // Mock the service to simulate validation error
    $mock = mock(MockSocialMediaService::class)
        ->makePartial()
        ->shouldAllowMockingProtectedMethods()
        ->shouldReceive('shouldSimulateValidationError')
        ->once()
        ->andReturn(true)
        ->getMock();

    try {
        $mock->publish(PlatformType::INSTAGRAM, [
            'content' => 'Test content',
            'image_url' => 'https://example.com/image.jpg',
        ]);

        $this->fail('Expected RequestException was not thrown');
    } catch (RequestException $e) {
        $response = $e->response->json();
        test()->assertArrayHasKey('success', $response);
        test()->assertArrayHasKey('error', $response);
        test()->assertArrayHasKey('errors', $response);
        test()->assertEquals(false, $response['success']);
        test()->assertEquals('validation_error', $response['error']);
        test()->assertArrayHasKey('content', $response['errors']);
        test()->assertEquals(['Content is too long for this platform'], $response['errors']['content']);
    }
});

test('mock social media service can simulate server error', function () {
    Sleep::fake();

    // Mock the service to simulate server error
    $mock = mock(MockSocialMediaService::class)
        ->makePartial()
        ->shouldAllowMockingProtectedMethods()
        ->shouldReceive('shouldSimulateServerError')
        ->once()
        ->andReturn(true)
        ->getMock();

    try {
        $mock->publish(PlatformType::INSTAGRAM, [
            'content' => 'Test content',
            'image_url' => 'https://example.com/image.jpg',
        ]);

        $this->fail('Expected RequestException was not thrown');
    } catch (RequestException $e) {
        $response = $e->response->json();
        test()->assertArrayHasKey('success', $response);
        test()->assertArrayHasKey('error', $response);
        test()->assertArrayHasKey('message', $response);
        test()->assertEquals(false, $response['success']);
        test()->assertEquals('server_error', $response['error']);
        test()->assertEquals('Internal server error', $response['message']);
        test()->assertEquals(500, $e->response->status());
    }
});
