import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Entry } from '@/lib/types';
import {
  validateEntries,
  validateRequestSize,
  sanitizeInput,
} from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Validate request size
    if (!validateRequestSize(request)) {
      return NextResponse.json({ error: 'Request too large' }, { status: 413 });
    }

    const { title, entries }: { title: string; entries: Entry[] } =
      await request.json();

    // Validate entries
    if (!validateEntries(entries)) {
      return NextResponse.json(
        { error: 'Invalid entries data' },
        { status: 400 }
      );
    }

    // Sanitize entries
    const sanitizedEntries = entries.map(entry => ({
      ...entry,
      text: sanitizeInput(entry.text),
    }));

    if (!title || !sanitizedEntries || !Array.isArray(sanitizedEntries)) {
      console.error('Invalid board data:', {
        title,
        entries: sanitizedEntries,
      });
      return NextResponse.json(
        { error: 'Invalid board data' },
        { status: 400 }
      );
    }

    // Create board
    const { data: board, error: boardError } = await supabaseAdmin
      .from('boards')
      .insert({
        title,
        user_id: null, // Anonymous for now
      })
      .select()
      .single();

    if (boardError) {
      console.error('Board creation error:', boardError);
      return NextResponse.json(
        { error: `Failed to create board: ${boardError.message}` },
        { status: 500 }
      );
    }

    // Create entries
    const entriesToInsert = sanitizedEntries.map(entry => ({
      board_id: board.id,
      column_name: entry.column,
      position: entry.position,
      text: entry.text,
      normalized_text: entry.text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, ''),
      created_by: null,
    }));

    const { error: entriesError } = await supabaseAdmin
      .from('entries')
      .insert(entriesToInsert);

    if (entriesError) {
      console.error('Entries creation error:', entriesError);
      return NextResponse.json(
        { error: `Failed to create entries: ${entriesError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ boardId: board.id });
  } catch (error) {
    console.error('Error creating board:', error);
    return NextResponse.json(
      { error: 'Failed to create board' },
      { status: 500 }
    );
  }
}
