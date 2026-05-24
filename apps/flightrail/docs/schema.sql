-- Flightrail Supabase Schema
-- Run this in the Supabase SQL editor

create table if not exists sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    mode text check (mode in ('free', 'planned')) not null,
    subject text not null default '',
    departure_airport text not null,
    destination_airport text not null,
    started_at timestamptz not null,
    ended_at timestamptz not null,
    planned_duration integer, -- seconds, planned mode only
    arrival_status text check (arrival_status in ('ontime', 'delayed', 'abandoned')) not null,
    created_at timestamptz not null default now()
);

alter table sessions enable row level security;

create policy "Users can read own sessions"
    on sessions for select
    using (auth.uid() = user_id);

create policy "Users can insert own sessions"
    on sessions for insert
    with check (auth.uid() = user_id);
