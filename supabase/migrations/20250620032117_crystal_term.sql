/*
  # 뉴질랜드 워킹홀리데이 위키 데이터베이스 스키마

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `content` (text, not null)
      - `category` (text, not null)
      - `subcategory` (text, not null)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `posts` table
    - Add policy for anyone to read posts
    - Add policy for anyone to insert posts
    - Add policy for anyone to update posts
    - Add policy for anyone to delete posts
    
  3. Indexes
    - Index on category and subcategory for faster queries
    - Index on updated_at for recent posts ordering
*/

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  writer text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  subcategory text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (MVP - no authentication required)
CREATE POLICY "Anyone can read posts"
  ON posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert posts"
  ON posts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update posts"
  ON posts
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete posts"
  ON posts
  FOR DELETE
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS posts_category_subcategory_idx 
  ON posts (category, subcategory);

CREATE INDEX IF NOT EXISTS posts_updated_at_idx 
  ON posts (updated_at DESC);

CREATE INDEX IF NOT EXISTS posts_created_at_idx 
  ON posts (created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();