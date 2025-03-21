<?php

use App\Actions\Post\DeletePostAction;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->action = new DeletePostAction();
    $this->user = User::factory()->create();
});

test('it deletes post without image', function () {
    $post = Post::factory()
        ->for($this->user)
        ->create();

    $this->action->handle($post);

    expect(Post::find($post->id))->toBeNull();
});

test('it deletes post with image', function () {
    Storage::fake('public');
    
    $post = Post::factory()
        ->for($this->user)
        ->create([
            'image_url' => '/storage/post-images/test.jpg',
        ]);
    
    Storage::disk('public')->put('post-images/test.jpg', 'fake image content');
    
    $this->action->handle($post);

    expect(Post::find($post->id))->toBeNull()
        ->and(Storage::disk('public')->exists('post-images/test.jpg'))->toBeFalse();
}); 