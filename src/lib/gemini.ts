import { GoogleGenerativeAI } from '@google/generative-ai';
import { Entry, QuizResponse, AIReport } from './types';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function generateAIReport(
  entries: Entry[],
  quiz: QuizResponse
): Promise<AIReport> {
  try {
    // Check if API key is available
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('Google AI API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Organize entries by column and filter out gibberish
    const organizedEntries = {
      love: entries.filter(e => e.column === 'love').map(e => e.text).filter(text => text.trim().length > 2),
      goodAt: entries.filter(e => e.column === 'good_at').map(e => e.text).filter(text => text.trim().length > 2),
      earn: entries.filter(e => e.column === 'paid_for').map(e => e.text).filter(text => text.trim().length > 2),
      needs: entries.filter(e => e.column === 'world_needs').map(e => e.text).filter(text => text.trim().length > 2),
    };

    // If no meaningful entries, use default values
    const hasContent = Object.values(organizedEntries).some(arr => arr.length > 0);
    if (!hasContent) {
      organizedEntries.love = ['creative activities', 'helping others', 'learning new things'];
      organizedEntries.goodAt = ['problem solving', 'communication', 'organization'];
      organizedEntries.earn = ['consulting', 'teaching', 'freelancing'];
      organizedEntries.needs = ['environmental solutions', 'education', 'healthcare'];
    }

    const prompt = `
You are an AI career counselor specializing in Ikigai analysis. Based on the user's Ikigai board entries and quiz responses, generate a comprehensive career guidance report.

IKIGAI BOARD ENTRIES:
What I Love: ${organizedEntries.love.join(', ')}
What I'm Good At: ${organizedEntries.goodAt.join(', ')}
What I Can Earn: ${organizedEntries.earn.join(', ')}
What the World Needs: ${organizedEntries.needs.join(', ')}

QUIZ RESPONSES:
${Object.entries(quiz)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}

Please generate a JSON response with the following structure:
{
  "careers": [
    {
      "title": "Career Title",
      "description": "Brief description",
      "steps": ["Step 1", "Step 2", "Step 3"],
      "salary": "Salary range",
      "growth": "Growth prospects"
    }
  ],
  "majors": [
    {
      "title": "Major Title",
      "description": "Brief description",
      "universities": ["University 1", "University 2"],
      "duration": "Duration",
      "prerequisites": ["Prerequisite 1", "Prerequisite 2"]
    }
  ],
  "entrepreneurialIdeas": [
    {
      "title": "Business Idea",
      "description": "Brief description",
      "market": "Target market",
      "steps": ["Step 1", "Step 2", "Step 3"],
      "investment": "Required investment"
    }
  ],
  "nextSteps": [
    "Action Item 1",
    "Action Item 2",
    "Action Item 3"
  ],
  "confidence": "High/Medium/Low",
  "tone": "Encouraging/Professional/Friendly"
}

Generate 3-4 items for each category. Be specific, actionable, and personalized based on their responses.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini response:', text);

    // Parse the JSON response
    let reportData;
    try {
      reportData = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', text);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate required fields
    if (!reportData.careers || !Array.isArray(reportData.careers)) {
      throw new Error('Missing or invalid careers data');
    }
    if (!reportData.majors || !Array.isArray(reportData.majors)) {
      throw new Error('Missing or invalid majors data');
    }
    if (!reportData.nextSteps || !Array.isArray(reportData.nextSteps)) {
      throw new Error('Missing or invalid nextSteps data');
    }

    // Ensure confidence and tone are present
    if (!reportData.confidence) {
      reportData.confidence = 'Medium';
    }
    if (!reportData.tone) {
      reportData.tone = 'Encouraging';
    }

    return reportData;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate AI report');
  }
}
