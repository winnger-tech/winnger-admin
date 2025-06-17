import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = await fetch('http://localhost:5001/api/restaurants/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 5000 }), // $50.00 in cents
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 