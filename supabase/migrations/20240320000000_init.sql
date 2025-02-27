-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, recipe_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow users to view own favorites"
    ON public.favorites FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to create own favorites"
    ON public.favorites FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own favorites"
    ON public.favorites FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create recipe_stats table
CREATE TABLE IF NOT EXISTS public.recipe_stats (
    recipe_id TEXT PRIMARY KEY,
    average_rating DECIMAL(3,1) NOT NULL DEFAULT 0,
    total_reviews INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.recipe_stats ENABLE ROW LEVEL SECURITY;

-- Recipe stats policies
CREATE POLICY "Allow public read access to recipe stats"
    ON public.recipe_stats FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users to update recipe stats"
    ON public.recipe_stats FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update recipe stats"
    ON public.recipe_stats FOR UPDATE
    TO authenticated
    USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_ratings_updated_at
    BEFORE UPDATE ON public.ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update recipe stats
CREATE OR REPLACE FUNCTION update_recipe_stats()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating DECIMAL(3,1);
    total_count INTEGER;
BEGIN
    -- Calculate new stats
    SELECT
        COALESCE(ROUND(AVG(rating)::numeric, 1), 0),
        COUNT(*)
    INTO
        avg_rating,
        total_count
    FROM public.ratings
    WHERE recipe_id = NEW.recipe_id;

    -- Update recipe_stats
    INSERT INTO public.recipe_stats (
        recipe_id,
        average_rating,
        total_reviews,
        last_updated
    ) VALUES (
        NEW.recipe_id,
        avg_rating,
        total_count,
        TIMEZONE('utc', NOW())
    )
    ON CONFLICT (recipe_id) DO UPDATE
    SET
        average_rating = EXCLUDED.average_rating,
        total_reviews = EXCLUDED.total_reviews,
        last_updated = EXCLUDED.last_updated;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for recipe stats
CREATE TRIGGER update_recipe_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_recipe_stats(); 