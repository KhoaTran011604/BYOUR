-- Migration: Add 'creative' block type to website_blocks
-- Run this in Supabase SQL Editor

-- Drop existing constraint
ALTER TABLE website_blocks DROP CONSTRAINT IF EXISTS website_blocks_block_type_check;

-- Add new constraint with 'creative' included
ALTER TABLE website_blocks
ADD CONSTRAINT website_blocks_block_type_check
CHECK (block_type IN ('hero', 'about', 'services', 'contact', 'creative'));
