<?php

namespace App\Jobs;

use App\Enums\PlatformStatus;
use App\Enums\PostStatus;
use App\Models\Post;
use App\Services\MockSocialMediaService;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\Response;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class ProcessPost implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private const MAX_RETRIES = 3;

    private const RATE_LIMIT_DELAY = 60; // seconds

    public function __construct(
        public readonly Post $post
    ) {}

    public function handle(MockSocialMediaService $socialMediaService): void
    {
        Log::info('Processing post', ['post_id' => $this->post->id]);

        foreach ($this->post->platforms as $platform) {
            try {
                $this->processPlatform($platform, $socialMediaService);
            } catch (ValidationException $e) {
                $this->markPlatformAsFailed($platform, $e->errors());

                return;
            } catch (RequestException $e) {
                if ($e->response->status() === 429) { // Rate limit
                    if ($this->attempts() < self::MAX_RETRIES) {
                        $this->release(self::RATE_LIMIT_DELAY);

                        return;
                    }
                    $this->markPlatformAsFailed($platform, 'Rate limit exceeded after maximum retries');

                    return;
                }

                if ($e->response->status() === 422) { // Validation
                    $this->markPlatformAsFailed($platform, $e->response->json('errors'));

                    return;
                }

                if ($this->attempts() < self::MAX_RETRIES) {
                    $this->release(self::RATE_LIMIT_DELAY);

                    return;
                }

                $this->markPlatformAsFailed($platform, $e->response->json('message') ?: 'Server error');

                return;
            } catch (Exception $e) {
                if ($this->attempts() < self::MAX_RETRIES) {
                    $this->release(self::RATE_LIMIT_DELAY);

                    return;
                }
                $this->markPlatformAsFailed($platform, $e->getMessage());

                return;
            }
        }

        $this->post->update(['status' => PostStatus::PUBLISHED]);
    }

    private function processPlatform($platform, MockSocialMediaService $socialMediaService): void
    {
        $key = "platform:{$platform->id}";

        if (RateLimiter::tooManyAttempts($key, 10)) {
            $response = new Response(new \GuzzleHttp\Psr7\Response(429, [], json_encode([
                'message' => 'Rate limit exceeded',
                'retry_after' => 60,
            ])));
            throw new RequestException($response);
        }

        $response = $socialMediaService->publish($platform->type, [
            'content' => $this->post->content,
            'image_url' => $this->post->image_url,
        ]);

        $this->markPlatformAsPublished($platform, $response);
        RateLimiter::hit($key);
    }

    private function markPlatformAsPublished($platform, array $response): void
    {
        $this->post->platforms()->updateExistingPivot($platform->id, [
            'platform_status' => PlatformStatus::PUBLISHED->value,
            'platform_post_id' => $response['platform_post_id'],
            'published_at' => $response['published_at'],
        ]);
    }

    private function markPlatformAsFailed($platform, string|array $error): void
    {
        $this->post->platforms()->updateExistingPivot($platform->id, [
            'platform_status' => PlatformStatus::FAILED->value,
            'error' => is_array($error) ? json_encode($error) : $error,
        ]);
    }
}
