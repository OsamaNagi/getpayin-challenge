<?php

namespace App\Enums;

enum PostStatus: string
{
    case DRAFT = 'draft';
    case SCHEDULED = 'scheduled';
    case PUBLISHED = 'published';

    public function label(): string
    {
        return match($this) {
            self::DRAFT => 'Draft',
            self::SCHEDULED => 'Scheduled',
            self::PUBLISHED => 'Published',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::DRAFT => 'gray',
            self::SCHEDULED => 'blue',
            self::PUBLISHED => 'green',
        };
    }
} 