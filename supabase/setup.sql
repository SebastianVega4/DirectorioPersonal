-- ============================================
-- SCRIPT SQL: Tabla directorio en Supabase
-- ============================================

-- 1. Habilitar extensión para búsquedas de texto
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Crear tabla principal
CREATE TABLE IF NOT EXISTS directorio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  foto_url TEXT,
  nombre_completo TEXT NOT NULL,
  documento TEXT,
  codigo_universidad TEXT,
  programa TEXT,
  rol TEXT,
  correo_personal TEXT,
  correo_trabajo TEXT,
  telefono_celular TEXT,
  redes_sociales JSONB DEFAULT '{"wa": "", "ig": "", "fb": ""}'::jsonb,
  tags TEXT[] DEFAULT '{}',
  ciudad TEXT,
  latitud NUMERIC,
  longitud NUMERIC,
  fecha_nacimiento DATE,
  detalles JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_directorio_nombre
  ON directorio USING gin (nombre_completo gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_directorio_programa
  ON directorio (programa);
CREATE INDEX IF NOT EXISTS idx_directorio_rol
  ON directorio (rol);
CREATE INDEX IF NOT EXISTS idx_directorio_ciudad
  ON directorio (ciudad);
CREATE INDEX IF NOT EXISTS idx_directorio_tags
  ON directorio USING gin (tags);
CREATE INDEX IF NOT EXISTS idx_directorio_documento
  ON directorio (documento);

-- 4. Habilitar Row Level Security (RLS) - NOTA: es "SECURITY" no "POLICY"
ALTER TABLE directorio ENABLE ROW LEVEL SECURITY;

-- 5. Política pública: cualquiera puede LEER
CREATE POLICY "public_select"
  ON directorio FOR SELECT
  USING (true);

-- 6. Política pública: cualquiera puede ACTUALIZAR (solo para agregar detalles)
CREATE POLICY "public_update_details"
  ON directorio FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 7. Política admin: acceso total (requiere autenticación de Supabase Auth)
CREATE POLICY "admin_full_access"
  ON directorio FOR ALL
  USING (auth.role() = 'authenticated');
