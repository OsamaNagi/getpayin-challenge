<?php

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->post = Post::factory()->create(['user_id' => $this->user->id]);
    $this->otherUser = User::factory()->create();
    $this->otherPost = Post::factory()->create(['user_id' => $this->otherUser->id]);
});

test('user can view their own post', function () {
    $response = $this->actingAs($this->user)
        ->get(route('posts.show', $this->post));

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Posts/Show')
            ->has('post')
            ->where('post.id', $this->post->id)
        );
});

test('user cannot view another user\'s post', function () {
    $response = $this->actingAs($this->user)
        ->get(route('posts.show', $this->otherPost));

    $response->assertStatus(403);
});

test('user can delete their own post', function () {
    Storage::fake('public');
    $image = UploadedFile::fake()->image('post.jpg');
    $imagePath = 'posts/' . $image->hashName();
    $this->post->image_url = '/storage/' . $imagePath;
    $this->post->save();
    Storage::disk('public')->putFileAs('posts', $image, $image->hashName());

    $response = $this->actingAs($this->user)
        ->delete(route('posts.destroy', $this->post));

    $response->assertRedirect(route('posts.index'))
        ->assertSessionHas('success', 'Post deleted successfully.');

    $this->assertDatabaseMissing('posts', ['id' => $this->post->id]);
    Storage::disk('public')->assertMissing($imagePath);
});

test('user cannot delete another user\'s post', function () {
    $response = $this->actingAs($this->user)
        ->delete(route('posts.destroy', $this->otherPost));

    $response->assertStatus(403);
    $this->assertDatabaseHas('posts', ['id' => $this->otherPost->id]);
});