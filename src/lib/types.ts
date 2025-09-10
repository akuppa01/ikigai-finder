// Board and entry types
export type ColumnKey = 'love' | 'good_at' | 'paid_for' | 'world_needs';

export interface Entry {
  id: string;
  text: string;
  position: number;
  column: ColumnKey;
  normalized_text?: string;
}

export interface Board {
  id: string;
  user_id?: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface QuizResponse {
  q1: number; // Likert scale 1-5
  q2: number;
  q3: number;
  q4: 'lead' | 'collaborate' | 'independent';
  q5: 'student' | 'professional';
  q6: 'low' | 'medium' | 'high';
  q7: string; // age range
  q8?: number; // optional Likert scale
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface NormalizedGroup {
  canonical: string;
  occurrences: Array<{
    id: string;
    column: ColumnKey;
    original: string;
  }>;
}

export interface NormalizedBoard {
  groupedItems: NormalizedGroup[];
  columns: Record<ColumnKey, Entry[]>;
}

// UI state types
export interface BoardState {
  columns: Record<ColumnKey, Entry[]>;
  selectedEntryId: string | null;
  editingEntryId: string | null;
  boardId: string | null;
}

export interface QuizState {
  currentQuestion: number;
  responses: Partial<QuizResponse>;
  isComplete: boolean;
}
