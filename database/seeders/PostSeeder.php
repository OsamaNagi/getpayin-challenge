<?php

namespace Database\Seeders;

use App\Enums\PlatformStatus;
use App\Enums\PostStatus;
use App\Models\Platform;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create users if they don't exist
        if (User::count() === 0) {
            User::factory()->count(3)->create();
        }

        // Create platforms if they don't exist
        if (Platform::count() === 0) {
            Platform::factory()->count(4)->create();
        }

        $users = User::all();
        $platforms = Platform::all();

        // Create posts with different statuses and platform relationships
        foreach ($users as $user) {
            // Create draft posts
            Post::factory()
                ->count(2)
                ->for($user)
                ->create(['status' => PostStatus::DRAFT])
                ->each(function (Post $post) use ($platforms) {
                    // Attach random platforms (1-3) to each post
                    $post->platforms()->attach(
                        $platforms->random(rand(1, 3))->pluck('id')->mapWithKeys(function ($id) {
                            return [$id => [
                                'platform_status' => PlatformStatus::PENDING->value,
                            ]];
                        })
                    );
                });

            // Create scheduled posts for today
            Post::factory()
                ->count(5)
                ->for($user)
                ->create([
                    'status' => PostStatus::SCHEDULED,
                    'scheduled_time' => now()->addHours(rand(1, 8)),
                ])
                ->each(function (Post $post) use ($platforms) {
                    // Attach random platforms (2-4) to each post
                    $post->platforms()->attach(
                        $platforms->random(rand(2, 4))->pluck('id')->mapWithKeys(function ($id) {
                            return [$id => [
                                'platform_status' => PlatformStatus::PENDING->value,
                            ]];
                        })
                    );
                });

            // Create scheduled posts for tomorrow
            Post::factory()
                ->count(3)
                ->for($user)
                ->create([
                    'status' => PostStatus::SCHEDULED,
                    'scheduled_time' => now()->addDay()->addHours(rand(9, 17)),
                ])
                ->each(function (Post $post) use ($platforms) {
                    // Attach random platforms (2-4) to each post
                    $post->platforms()->attach(
                        $platforms->random(rand(2, 4))->pluck('id')->mapWithKeys(function ($id) {
                            return [$id => [
                                'platform_status' => PlatformStatus::PENDING->value,
                            ]];
                        })
                    );
                });

            // Create scheduled posts for next week
            Post::factory()
                ->count(4)
                ->for($user)
                ->create([
                    'status' => PostStatus::SCHEDULED,
                    'scheduled_time' => now()->addDays(rand(2, 7))->addHours(rand(9, 17)),
                ])
                ->each(function (Post $post) use ($platforms) {
                    // Attach random platforms (2-4) to each post
                    $post->platforms()->attach(
                        $platforms->random(rand(2, 4))->pluck('id')->mapWithKeys(function ($id) {
                            return [$id => [
                                'platform_status' => PlatformStatus::PENDING->value,
                            ]];
                        })
                    );
                });

            // Create published posts with mixed platform statuses
            Post::factory()
                ->count(5)
                ->for($user)
                ->create(['status' => PostStatus::PUBLISHED])
                ->each(function (Post $post) use ($platforms) {
                    // Attach all platforms with different statuses
                    $post->platforms()->attach(
                        $platforms->pluck('id')->mapWithKeys(function ($id) {
                            return [$id => [
                                'platform_status' => fake()->randomElement([
                                    PlatformStatus::PUBLISHED->value,
                                    PlatformStatus::FAILED->value,
                                ]),
                                'platform_post_id' => fake()->uuid(),
                                'published_at' => now()->subMinutes(rand(1, 60)),
                                'error' => fake()->boolean(20) ? fake()->sentence() : null,
                            ]];
                        })
                    );
                });
        }
    }
} 