-- =============================================
-- VICENZA MIAMI - Inventario de Brillantería
-- Ejecutar en: Supabase SQL Editor
-- =============================================

-- 1. Tabla de Proveedores
CREATE TABLE IF NOT EXISTS proveedores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  contacto TEXT,
  telefono TEXT,
  email TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla principal de Productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sku TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT,                    -- Bracelet, Ring, Chain, Earring, Necklace, Pendant, Choker
  quilates TEXT,                -- 10KT, 14KT, 18KT
  costo NUMERIC(10,2),         -- Purchase Cost (precio del proveedor)
  tag_price NUMERIC(10,2),     -- Tag Price (x4)
  wholesale NUMERIC(10,2),     -- Wholesale (x1.33)
  retail NUMERIC(10,2),        -- Retail (x2)
  proveedor_id UUID REFERENCES proveedores(id),
  proveedor_nombre TEXT,       -- Cache del nombre del proveedor
  piezas INTEGER DEFAULT 1,
  peso_bruto NUMERIC(8,3),
  peso_oro NUMERIC(8,3),
  color_oro TEXT,               -- Yellow Gold, White Gold, Rose Gold, Tri-Color
  diseno TEXT,                  -- Butterfly, Heart, Tennis, Snake, etc.
  titulo_shopify TEXT,          -- Generated Shopify title
  descripcion_shopify TEXT,     -- Generated Shopify description
  diamantes JSONB,             -- Array de {tipo, peso} ej: [{"tipo":"DIA VM10","peso":6.55}]
  piedras_color JSONB,         -- Piedras de color (esmeraldas, etc)
  foto_url TEXT,               -- URL foto profesional
  notas TEXT,
  status TEXT DEFAULT 'activo', -- activo, vendido, apartado
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabla de Fotos (múltiples fotos por producto)
CREATE TABLE IF NOT EXISTS producto_fotos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  tipo TEXT DEFAULT 'profesional',  -- profesional, proveedor
  nombre_archivo TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);
CREATE INDEX IF NOT EXISTS idx_productos_proveedor ON productos(proveedor_id);
CREATE INDEX IF NOT EXISTS idx_productos_tipo ON productos(tipo);
CREATE INDEX IF NOT EXISTS idx_productos_status ON productos(status);
CREATE INDEX IF NOT EXISTS idx_producto_fotos_producto ON producto_fotos(producto_id);

-- 5. Habilitar RLS (Row Level Security) pero permitir acceso autenticado
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE producto_fotos ENABLE ROW LEVEL SECURITY;

-- Políticas: usuarios autenticados pueden hacer todo
CREATE POLICY "Authenticated users full access proveedores" ON proveedores
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access productos" ON productos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access producto_fotos" ON producto_fotos
  FOR ALL USING (auth.role() = 'authenticated');

-- 6. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 7. Crear bucket de storage para fotos
INSERT INTO storage.buckets (id, name, public)
VALUES ('producto-fotos', 'producto-fotos', true)
ON CONFLICT (id) DO NOTHING;

-- Política de storage: autenticados pueden subir/leer
CREATE POLICY "Authenticated upload producto-fotos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'producto-fotos' AND auth.role() = 'authenticated');

CREATE POLICY "Public read producto-fotos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'producto-fotos');
