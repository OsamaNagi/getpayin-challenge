<?php

namespace App\Http\Controllers;

use App\Actions\Post\CreatePostAction;
use App\Actions\Post\DeletePostAction;
use App\Actions\Post\ListPostsAction;
use App\Actions\Post\ShowPostAction;
use App\Actions\Post\UpdatePostAction;
use App\Http\Requests\Post\CreatePostRequest;
use App\Http\Requests\Post\DeletePostRequest;
use App\Http\Requests\Post\ListPostsRequest;
use App\Http\Requests\Post\ShowPostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Display a listing of the posts.
     */
    public function index(ListPostsRequest $request, ListPostsAction $action)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $posts = $action->handle(
            $user,
            $request->input('status'),
            $request->input('date')
        );

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Show the form for creating a new post.
     */
    public function create()
    {
        // Get only the activated platforms for the current user
        $activePlatforms = auth()->user()->activePlatforms;

        return Inertia::render('Posts/Create', [
            'platforms' => $activePlatforms,
        ]);
    }

    /**
     * Store a newly created post in storage.
     */
    public function store(CreatePostRequest $request, CreatePostAction $action)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $action->handle(
            $user,
            $request->validated(),
            $request->file('image')
        );

        return redirect()->route('posts.index')
            ->with('success', 'Post scheduled successfully.');
    }

    /**
     * Show the form for editing the specified post.
     */
    public function edit(Post $post)
    {
        // Ensure the post belongs to the authenticated user
        if ($post->user_id !== auth()->id()) {
            abort(403);
        }

        $post->load('platforms');
        $activePlatforms = auth()->user()->activePlatforms;

        return Inertia::render('Posts/Edit', [
            'post' => $post,
            'platforms' => $activePlatforms,
        ]);
    }

    /**
     * Update the specified post in storage.
     */
    public function update(UpdatePostRequest $request, Post $post, UpdatePostAction $action)
    {
        // Ensure the post belongs to the authenticated user
        if ($post->user_id !== auth()->id()) {
            abort(403);
        }

        // Only allow editing if post is in draft or scheduled state
        if (!in_array($post->status, ['draft', 'scheduled'])) {
            return back()->with('error', 'Cannot edit a published post.');
        }

        $action->handle(
            $post,
            $request->validated(),
            $request->file('image'),
            $request->boolean('remove_image')
        );

        return redirect()->route('posts.index')
            ->with('success', 'Post updated successfully.');
    }

    /**
     * Remove the specified post from storage.
     */
    public function destroy(DeletePostRequest $request, Post $post, DeletePostAction $action)
    {
        $action->handle($post);

        return redirect()->route('posts.index')
            ->with('success', 'Post deleted successfully.');
    }

    /**
     * Display the specified post.
     */
    public function show(ShowPostRequest $request, Post $post, ShowPostAction $action)
    {
        $post = $action->handle($post);
        
        return Inertia::render('Posts/Show', [
            'post' => $post
        ]);
    }
}
