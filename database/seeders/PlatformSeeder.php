<?php

namespace Database\Seeders;

use App\Models\Platform;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlatformSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $platforms = [
            [
                'name' => 'Twitter',
                'type' => 'twitter',
            ],
            [
                'name' => 'Instagram',
                'type' => 'instagram',
            ],
            [
                'name' => 'Facebook',
                'type' => 'facebook',
            ],
            [
                'name' => 'LinkedIn',
                'type' => 'linkedin',
            ],
        ];

        foreach ($platforms as $platform) {
            Platform::updateOrCreate(
                ['type' => $platform['type']],
                $platform
            );
        }
    }
}
