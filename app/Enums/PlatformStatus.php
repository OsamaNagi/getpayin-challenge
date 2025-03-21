<?php

namespace App\Enums;

enum PlatformStatus: string
{
    case PENDING = 'pending';
    case SCHEDULED = 'scheduled';
    case PUBLISHED = 'published';
    case FAILED = 'failed';

    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Pending',
            self::SCHEDULED => 'Scheduled',
            self::PUBLISHED => 'Published',
            self::FAILED => 'Failed',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::PENDING => 'yellow',
            self::SCHEDULED => 'blue',
            self::PUBLISHED => 'green',
            self::FAILED => 'red',
        };
    }
} 