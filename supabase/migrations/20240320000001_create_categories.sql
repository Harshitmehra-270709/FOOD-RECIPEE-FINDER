create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.recipes add column category_id uuid references public.categories;

create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

-- Insert some default categories
insert into public.categories (name, image_url) values
  ('Breakfast', 'https://example.com/breakfast.jpg'),
  ('Lunch', 'https://example.com/lunch.jpg'),
  ('Dinner', 'https://example.com/dinner.jpg'),
  ('Dessert', 'https://example.com/dessert.jpg'),
  ('Vegetarian', 'https://example.com/vegetarian.jpg'),
  ('Seafood', 'https://example.com/seafood.jpg'); 