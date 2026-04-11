import { GoogleGenerativeAI } from '@google/generative-ai';
import { Entry, QuizResponse, AIReport } from './types';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Model cascade: cheapest/fastest first, fall back on 503 or 404
const MODEL_CASCADE = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-preview-05-20',
  'gemini-2.5-pro',
  'gemini-2.5-pro-preview-06-05',
];

const FALLBACK_REPORT: AIReport = {
  careers: [
    {
      title: 'Software Developer',
      description: 'Create and maintain software applications that solve real-world problems',
      steps: ['Learn programming languages', 'Build projects', 'Get certified'],
      salary: '$60,000 – $120,000',
      growth: 'High demand — 22% projected growth',
    },
    {
      title: 'Data Analyst',
      description: 'Analyse data to help organisations make informed decisions',
      steps: ['Learn SQL and Python', 'Master data visualisation', 'Get industry experience'],
      salary: '$50,000 – $90,000',
      growth: 'Growing field — 25% projected growth',
    },
  ],
  majors: [
    {
      title: 'Computer Science',
      description: 'Study of computational systems and programming',
      universities: ['MIT', 'Stanford', 'Local universities'],
      duration: '4 years',
      prerequisites: ['High school math', 'Basic programming knowledge'],
    },
    {
      title: 'Data Science',
      description: 'Interdisciplinary field combining statistics and computer science',
      universities: ['Carnegie Mellon', 'UC Berkeley', 'Online programmes'],
      duration: '4 years',
      prerequisites: ['Calculus', 'Statistics', 'Programming'],
    },
  ],
  entrepreneurialIdeas: [
    {
      title: 'SaaS Application',
      description: 'Build a software-as-a-service product for small businesses',
      market: 'Small to medium businesses',
      steps: ['Identify problem', 'Build MVP', 'Get customers'],
      investment: '$5,000 – $20,000',
    },
  ],
  nextSteps: [
    'Research career options that interest you',
    'Take online courses to develop new skills',
    'Network with professionals in your field of interest',
    'Start building projects to gain experience',
  ],
  confidence: 'High',
  tone: 'Encouraging',
};

async function callGeminiWithCascade(prompt: string): Promise<string> {
  let lastError: Error | null = null;

  for (const modelName of MODEL_CASCADE) {
    try {
      console.log(`Trying model: ${modelName}`);
      const m = genAI.getGenerativeModel({ model: modelName });
      const result = await m.generateContent(prompt);
      const text = result.response.text();
      console.log(`Success with model: ${modelName}`);
      return text;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`Model ${modelName} failed: ${msg}`);
      lastError = err instanceof Error ? err : new Error(msg);

      // Only cascade on 503 (overloaded) or 404/not-available errors
      const isCascadable =
        msg.includes('503') ||
        msg.includes('404') ||
        msg.toLowerCase().includes('not found') ||
        msg.toLowerCase().includes('no longer available') ||
        msg.toLowerCase().includes('high demand');

      if (!isCascadable) throw lastError;
    }
  }

  throw lastError ?? new Error('All Gemini models failed');
}

export async function generateAIReport(
  entries: Entry[],
  quiz: QuizResponse
): Promise<AIReport> {
  // Guard: no API key
  if (
    !process.env.GOOGLE_AI_API_KEY ||
    process.env.GOOGLE_AI_API_KEY === 'your_google_ai_api_key'
  ) {
    console.warn('GOOGLE_AI_API_KEY not set — returning fallback report');
    return FALLBACK_REPORT;
  }

  // Organise entries
  const organizedEntries = {
    love: entries
      .filter(e => e.column === 'love')
      .map(e => e.text)
      .filter(t => t.trim().length > 2),
    goodAt: entries
      .filter(e => e.column === 'good_at')
      .map(e => e.text)
      .filter(t => t.trim().length > 2),
    earn: entries
      .filter(e => e.column === 'paid_for')
      .map(e => e.text)
      .filter(t => t.trim().length > 2),
    needs: entries
      .filter(e => e.column === 'world_needs')
      .map(e => e.text)
      .filter(t => t.trim().length > 2),
  };

  const hasContent = Object.values(organizedEntries).some(a => a.length > 0);
  if (!hasContent) {
    organizedEntries.love = ['creative activities', 'helping others', 'learning new things'];
    organizedEntries.goodAt = ['problem solving', 'communication', 'organisation'];
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

IMPORTANT: Respond with ONLY valid JSON. No markdown, no code fences, no extra text.

{
  "careers": [
    { "title": "Career Title", "description": "Brief description", "steps": ["Step 1", "Step 2", "Step 3"], "salary": "Salary range", "growth": "Growth prospects" }
  ],
  "majors": [
    { "title": "Major Title", "description": "Brief description", "universities": ["University 1", "University 2"], "duration": "Duration", "prerequisites": ["Prerequisite 1"] }
  ],
  "entrepreneurialIdeas": [
    { "title": "Business Idea", "description": "Brief description", "market": "Target market", "steps": ["Step 1", "Step 2"], "investment": "Required investment" }
  ],
  "nextSteps": ["Action Item 1", "Action Item 2", "Action Item 3"],
  "confidence": "High",
  "tone": "Encouraging"
}

Generate 3-4 items per category. Be specific, actionable, and personalised. Output ONLY the JSON object.
`;

  try {
    const rawText = await callGeminiWithCascade(prompt);

    // Strip markdown fences if present
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleaned = jsonMatch[0];

    let reportData: AIReport;
    try {
      reportData = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('JSON parse error — using fallback:', parseErr);
      return FALLBACK_REPORT;
    }

    // Validate and fill defaults
    if (!Array.isArray(reportData.careers) || reportData.careers.length === 0)
      reportData.careers = FALLBACK_REPORT.careers;
    if (!Array.isArray(reportData.majors) || reportData.majors.length === 0)
      reportData.majors = FALLBACK_REPORT.majors;
    if (!Array.isArray(reportData.nextSteps) || reportData.nextSteps.length === 0)
      reportData.nextSteps = FALLBACK_REPORT.nextSteps;
    if (!Array.isArray(reportData.entrepreneurialIdeas))
      reportData.entrepreneurialIdeas = FALLBACK_REPORT.entrepreneurialIdeas;
    if (!reportData.confidence) reportData.confidence = 'Medium';
    if (!reportData.tone) reportData.tone = 'Encouraging';

    return reportData;
  } catch (error) {
    console.error('Gemini cascade exhausted:', error);
    throw new Error(
      `Failed to generate AI report: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
