import { NextRequest, NextResponse } from 'next/server';
import { generateAIReport } from '@/lib/gemini';
import { supabaseAdmin } from '@/lib/supabase';
import { Entry, QuizResponse, UserProfile } from '@/lib/types';
import {
  validateEmail,
  sanitizeInput,
  validateQuizResponse,
  validateEntries,
  validateRequestSize,
} from '@/lib/validation';

// Simple in-memory rate limiter (for production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 1000; // 1000 reports per 24 hours
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  // Reset if window has passed
  if (now > userLimit.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  // Check if under limit
  if (userLimit.count < RATE_LIMIT) {
    userLimit.count++;
    return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Validate request size
    if (!validateRequestSize(request)) {
      return NextResponse.json({ error: 'Request too large' }, { status: 413 });
    }

    const requestBody = await request.json();

    const {
      boardId,
      userId,
      entries,
      quiz,
      profile,
    }: {
      boardId: string;
      userId?: string;
      entries: Entry[];
      quiz: QuizResponse;
      profile: UserProfile;
    } = requestBody;

    if (!entries || !quiz || !profile) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      );
    }

    // Validate input data
    if (!validateEntries(entries)) {
      return NextResponse.json(
        { error: 'Invalid entries data' },
        { status: 400 }
      );
    }

    if (!validateQuizResponse(quiz as Record<string, unknown>)) {
      return NextResponse.json(
        { error: 'Invalid quiz responses' },
        { status: 400 }
      );
    }

    if (!validateEmail(profile.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEntries = entries.map(entry => ({
      ...entry,
      text: sanitizeInput(entry.text),
    }));

    const sanitizedProfile = {
      ...profile,
      name: profile.name ? sanitizeInput(profile.name) : profile.name,
      email: sanitizeInput(profile.email),
    };

    // Rate limiting check
    const rateLimitIdentifier = sanitizedProfile.email || 'anonymous';
    if (!checkRateLimit(rateLimitIdentifier)) {
      return NextResponse.json(
        {
          error:
            'Rate limit exceeded. You can generate up to 1000 reports per 24 hours. Please try again later.',
          retryAfter: 24 * 60 * 60, // 24 hours in seconds
        },
        { status: 429 }
      );
    }

    // Data validation
    if (entries.length === 0) {
      return NextResponse.json(
        { error: 'No board entries provided' },
        { status: 400 }
      );
    }

    // Call Gemini
    const reportData = await generateAIReport(sanitizedEntries, quiz);

    // Validate required fields
    if (!reportData.careers || !reportData.majors || !reportData.nextSteps) {
      throw new Error('Incomplete response from AI');
    }

    // Save or update user profile
    let profileUserId = userId;
    if (sanitizedProfile.email) {
      const { data: existingProfile, error: profileLookupError } =
        await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('email', sanitizedProfile.email)
          .single();

      if (profileLookupError && profileLookupError.code !== 'PGRST116') {
        return NextResponse.json(
          { error: 'Failed to lookup profile' },
          { status: 500 }
        );
      }

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            name: sanitizedProfile.name || existingProfile.name,
          })
          .eq('id', existingProfile.id);

        if (updateError) {
          return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
          );
        }

        profileUserId = existingProfile.id;
      } else {
        // Create new profile
        const { data: newProfile, error: createError } = await supabaseAdmin
          .from('profiles')
          .insert({
            email: sanitizedProfile.email,
            name: sanitizedProfile.name || null,
          })
          .select()
          .single();

        if (createError) {
          return NextResponse.json(
            { error: 'Failed to create profile' },
            { status: 500 }
          );
        }

        profileUserId = newProfile.id;
      }
    }

    // Save to database
    const { data: report, error: reportError } = await supabaseAdmin
      .from('reports')
      .insert({
        board_id: boardId,
        user_id: profileUserId || null,
        report_json: reportData,
      })
      .select()
      .single();

    if (reportError) {
      return NextResponse.json(
        { error: 'Failed to save report' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reportId: report.id,
      report: reportData,
    });
  } catch (error) {
    console.error('Generate report error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Failed to generate report: ${errorMessage}` },
      { status: 500 }
    );
  }
}
