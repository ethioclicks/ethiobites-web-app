import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    // Test basic connectivity to the backend
    const response = await fetch(`${apiUrl}/public/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: 'test',
        password: 'test'
      })
    });

    const responseText = await response.text();
    
    return NextResponse.json({
      success: true,
      backend_url: apiUrl,
      status: response.status,
      response: responseText,
      headers: Object.fromEntries(response.headers.entries())
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      backend_url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    }, { status: 500 });
  }
}