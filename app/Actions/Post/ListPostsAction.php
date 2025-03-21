<?php

namespace App\Actions\Post;

use App\Models\Post;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListPostsAction
{
    /**
     * Handle the post listing.
     *
     * @param User $user
     * @param string|null $status
     * @param string|null $date
     * @return LengthAwarePaginator
     */
    public function handle(User $user, ?string $status = null, ?string $date = null): LengthAwarePaginator
    {
        $query = Post::with('platforms')
            ->where('user_id', $user->id)
            ->latest();

        if ($status) {
            $query->where('status', $status);
        }

        if ($date) {
            $query->whereDate('scheduled_time', $date);
        }

        return $query->paginate(10);
    }
} 