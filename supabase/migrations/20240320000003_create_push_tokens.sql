create table public.user_push_tokens (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  token text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, token)
);

alter table public.user_push_tokens enable row level security;

create policy "Users can manage their own push tokens"
  on public.user_push_tokens for all
  using (auth.uid() = user_id);

create function public.handle_push_token_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger handle_push_tokens_updated_at
  before update
  on public.user_push_tokens
  for each row
  execute function public.handle_push_token_updated_at(); 