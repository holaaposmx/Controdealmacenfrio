-- Create warehouse_locations table
CREATE TABLE IF NOT EXISTS warehouse_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_code TEXT NOT NULL UNIQUE,
  location_type TEXT NOT NULL CHECK (location_type IN ('RACK', 'TARIMA', 'CHAMBER')),
  zone TEXT NOT NULL,
  storage_type TEXT NOT NULL CHECK (storage_type IN ('conservation', 'frozen')),
  max_capacity INTEGER NOT NULL,
  current_occupation INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  location_id UUID REFERENCES warehouse_locations(id),
  lot_number TEXT,
  received_date DATE NOT NULL,
  expiration_date DATE,
  status TEXT NOT NULL CHECK (status IN ('in-stock', 'low-stock', 'out-of-stock', 'expired', 'reserved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create temperature_logs table
CREATE TABLE IF NOT EXISTS temperature_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  storage_area TEXT NOT NULL,
  temperature NUMERIC(5,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('normal', 'warning', 'critical')),
  recorded_by TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quality_incidents table
CREATE TABLE IF NOT EXISTS quality_incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_type TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  related_product_id UUID REFERENCES inventory_items(id),
  related_location_id UUID REFERENCES warehouse_locations(id),
  reported_by TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create inventory_movements table
CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_item_id UUID REFERENCES inventory_items(id),
  movement_type TEXT NOT NULL CHECK (movement_type IN ('reception', 'dispatch', 'transfer', 'return', 'adjustment')),
  from_location_id UUID REFERENCES warehouse_locations(id),
  to_location_id UUID REFERENCES warehouse_locations(id),
  quantity INTEGER NOT NULL,
  performed_by TEXT NOT NULL,
  reference_code TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'urgent')),
  order_date DATE NOT NULL,
  shipping_date DATE,
  delivery_date DATE,
  total_items INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  inventory_item_id UUID REFERENCES inventory_items(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id TEXT NOT NULL,
  audit_date DATE NOT NULL,
  auditor TEXT NOT NULL,
  findings TEXT,
  status TEXT NOT NULL CHECK (status IN ('passed', 'issues', 'failed')),
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security but allow all operations for now
ALTER TABLE warehouse_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE temperature_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for now
DROP POLICY IF EXISTS "Allow all operations on warehouse_locations" ON warehouse_locations;
CREATE POLICY "Allow all operations on warehouse_locations" ON warehouse_locations FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on inventory_items" ON inventory_items;
CREATE POLICY "Allow all operations on inventory_items" ON inventory_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on temperature_logs" ON temperature_logs;
CREATE POLICY "Allow all operations on temperature_logs" ON temperature_logs FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on quality_incidents" ON quality_incidents;
CREATE POLICY "Allow all operations on quality_incidents" ON quality_incidents FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on inventory_movements" ON inventory_movements;
CREATE POLICY "Allow all operations on inventory_movements" ON inventory_movements FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on order_items" ON order_items;
CREATE POLICY "Allow all operations on order_items" ON order_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on audit_logs" ON audit_logs;
CREATE POLICY "Allow all operations on audit_logs" ON audit_logs FOR ALL USING (true);

-- Enable realtime for all tables
alter publication supabase_realtime add table warehouse_locations;
alter publication supabase_realtime add table inventory_items;
alter publication supabase_realtime add table temperature_logs;
alter publication supabase_realtime add table quality_incidents;
alter publication supabase_realtime add table inventory_movements;
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table order_items;
alter publication supabase_realtime add table audit_logs;

-- Insert some initial data for warehouse locations
INSERT INTO warehouse_locations (location_code, location_type, zone, storage_type, max_capacity, current_occupation)
VALUES
  ('RACK-A1', 'RACK', 'Zone A', 'conservation', 100, 0),
  ('RACK-A2', 'RACK', 'Zone A', 'conservation', 100, 0),
  ('RACK-B1', 'RACK', 'Zone B', 'conservation', 100, 0),
  ('RACK-B2', 'RACK', 'Zone B', 'conservation', 100, 0),
  ('RACK-C1', 'RACK', 'Zone C', 'conservation', 100, 0),
  ('TARIMA-A1', 'TARIMA', 'Zone A', 'conservation', 200, 0),
  ('TARIMA-B1', 'TARIMA', 'Zone B', 'conservation', 200, 0),
  ('TARIMA-C1', 'TARIMA', 'Zone C', 'conservation', 200, 0),
  ('CHAMBER-1', 'CHAMBER', 'Cold Zone', 'frozen', 500, 0),
  ('CHAMBER-2', 'CHAMBER', 'Cold Zone', 'frozen', 500, 0)
ON CONFLICT (location_code) DO NOTHING;