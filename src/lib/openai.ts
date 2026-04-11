import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types for AI report generation
export interface CareerPath {
  title: string;
  why?: string;
  description?: string;
  timeline?: string;
  steps: string[];
  salary?: string;
  growth?: string;
}

export interface Major {
  title: string;
  why?: string;
  description?: string;
  universities?: string[];
  duration?: string;
  prerequisites?: string[];
}

export interface EntrepreneurialIdea {
  title: string;
  capital?: 'low' | 'medium' | 'high';
  why?: string;
  description?: string;
  market?: string;
  investment?: string;
  steps: string[];
}

export interface AIReport {
  careers: CareerPath[];
  majors: Major[];
  entrepreneurialIdeas: EntrepreneurialIdea[];
  nextSteps: string[];
  tone: string;
  confidence: 'low' | 'medium' | 'high';
}
