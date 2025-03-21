<?php

use App\Actions\Post\ShowPostAction;
use App\Models\Platform;
use App\Models\Post;
use App\Models\User;

beforeEach(function () {
    $this->action = new ShowPostAction;
    $this->user = User::factory()->create();
});

test('it loads post with platforms', function () {
    $post = Post::factory()
        ->for($this->user)
        ->create();

    $platforms = Platform::factory()
        ->count(3)
        ->create();

    // Attach platforms to user and post
    $this->user->activePlatforms()->attach($platforms->pluck('id'));
    $post->platforms()->attach($platforms->pluck('id'));

    $result = $this->action->handle($post);

    expect($result->relationLoaded('platforms'))->toBeTrue()
        ->and($result->platforms)->toHaveCount(3);
});
