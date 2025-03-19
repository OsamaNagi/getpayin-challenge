<?php

namespace App\Models;

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
