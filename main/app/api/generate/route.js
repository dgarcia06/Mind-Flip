import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

export async function POST(req) {
  try {
    const data = await req.text();

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `${systemPrompt}\n\nHere's the text to create flashcards from:\n${data}`;
    
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text(); 
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let jsonText = jsonMatch ? jsonMatch[0] : '{}';
    
    let flashcards;
    try {
      flashcards = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return NextResponse.json({ error: 'Invalid response format from AI' }, { status: 500 });
    }

    if (!flashcards.flashcards || !Array.isArray(flashcards.flashcards)) {
      return NextResponse.json({ error: 'Invalid flashcards format' }, { status: 500 });
    }

    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
  }
}
