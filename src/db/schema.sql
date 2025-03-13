-- Warehouse Locations Table
CREATE TABLE IF NOT EXISTS warehouse_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_code VARCHAR(20) NOT NULL UNIQUE,
  location_type VARCHAR(20) NOT NULL CHECK (location_type IN ('RACK', 'TARIMA', 'CHAMBER')),
  zone VARCHAR(10) NOT NULL,
  storage_type VARCHAR(20) NOT NULL CHECK (storage_type IN ('conservation', 'frozen')),
  max_capacity INTEGER NOT NULL,
  current_occupation INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory Items Table
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id VARCHAR(20) NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  location_id UUID REFERENCES warehouse_locations(id),
  lot_number VARCHAR(50),
  received_date DATE NOT NULL,
  expiration_date DATE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('in-stock', 'low-stock', 'out-of-stock', 'expired', 'reserved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Temperature Logs Table
CREATE TABLE IF NOT EXISTS temperature_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  storage_area VARCHAR(50) NOT NULL,
  temperature DECIMAL(5,2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('normal', 'warning', 'critical')),
  recorded_by VARCHAR(100) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quality Incidents Table
CREATE TABLE IF NOT EXISTS quality_incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  related_product_id UUID REFERENCES inventory_items(id),
  related_location_id UUID REFERENCES warehouse_locations(id),
  reported_by VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Inventory Movements Table (for tracking FIFO and movements)
CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_item_id UUID REFERENCES inventory_items(id),
  movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('reception', 'dispatch', 'transfer', 'return', 'adjustment')),
  from_location_id UUID REFERENCES warehouse_locations(id),
  to_location_id UUID REFERENCES warehouse_locations(id),
  quantity INTEGER NOT NULL,
  performed_by VARCHAR(100) NOT NULL,
  reference_code VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) NOT NULL UNIQUE,
  customer VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'urgent')),
  order_date DATE NOT NULL,
  shipping_date DATE,
  delivery_date DATE,
  total_items INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  inventory_item_id UUID REFERENCES inventory_items(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id VARCHAR(50) NOT NULL,
  audit_date DATE NOT NULL,
  auditor VARCHAR(100) NOT NULL,
  findings TEXT,
  status VARCHAR(20) NOT NULL CHECK (status IN ('passed', 'issues', 'failed')),
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_inventory_items_product_id ON inventory_items(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_location_id ON inventory_items(location_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_expiration_date ON inventory_items(expiration_date);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_inventory_item_id ON inventory_movements(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_temperature_logs_storage_area ON temperature_logs(storage_area);
CREATE INDEX IF NOT EXISTS idx_quality_incidents_status ON quality_incidents(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Create RLS policies
ALTER TABLE warehouse_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE temperature_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create basic policies (you'll want to customize these based on your auth setup)
CREATE POLICY "Allow all authenticated users to read warehouse_locations"
  ON warehouse_locations FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all authenticated users to read inventory_items"
  ON inventory_items FOR SELECT
  USING (auth.role() = 'authenticated');

-- Add more policies as needed for your specific authorization requirements
