import { GoogleGenerativeAI } from '@google/generative-ai';
import { Entry, QuizResponse, AIReport } from './types';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function generateAIReport(
  entries: Entry[],
  quiz: QuizResponse
): Promise<AIReport> {
  try {
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
  "entrepreneurial": [
    {
      "title": "Business Idea",
      "description": "Brief description",
      "market": "Target market",
      "steps": ["Step 1", "Step 2", "Step 3"],
      "investment": "Required investment"
    }
  ],
  "nextSteps": [
    {
      "title": "Action Item",
      "description": "Description",
      "timeline": "Timeline",
      "priority": "High/Medium/Low"
    }
  ]
}

Generate 3-4 items for each category. Be specific, actionable, and personalized based on their responses.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const reportData = JSON.parse(text);

    return reportData;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate AI report');
  }
}
