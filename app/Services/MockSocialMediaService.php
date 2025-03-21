<?php

namespace App\Services;

use App\Enums\PlatformType;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Sleep;
use Illuminate\Validation\ValidationException;

class MockSocialMediaService
{
    /**
     * @throws RequestException|ValidationException
     */
    public function publish(PlatformType $platform, array $data): array
    {
        $this->simulateNetworkLatency();

        Log::info('Publishing to platform', ['platform' => $platform->value, 'data' => $data]);

        // Check for rate limit
        if ($this->shouldSimulateRateLimit()) {
            $response = new \Illuminate\Http\Client\Response(
                new \GuzzleHttp\Psr7\Response(429, [], json_encode([
                    'success' => false,
                    'error' => 'rate_limit',
                    'retry_after' => 60,
                ]))
            );

            throw new RequestException($response);
        }

        // Check for validation error
        if ($this->shouldSimulateValidationError()) {
            $response = new \Illuminate\Http\Client\Response(
                new \GuzzleHttp\Psr7\Response(422, [], json_encode([
                    'success' => false,
                    'error' => 'validation_error',
                    'errors' => [
                        'content' => ['Content is too long for this platform'],
                    ],
                ]))
            );

            throw new RequestException($response);
        }

        // Check for server error
        if ($this->shouldSimulateServerError()) {
            $response = new \Illuminate\Http\Client\Response(
                new \GuzzleHttp\Psr7\Response(500, [], json_encode([
                    'success' => false,
                    'error' => 'server_error',
                    'message' => 'Internal server error',
                ]))
            );

            throw new RequestException($response);
        }

        // Simulate HTTP client response
        Http::fake([
            '*' => Http::response([
                'success' => true,
                'platform_post_id' => fake()->uuid(),
                'published_at' => now()->toIso8601String(),
            ], 200),
        ]);

        $response = Http::get('mock-url');

        // Throw exception if the response is not successful
        if (! $response->successful()) {
            throw new RequestException($response);
        }

        // Validate response data
        $responseData = $response->json();

        if (! isset($responseData['success'], $responseData['platform_post_id'], $responseData['published_at'])) {
            throw new RequestException($response, 'Invalid response format');
        }

        return $responseData;
    }

    private function simulateNetworkLatency(): void
    {
        Sleep::for(rand(100, 500))->milliseconds();
    }

    protected function shouldSimulateRateLimit(): bool
    {
        return false;
    }

    protected function shouldSimulateValidationError(): bool
    {
        return false;
    }

    protected function shouldSimulateServerError(): bool
    {
        return false;
    }
}
