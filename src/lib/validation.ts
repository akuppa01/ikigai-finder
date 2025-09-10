import { NextRequest } from 'next/server';

// Input validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validateTextInput(
  text: string,
  maxLength: number = 1000
): boolean {
  return text.trim().length > 0 && text.trim().length <= maxLength;
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function validateQuizResponse(quiz: any): boolean {
  const requiredQuestions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'];
  return requiredQuestions.every(
    q => quiz[q] !== undefined && quiz[q] !== null
  );
}

export function validateEntries(entries: any[]): boolean {
  if (!Array.isArray(entries)) return false;
  if (entries.length === 0) return false;
  if (entries.length > 100) return false; // Reasonable limit

  return entries.every(
    entry =>
      entry &&
      typeof entry.text === 'string' &&
      entry.text.trim().length > 0 &&
      entry.text.trim().length <= 500 &&
      ['love', 'goodAt', 'earn', 'needs'].includes(entry.column)
  );
}

// Request size validation
export function validateRequestSize(request: NextRequest): boolean {
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 1024 * 1024) {
    // 1MB limit
    return false;
  }
  return true;
}

// Rate limiting validation
export function validateRateLimit(
  identifier: string,
  currentCount: number,
  limit: number
): boolean {
  return currentCount < limit;
}
