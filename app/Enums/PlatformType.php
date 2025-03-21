<?php

namespace App\Enums;

enum PlatformType: string
{
    case INSTAGRAM = 'instagram';
    case FACEBOOK = 'facebook';
    case TWITTER = 'twitter';
    case LINKEDIN = 'linkedin';

    public function label(): string
    {
        return match($this) {
            self::INSTAGRAM => 'Instagram',
            self::FACEBOOK => 'Facebook',
            self::TWITTER => 'Twitter',
            self::LINKEDIN => 'LinkedIn',
        };
    }

    public function icon(): string
    {
        return match($this) {
            self::INSTAGRAM => 'instagram',
            self::FACEBOOK => 'facebook',
            self::TWITTER => 'twitter',
            self::LINKEDIN => 'linkedin',
        };
    }

    public function isSocialMedia(): bool
    {
        return match($this) {
            self::INSTAGRAM, self::FACEBOOK, self::TWITTER, self::LINKEDIN => true,
            default => false,
        };
    }

    public function isBlogPlatform(): bool
    {
        return false;
    }
} 