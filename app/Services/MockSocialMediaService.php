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

        // Simulate HTTP client response
        $response = Http::response([
            'success' => true,
            'platform_post_id' => fake()->uuid(),
            'published_at' => now()->toIso8601String(),
        ], 200);

        // Throw exception if the response is not successful
        if (!$response->successful()) {
            throw new RequestException($response);
        }

        // Validate response data
        $responseData = $response->json();

        if (!isset($responseData['success'], $responseData['platform_post_id'], $responseData['published_at'])) {
            throw new RequestException($response, 'Invalid response format');
        }

        return $responseData;
    }

    private function simulateNetworkLatency(): void
    {
        Sleep::for(rand(100, 500))->milliseconds();
    }
} 