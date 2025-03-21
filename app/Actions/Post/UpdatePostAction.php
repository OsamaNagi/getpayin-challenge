<?php

namespace App\Actions\Post;

use App\Models\Post;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UpdatePostAction
{
    /**
     * Handle the post update.
     *
     * @param Post $post
     * @param array<string, mixed> $data
     * @param UploadedFile|null $image
     * @param bool $removeImage
     * @return Post
     */
    public function handle(Post $post, array $data, ?UploadedFile $image = null, bool $removeImage = false): Post
    {
        $imagePath = $post->image_url;
        
        if ($removeImage) {
            if ($post->image_url) {
                $oldPath = str_replace('/storage/', '', $post->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $imagePath = null;
        } elseif ($image) {
            if ($post->image_url) {
                $oldPath = str_replace('/storage/', '', $post->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $imagePath = Storage::url($image->store('post-images', 'public'));
        }

        $post->update([
            'title' => $data['title'],
            'content' => $data['content'],
            'image_url' => $imagePath,
            'scheduled_time' => $data['scheduled_time'],
        ]);

        $platformData = array_fill_keys($data['platforms'], [
            'platform_status' => 'pending',
        ]);

        $post->platforms()->sync($platformData);

        return $post;
    }
} 