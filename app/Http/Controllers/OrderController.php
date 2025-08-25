<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
            'quantity' => 'required|integer|min:1',
        ]);

        $order = Order::create([
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
        ]);

        return response()->json(['message' => 'Order placed successfully', 'order' => $order], 201);
    }
}
