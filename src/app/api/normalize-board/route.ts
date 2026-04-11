import { NextRequest, NextResponse } from 'next/server';
import Fuse from 'fuse.js';
import {
  Entry,
  ColumnKey,
  NormalizedBoard,
  NormalizedGroup,
} from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { entries }: { entries: Entry[] } = await request.json();

    if (!entries || !Array.isArray(entries)) {
      return NextResponse.json(
        { error: 'Invalid entries data' },
        { status: 400 }
      );
    }

    // Normalize text for comparison
    const normalizeText = (text: string): string => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ');
    };

    // Add normalized text to entries
    const normalizedEntries = entries.map(entry => ({
      ...entry,
      normalized_text: normalizeText(entry.text),
    }));

    // Group entries by normalized text using fuzzy matching
    const fuse = new Fuse(normalizedEntries, {
      keys: ['normalized_text'],
      threshold: 0.3, // Lower threshold = more strict matching
      includeScore: true,
    });

    const groups: Map<string, NormalizedGroup> = new Map();
    const processed = new Set<string>();

    for (const entry of normalizedEntries) {
      if (processed.has(entry.id)) continue;

      const results = fuse.search(entry.normalized_text);
      const similarEntries = results
        .filter(result => result.score! < 0.3)
        .map(result => result.item);

      if (similarEntries.length > 1) {
        // Group similar entries
        const canonical = entry.normalized_text;
        const group: NormalizedGroup = {
          canonical,
          occurrences: similarEntries.map(e => ({
            id: e.id,
            column: e.column,
            original: e.text,
          })),
        };

        groups.set(canonical, group);
        similarEntries.forEach(e => processed.add(e.id));
      } else {
        // Single entry
        const group: NormalizedGroup = {
          canonical: entry.normalized_text,
          occurrences: [
            {
              id: entry.id,
              column: entry.column,
              original: entry.text,
            },
          ],
        };
        groups.set(entry.normalized_text, group);
        processed.add(entry.id);
      }
    }

    // Reorganize columns with grouped items at the top
    const columns: Record<ColumnKey, Entry[]> = {
      love: [],
      good_at: [],
      paid_for: [],
      world_needs: [],
    };

    // First, add grouped items (items that appear in multiple columns or have duplicates)
    const groupedCanonicals = Array.from(groups.values()).filter(
      group =>
        group.occurrences.length > 1 ||
        new Set(group.occurrences.map(o => o.column)).size > 1
    );

    for (const group of groupedCanonicals) {
      for (const occurrence of group.occurrences) {
        const entry = normalizedEntries.find(e => e.id === occurrence.id);
        if (entry) {
          columns[entry.column].push(entry);
        }
      }
    }

    // Then add single items
    const singleCanonicals = Array.from(groups.values()).filter(
      group =>
        group.occurrences.length === 1 &&
        new Set(group.occurrences.map(o => o.column)).size === 1
    );

    for (const group of singleCanonicals) {
      for (const occurrence of group.occurrences) {
        const entry = normalizedEntries.find(e => e.id === occurrence.id);
        if (entry) {
          columns[entry.column].push(entry);
        }
      }
    }

    // Sort each column by position
    Object.keys(columns).forEach(key => {
      columns[key as ColumnKey].sort((a, b) => a.position - b.position);
    });

    const result: NormalizedBoard = {
      groupedItems: Array.from(groups.values()),
      columns,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error normalizing board:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
