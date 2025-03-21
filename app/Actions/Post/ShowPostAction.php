<?php

namespace App\Actions\Post;

use App\Models\Post;

class ShowPostAction
{
    /**
     * Handle the post retrieval.
     *
     * @param Post $post
     * @return Post
     */
    public function handle(Post $post): Post
    {
        return $post->load('platforms');
    }
} 