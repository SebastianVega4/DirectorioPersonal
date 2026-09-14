ALTER TABLE directorio ADD COLUMN IF NOT EXISTS favorito BOOLEAN DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_directorio_favorito ON directorio(favorito DESC);
