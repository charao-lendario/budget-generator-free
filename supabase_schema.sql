-- Create profiles table to track usage
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  budget_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create freemium whitelist table
create table public.freemium_whitelist (
  email text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.freemium_whitelist enable row level security;

-- Policies for profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Policies for freemium_whitelist (Public read for checking access)
create policy "Anyone can read whitelist" on public.freemium_whitelist
  for select using (true);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, budget_count)
  values (new.id, new.email, 0);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
