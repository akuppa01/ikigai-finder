-- Enable uuid + vector if needed:
-- create extension if not exists "pgcrypto";

-- Users are managed by Supabase Auth; optional profiles table for metadata:
create table profiles (
  id uuid primary key default auth.uid(), -- or gen_random_uuid()
  email text unique,
  name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Boards (one board per session/user)
create table boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) null,
  title text default 'My Ikigai Board',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Entries: each cell in a column
create table entries (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards(id) on delete cascade,
  column_name text not null, -- 'love' | 'good_at' | 'paid_for' | 'world_needs'
  position int not null,     -- 0-based position ordering inside column
  text text not null,
  normalized_text text,     -- lowercased trimmed for dedupe
  created_by uuid references profiles(id) null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Quiz responses
create table quizzes (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards(id),
  user_id uuid references profiles(id) null,
  responses jsonb,
  age int null,
  created_at timestamptz default now()
);

-- Reports (AI-generated)
create table reports (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards(id),
  user_id uuid references profiles(id) null,
  report_json jsonb,
  pdf_url text null,
  created_at timestamptz default now()
);

-- WARNING: dev only — allow all (remove for production)
alter table boards enable row level security;
create policy "Allow all read write" on boards for all using (true) with check (true);

alter table entries enable row level security;
create policy "Allow all read write" on entries for all using (true) with check (true);

alter table quizzes enable row level security;
create policy "Allow all read write" on quizzes for all using (true) with check (true);

alter table reports enable row level security;
create policy "Allow all read write" on reports for all using (true) with check (true);

-- Indexes for performance
create index idx_entries_board_id on entries(board_id);
create index idx_entries_column_position on entries(board_id, column_name, position);
create index idx_quizzes_board_id on quizzes(board_id);
create index idx_reports_board_id on reports(board_id);

-- Trigger to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on profiles
  for each row execute function update_updated_at_column();
