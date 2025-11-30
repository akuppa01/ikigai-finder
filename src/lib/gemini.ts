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
    if (!process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY === 'your_google_ai_api_key') {
      console.error('Google AI API key not configured or using placeholder value');
      console.log('Using fallback response for testing...');
      
      // Return a fallback response for testing
      return {
        careers: [
          {
            title: "Software Developer",
            description: "Create and maintain software applications that solve real-world problems",
            steps: ["Learn programming languages", "Build projects", "Get certified"],
            salary: "$60,000 - $120,000",
            growth: "High demand field with 22% projected growth"
          },
          {
            title: "Data Analyst",
            description: "Analyze data to help organizations make informed decisions",
            steps: ["Learn SQL and Python", "Master data visualization", "Get industry experience"],
            salary: "$50,000 - $90,000",
            growth: "Growing field with 25% projected growth"
          }
        ],
        majors: [
          {
            title: "Computer Science",
            description: "Study of computational systems and programming",
            universities: ["MIT", "Stanford", "Local universities"],
            duration: "4 years",
            prerequisites: ["High school math", "Basic programming knowledge"]
          },
          {
            title: "Data Science",
            description: "Interdisciplinary field combining statistics and computer science",
            universities: ["Carnegie Mellon", "UC Berkeley", "Online programs"],
            duration: "4 years",
            prerequisites: ["Calculus", "Statistics", "Programming"]
          }
        ],
        entrepreneurialIdeas: [
          {
            title: "SaaS Application",
            description: "Build a software-as-a-service product for small businesses",
            market: "Small to medium businesses",
            steps: ["Identify problem", "Build MVP", "Get customers"],
            investment: "$5,000 - $20,000"
          }
        ],
        nextSteps: [
          "Research career options that interest you",
          "Take online courses to develop new skills",
          "Network with professionals in your field of interest",
          "Start building projects to gain experience"
        ],
        confidence: "High",
        tone: "Encouraging"
      };
    }

    console.log('API Key format check:', {
      hasKey: !!process.env.GOOGLE_AI_API_KEY,
      keyLength: process.env.GOOGLE_AI_API_KEY.length,
      keyPrefix: process.env.GOOGLE_AI_API_KEY.substring(0, 10) + '...'
    });

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

    console.log('Organized entries:', organizedEntries);
    console.log('Quiz responses:', quiz);

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

IMPORTANT: You must respond with ONLY valid JSON. Do not include any text before or after the JSON. Do not use markdown formatting or code blocks.

Generate a JSON response with this exact structure:
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
  "confidence": "High",
  "tone": "Encouraging"
}

Generate 3-4 items for each category. Be specific, actionable, and personalized based on their responses. Respond with ONLY the JSON object, no other text.
`;

    console.log('Sending prompt to Gemini...');
    const result = await model.generateContent(prompt);
    console.log('Gemini response received');
    const response = await result.response;
    const text = response.text();
    console.log('Response text extracted');

    console.log('Gemini response:', text);

    // Clean the response text to extract JSON
    let cleanedText = text.trim();
    
    // Remove markdown code blocks if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Try to find JSON object in the response
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    console.log('Cleaned response:', cleanedText);

    // Parse the JSON response
    let reportData;
    try {
      reportData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', text);
      console.error('Cleaned response:', cleanedText);
      
      // Try to create a fallback response
      console.log('Creating fallback response...');
      reportData = {
        careers: [
          {
            title: "Career Counselor",
            description: "Help others discover their career path and life purpose",
            steps: ["Complete psychology degree", "Get counseling certification", "Build client base"],
            salary: "$40,000 - $80,000",
            growth: "Growing field with 8% projected growth"
          }
        ],
        majors: [
          {
            title: "Psychology",
            description: "Study human behavior and mental processes",
            universities: ["Local universities", "Online programs"],
            duration: "4 years",
            prerequisites: ["High school diploma", "SAT/ACT scores"]
          }
        ],
        entrepreneurialIdeas: [
          {
            title: "Life Coaching Business",
            description: "Help people find their purpose and achieve goals",
            market: "Career changers and life transitioners",
            steps: ["Get coaching certification", "Build online presence", "Start with free consultations"],
            investment: "$2,000 - $5,000"
          }
        ],
        nextSteps: [
          "Research career options that interest you",
          "Take online courses to develop new skills",
          "Network with professionals in your field of interest"
        ],
        confidence: "Medium",
        tone: "Encouraging"
      };
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
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    throw new Error(`Failed to generate AI report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
