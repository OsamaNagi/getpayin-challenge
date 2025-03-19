<?php

use App\Http\Controllers\PlatformController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Post routes
    Route::resource('posts', PostController::class);
    
    // Platform routes
    Route::get('platforms', [PlatformController::class, 'index'])->name('platforms.index');
    Route::post('platforms/{platform}/toggle-active', [PlatformController::class, 'toggleActive'])->name('platforms.toggle-active');
    Route::get('api/platforms', [PlatformController::class, 'getAvailablePlatforms'])->name('api.platforms.list');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
