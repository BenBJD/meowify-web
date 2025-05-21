import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to handle meowify processing requests
 * This forwards the request to the Python API and returns the processed audio
 */
export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    
    // Forward the request to the Python API
    const response = await fetch('http://localhost:8000/meowify/', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      // If the Python API returns an error, return it to the client
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Failed to process audio', details: errorText },
        { status: response.status }
      );
    }
    
    // Get the processed audio as a blob
    const audioBlob = await response.blob();
    
    // Return the processed audio to the client
    return new NextResponse(audioBlob, {
      headers: {
        'Content-Type': audioBlob.type,
        'Content-Disposition': 'attachment; filename="meowified-audio.mp3"',
      },
    });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}