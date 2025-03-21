<?php

namespace Database\Factories;

use App\Enums\PlatformType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Platform>
 */
class PlatformFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(PlatformType::cases());
        
        return [
            'name' => $type->label(),
            'type' => $type->value,
            'credentials' => json_encode(['token' => fake()->uuid()]),
            'user_id' => User::factory(),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the platform is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the platform is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
} 