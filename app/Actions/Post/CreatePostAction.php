<?php

namespace App\Actions\Post;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CreatePostAction
{
    /**
     * Handle the post creation.
     *
     * @param User $user
     * @param array<string, mixed> $data
     * @param UploadedFile|null $image
     * @return Post
     */
    public function handle(User $user, array $data, ?UploadedFile $image = null): Post
    {
        $imagePath = null;
        if ($image) {
            $imagePath = Storage::url($image->store('post-images', 'public'));
        }

        $post = Post::create([
            'title' => $data['title'],
            'content' => $data['content'],
            'image_url' => $imagePath,
            'scheduled_time' => $data['scheduled_time'],
            'status' => 'scheduled',
            'user_id' => $user->id,
        ]);

        foreach ($data['platforms'] as $platformId) {
            $post->platforms()->attach($platformId, [
                'platform_status' => 'pending',
            ]);
        }

        return $post;
    }
} 