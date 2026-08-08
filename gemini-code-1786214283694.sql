CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    current_stock NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    daily_demand NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    lead_time_days INT NOT NULL DEFAULT 1,
    safety_stock NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    unit_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    phone VARCHAR(50),
    tier VARCHAR(20) DEFAULT 'Tier 1',
    otif_score NUMERIC(5,2) DEFAULT 100.00,
    sqa_score NUMERIC(5,2) DEFAULT 100.00,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
    quantity NUMERIC(10,2) NOT NULL,
    total_value NUMERIC(10,2) NOT NULL,
    promised_delivery_date DATE NOT NULL,
    actual_delivery_date DATE,
    late_penalty_applied NUMERIC(10,2) DEFAULT 0.00,
    status VARCHAR(30) DEFAULT 'ISSUED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    sent_via_whatsapp BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO materials (sku, name, category, current_stock, daily_demand, lead_time_days, safety_stock, unit_price)
VALUES 
('RM-MILK-001', 'حليب خام طازج (لتر)', 'مواد خام', 450.00, 50.00, 8, 100.00, 1.20),
('RM-JUICE-002', 'مركز عصير برتقال', 'مواد خام', 1200.00, 30.00, 7, 90.00, 3.50),
('PKG-BOX-100', 'كرتون تغليف مقوى', 'تعبئة وتغليف', 2500.00, 200.00, 5, 300.00, 0.45)
ON CONFLICT (sku) DO NOTHING;