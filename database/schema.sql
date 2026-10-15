-- Basic database design (for a future Django/PostgreSQL backend)
CREATE TABLE business_outlet (
  id SERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL, address TEXT, phone VARCHAR(20),
  gst_number VARCHAR(20), tax_rate DECIMAL(5,2) DEFAULT 5.00, created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE users (
  id SERIAL PRIMARY KEY, outlet_id INT NOT NULL REFERENCES business_outlet(id),
  name VARCHAR(100) NOT NULL, email VARCHAR(120) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin','manager','waiter','kitchen','cashier')), is_active BOOLEAN DEFAULT TRUE
);
CREATE TABLE restaurant_tables (
  id SERIAL PRIMARY KEY, outlet_id INT NOT NULL REFERENCES business_outlet(id),
  table_number INT NOT NULL, seats INT NOT NULL, status VARCHAR(15) DEFAULT 'available' CHECK (status IN ('available','occupied')),
  qr_code_url VARCHAR(255), UNIQUE (outlet_id, table_number)
);
CREATE TABLE menu_categories (
  id SERIAL PRIMARY KEY, outlet_id INT NOT NULL REFERENCES business_outlet(id), name VARCHAR(80) NOT NULL, sort_order INT DEFAULT 0
);
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY, category_id INT NOT NULL REFERENCES menu_categories(id), name VARCHAR(120) NOT NULL,
  description TEXT, price DECIMAL(10,2) NOT NULL, is_veg BOOLEAN DEFAULT TRUE, is_available BOOLEAN DEFAULT TRUE, image_url VARCHAR(255)
);
CREATE TABLE orders (
  id SERIAL PRIMARY KEY, outlet_id INT NOT NULL REFERENCES business_outlet(id), table_id INT NOT NULL REFERENCES restaurant_tables(id),
  created_by INT REFERENCES users(id), status VARCHAR(15) DEFAULT 'new' CHECK (status IN ('new','preparing','ready','served','cancelled')),
  is_paid BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY, order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INT NOT NULL REFERENCES menu_items(id), quantity INT NOT NULL CHECK (quantity > 0), unit_price DECIMAL(10,2) NOT NULL
);
CREATE TABLE bills_payments (
  id SERIAL PRIMARY KEY, order_id INT UNIQUE NOT NULL REFERENCES orders(id), subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL, discount_amount DECIMAL(10,2) DEFAULT 0, total DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(10) NOT NULL CHECK (payment_method IN ('cash','card','upi')), paid_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE inventory_items (
  id SERIAL PRIMARY KEY, outlet_id INT NOT NULL REFERENCES business_outlet(id), name VARCHAR(100) NOT NULL,
  unit VARCHAR(15) NOT NULL, quantity DECIMAL(10,2) DEFAULT 0, min_quantity DECIMAL(10,2) DEFAULT 0, updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY, outlet_id INT NOT NULL REFERENCES business_outlet(id), recorded_by INT REFERENCES users(id),
  title VARCHAR(150) NOT NULL, category VARCHAR(50) NOT NULL, amount DECIMAL(10,2) NOT NULL, expense_date DATE NOT NULL
);
