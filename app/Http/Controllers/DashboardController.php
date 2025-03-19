<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $posts = Post::with('platforms')
            ->where('user_id', auth()->id())
            ->orderBy('scheduled_time')
            ->get();

        return Inertia::render('Dashboard/Index', [
            'posts' => $posts,
        ]);
    }
} 