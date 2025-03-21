<?php

namespace App\Models;

use App\Enums\PlatformType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Platform extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'type',
        'credentials',
        'user_id',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'type' => PlatformType::class,
        'credentials' => 'json',
        'is_active' => 'boolean',
    ];

    /**
     * The posts that are scheduled for this platform.
     */
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'post_platform')
            ->withPivot('platform_status')
            ->withTimestamps();
    }

    public function activeUsers()
    {
        return $this->belongsToMany(User::class, 'user_platform')->withTimestamps();
    }
}
