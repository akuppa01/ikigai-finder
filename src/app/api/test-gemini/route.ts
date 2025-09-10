import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key exists:', !!process.env.GOOGLE_AI_API_KEY);
    console.log('API Key length:', process.env.GOOGLE_AI_API_KEY?.length);

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: 'Google AI API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    console.log('Model created, testing simple prompt...');
    
    const result = await model.generateContent('Hello, can you respond with just "Test successful"?');
    const response = await result.response;
    const text = response.text();

    console.log('Gemini response:', text);

    return NextResponse.json({ 
      success: true, 
      response: text,
      apiKeyLength: process.env.GOOGLE_AI_API_KEY.length
    });
  } catch (error) {
    console.error('Gemini test error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
