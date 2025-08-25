<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\OrderController;
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('inventory', InventoryController::class);
    Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');


});
Route::post('/orders', [OrderController::class, 'store']);
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

