import { NextResponse } from 'next/server';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const response = await fetch(`${PYTHON_API_URL}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Add a timeout of 30 seconds
      // This is long because the Python API can freeze a bit
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      throw new Error(`Python API returned ${response.status}`);
    }

    return NextResponse.json({ 
      status: 'ok',
      pythonApi: true 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      pythonApi: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 });
  }
} 
