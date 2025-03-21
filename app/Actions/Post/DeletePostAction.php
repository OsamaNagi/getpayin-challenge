<?php

namespace App\Actions\Post;

use App\Models\Post;
use Illuminate\Support\Facades\Storage;

class DeletePostAction
{
    /**
     * Handle the post deletion.
     *
     * @param Post $post
     * @return void
     */
    public function handle(Post $post): void
    {
        if ($post->image_url) {
            $imagePath = str_replace('/storage/', '', $post->image_url);
            Storage::disk('public')->delete($imagePath);
        }

        $post->delete();
    }
} 