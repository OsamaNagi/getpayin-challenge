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
            'platforms' => $platforms->map(fn ($platform) => [
                'id' => $platform->id,
                'name' => $platform->name,
                'type' => $platform->type,
                'active' => $platform->active,
            ]),
        ]);
    }

    /**
     * Get all available platforms for API use.
     */
    public function getAvailablePlatforms()
    {
        $platforms = Platform::all();
        
        return response()->json([
            'platforms' => $platforms->map(fn ($platform) => [
                'id' => $platform->id,
                'name' => $platform->name,
                'type' => $platform->type,
            ]),
        ]);
    }

    /**
     * Toggle active state of a platform for the authenticated user.
     */
    public function toggleActive(Request $request, Platform $platform)
    {
        \Log::info('Toggle active called', [
            'platform_id' => $platform->id,
            'active' => $request->input('active'),
            'user_id' => auth()->id(),
            'request' => $request->all()
        ]);
        
        $active = $request->boolean('active');
        $user = auth()->user();

        try {
            if ($active) {
                // Activate platform for user
                if (!$user->activePlatforms()->where('platform_id', $platform->id)->exists()) {
                    \Log::info('Attaching platform', ['platform_id' => $platform->id, 'user_id' => $user->id]);
                    $user->activePlatforms()->attach($platform->id);
                }
            } else {
                // Deactivate platform for user
                \Log::info('Detaching platform', ['platform_id' => $platform->id, 'user_id' => $user->id]);
                $user->activePlatforms()->detach($platform->id);
            }

            // When using Inertia, we need to return an Inertia redirect or response
            return redirect()->back();
        } catch (\Exception $e) {
            \Log::error('Error toggling platform', [
                'error' => $e->getMessage(),
                'platform_id' => $platform->id,
                'user_id' => $user->id,
                'active' => $active
            ]);
            
            // With Inertia, we should return a redirect with errors
            return redirect()->back()->withErrors(['message' => 'Failed to update platform status']);
        }
    }
}
