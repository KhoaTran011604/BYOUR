-- Add color_scheme column to websites table
ALTER TABLE websites
ADD COLUMN color_scheme TEXT NOT NULL DEFAULT 'warm'
CHECK (color_scheme IN ('warm', 'ocean', 'forest', 'royal'));
