import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getCachedReport } from '@/lib/report-cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Try Supabase first
  try {
    const { data: report, error } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && report) {
      return NextResponse.json({ report: report.report_json });
    }
  } catch {
    // Supabase unreachable — fall through to memory cache
  }

  // 2. Fall back to in-memory cache (used when Supabase is down)
  const cached = getCachedReport(id);
  if (cached) {
    return NextResponse.json({ report: cached });
  }

  return NextResponse.json({ error: 'Report not found' }, { status: 404 });
}
