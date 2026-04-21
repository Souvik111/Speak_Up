-- Topics Table
create table public.topics (
  id uuid default gen_random_uuid() primary key,
  category text not null,
  prompt text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sessions Table
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  topic_id uuid references public.topics(id),
  transcript text,
  fluency_score integer,
  pauses integer,
  fillers integer,
  wpm integer,
  mistake text,
  improvement text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Disable RLS temporarily during MVP testing so any user can read/write
alter table public.topics disable row level security;
alter table public.sessions disable row level security;

-- Insert Starter Topics
insert into public.topics (category, prompt) values 
('Opinion', 'Convince me why tea is better than coffee.'),
('Work', 'Describe your dream job and why it suits you.'),
('Casual', 'Tell me about the best vacation you have ever had.'),
('Personal', 'Describe the worst day you have ever experienced.');
