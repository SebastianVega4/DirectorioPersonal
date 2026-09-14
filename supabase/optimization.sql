-- ============================================
-- FUNCIONES RPC para optimización de rendimiento
-- ============================================

-- Función para obtener valores únicos de una columna (evita cargar 77K registros)
CREATE OR REPLACE FUNCTION get_unique_values(col_name text)
RETURNS TABLE(value text) AS $$
BEGIN
  RETURN QUERY
  EXECUTE format('SELECT DISTINCT %I FROM directorio WHERE %I IS NOT NULL ORDER BY %I', col_name, col_name, col_name);
END;
$$ LANGUAGE plpgsql STABLE;

-- Función para obtener todos los tags únicos (aplana el array)
CREATE OR REPLACE FUNCTION get_all_tags()
RETURNS TABLE(tag text) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT unnest(tags) AS tag
  FROM directorio
  WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
  ORDER BY tag;
END;
$$ LANGUAGE plpgsql STABLE;
