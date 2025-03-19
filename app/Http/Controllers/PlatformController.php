<?php

namespace App\Http\Controllers;

use App\Models\Platform;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlatformController extends Controller
{
    /**
     * Display a listing of the platforms.
     */
    public function index()
    {
        $platforms = Platform::all();

        // For each platform, check if user has it activated
        $platforms->each(function ($platform) {
            $platform->active = auth()->user()->activePlatforms()->where('platform_id', $platform->id)->exists();
        });

        return Inertia::render('Platforms/Index', [
            'platforms' => $platforms,
        ]);
    }

    /**
     * Get all available platforms for API use.
     */
    public function getAvailablePlatforms()
    {
        $platforms = Platform::all();
        
        return response()->json([
            'platforms' => $platforms,
        ]);
    }

    /**
     * Toggle active state of a platform for the authenticated user.
     */
    public function toggleActive(Request $request, Platform $platform)
    {
        $active = $request->input('active', false);
        $user = auth()->user();

        if ($active) {
            // Activate platform for user
            if (!$user->activePlatforms()->where('platform_id', $platform->id)->exists()) {
                $user->activePlatforms()->attach($platform->id);
            }
        } else {
            // Deactivate platform for user
            $user->activePlatforms()->detach($platform->id);
        }

        return back()->with('success', 'Platform settings updated.');
    }
}
