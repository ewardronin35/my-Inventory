<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index()
    {
        $inventory = Inventory::all();
        
        // Check if request wants JSON (API call)
        if (request()->wantsJson()) {
            return response()->json($inventory);
        }
        
        // Otherwise return Inertia response for web interface
        return Inertia::render('Inventory/Index', [
            'inventory' => $inventory
        ]);
    }

    public function create()
    {
        return Inertia::render('Inventory/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string'
        ]);

        $inventory = Inventory::create($validated);
        
        if ($request->wantsJson()) {
            return response()->json($inventory, 201);
        }
        
        return redirect()->route('inventory.index')
            ->with('message', 'Inventory item created successfully');
    }

    public function show($id)
    {
        $item = Inventory::findOrFail($id);
        
        if (request()->wantsJson()) {
            return response()->json($item);
        }
        
        return Inertia::render('Inventory/Show', [
            'item' => $item
        ]);
    }

    public function edit($id)
    {
        $item = Inventory::findOrFail($id);
        
        return Inertia::render('Inventory/Edit', [
            'item' => $item
        ]);
    }

    public function update(Request $request, $id)
    {
        $item = Inventory::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'quantity' => 'sometimes|integer|min:0',
            'price' => 'sometimes|numeric|min:0',
            'description' => 'nullable|string'
        ]);

        $item->update($validated);
        
        if ($request->wantsJson()) {
            return response()->json($item);
        }
        
        return redirect()->route('inventory.index')
            ->with('message', 'Inventory item updated successfully');
    }

    public function destroy($id)
    {
        $item = Inventory::findOrFail($id);
        $item->delete();
        
        if (request()->wantsJson()) {
            return response()->json(null, 204);
        }
        
        return redirect()->route('inventory.index')
            ->with('message', 'Inventory item deleted successfully');
    }
}