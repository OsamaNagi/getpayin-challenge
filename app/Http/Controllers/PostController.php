<?php

namespace App\Http\Controllers;

use App\Models\Platform;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Display a listing of the posts.
     */
    public function index(Request $request)
    {
        $status = $request->input('status');
        $date = $request->input('date');

        $query = Post::with('platforms')
            ->where('user_id', auth()->id())
            ->latest();

        if ($status) {
            $query->where('status', $status);
        }

        if ($date) {
            $query->whereDate('scheduled_time', $date);
        }

        $posts = $query->paginate(10);

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
    public function store(Request $request)
    {
        // Validate the post data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            'scheduled_time' => 'required|date|after:now',
            'platforms' => 'required|array|min:1',
            'platforms.*' => 'exists:platforms,id',
        ]);

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('post-images', 'public');
        }

        // Create the post
        $post = Post::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'image_url' => $imagePath ? Storage::url($imagePath) : null,
            'scheduled_time' => $validated['scheduled_time'],
            'status' => 'scheduled',
            'user_id' => auth()->id(),
        ]);

        // Attach selected platforms
        foreach ($validated['platforms'] as $platformId) {
            $post->platforms()->attach($platformId, [
                'platform_status' => 'pending',
            ]);
        }

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
    public function update(Request $request, Post $post)
    {
        // Ensure the post belongs to the authenticated user
        if ($post->user_id !== auth()->id()) {
            abort(403);
        }

        // Validate the post data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            'remove_image' => 'boolean',
            'scheduled_time' => 'required|date',
            'platforms' => 'required|array|min:1',
            'platforms.*' => 'exists:platforms,id',
        ]);

        // Only allow editing if post is in draft or scheduled state
        if (!in_array($post->status, ['draft', 'scheduled'])) {
            return back()->with('error', 'Cannot edit a published post.');
        }

        // Handle image upload or removal
        $imagePath = $post->image_url;
        
        if ($request->boolean('remove_image')) {
            // Delete the existing image if it exists
            if ($post->image_url) {
                $oldPath = str_replace('/storage/', '', $post->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $imagePath = null;
        } elseif ($request->hasFile('image')) {
            // Delete old image if exists
            if ($post->image_url) {
                $oldPath = str_replace('/storage/', '', $post->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $imagePath = Storage::url($request->file('image')->store('post-images', 'public'));
        }

        // Update the post
        $post->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'image_url' => $imagePath,
            'scheduled_time' => $validated['scheduled_time'],
        ]);

        // Sync platforms
        $platformData = array_fill_keys($validated['platforms'], [
            'platform_status' => 'pending',
        ]);

        $post->platforms()->sync($platformData);

        return redirect()->route('posts.index')
            ->with('success', 'Post updated successfully.');
    }

    /**
     * Remove the specified post from storage.
     */
    public function destroy(Post $post)
    {
        // Ensure the post belongs to the authenticated user
        if ($post->user_id !== auth()->id()) {
            abort(403);
        }

        // Delete the image if it exists
        if ($post->image_url) {
            $imagePath = str_replace('/storage/', '', $post->image_url);
            Storage::disk('public')->delete($imagePath);
        }

        $post->delete();

        return redirect()->route('posts.index')
            ->with('success', 'Post deleted successfully.');
    }

    public function show(Post $post)
    {
        if ($post->user_id !== auth()->id()) {
            abort(403);
        }

        $post->load('platforms');
        
        return Inertia::render('Posts/Show', [
            'post' => $post
        ]);
    }
}
