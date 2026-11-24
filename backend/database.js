import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'gift_curator.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode and foreign keys for high performance
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    delivery_area TEXT,
    delivery_address TEXT,
    delivery_date TEXT,
    gift_note TEXT,
    items_json TEXT NOT NULL,
    subtotal REAL,
    delivery_fee REAL,
    total REAL NOT NULL,
    currency TEXT DEFAULT 'AED',
    payment_method TEXT,
    payment_status TEXT,
    order_status TEXT DEFAULT 'New',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'AED',
    method TEXT NOT NULL,
    status TEXT NOT NULL,
    transaction_ref TEXT UNIQUE NOT NULL,
    card_brand TEXT,
    card_last4 TEXT,
    details_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
  );
`);

// Password hashing helper (SHA-256 with salt)
export const hashPassword = (password) => {
  const salt = 'tgc_dubai_salt_2026';
  return crypto.createHash('sha256').update(password + salt).digest('hex');
};

// Seed default admin user if not exists
const checkAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('concierge@thegiftcuratordubai.com');
if (!checkAdmin) {
  const adminId = 'USR-ADMIN-01';
  const adminHash = hashPassword('curator2026');
  db.prepare(`
    INSERT INTO users (id, name, email, phone, password_hash, role, address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    adminId,
    'Chaitally (Founder & Lead Curator)',
    'concierge@thegiftcuratordubai.com',
    '+971 56 679 9672',
    adminHash,
    'admin',
    'Dubai, United Arab Emirates'
  );
}

// Seed a sample customer account for demo if empty
const checkDemoCustomer = db.prepare('SELECT id FROM users WHERE email = ?').get('client@example.com');
if (!checkDemoCustomer) {
  const custId = 'USR-CUST-001';
  const custHash = hashPassword('client123');
  db.prepare(`
    INSERT INTO users (id, name, email, phone, password_hash, role, address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    custId,
    'Fatima Al-Maktoum',
    'client@example.com',
    '+971 50 892 1144',
    custHash,
    'customer',
    'Villa 12, Frond E, Palm Jumeirah, Dubai'
  );
}

// Migrate existing orders.json if table is empty
const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get();
if (orderCount && orderCount.count === 0) {
  try {
    const ordersJsonPath = path.join(dbDir, 'orders.json');
    if (fs.existsSync(ordersJsonPath)) {
      const ordersData = JSON.parse(fs.readFileSync(ordersJsonPath, 'utf8'));
      const insertStmt = db.prepare(`
        INSERT INTO orders (id, customer_name, phone, email, delivery_area, delivery_date, items_json, subtotal, delivery_fee, total, currency, payment_status, order_status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const ord of ordersData) {
        insertStmt.run(
          ord.id,
          ord.customerName || 'Valued Client',
          ord.phone || '',
          ord.email || '',
          ord.deliveryArea || 'Dubai',
          ord.deliveryDate || '',
          JSON.stringify(ord.items || []),
          ord.subtotal || ord.total || 0,
          ord.deliveryFee || 0,
          ord.total || 0,
          'AED',
          ord.paymentStatus || 'Paid (Confirmed)',
          ord.orderStatus || 'New',
          ord.createdAt || new Date().toISOString()
        );
      }
    }
  } catch (err) {
    console.warn('Initial orders migration skipped:', err.message);
  }
}

// ==========================================
// User Operations
// ==========================================
export const findUserByEmail = (email) => {
  return db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email);
};

export const findUserById = (id) => {
  return db.prepare('SELECT id, name, email, phone, role, address, created_at FROM users WHERE id = ?').get(id);
};

export const createUser = ({ name, email, phone, password, address = '', role = 'customer' }) => {
  const id = `USR-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const password_hash = hashPassword(password);
  
  db.prepare(`
    INSERT INTO users (id, name, email, phone, password_hash, role, address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, email, phone, password_hash, role, address);

  return findUserById(id);
};

export const updateUserProfile = (id, { name, phone, address }) => {
  db.prepare(`
    UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), address = COALESCE(?, address)
    WHERE id = ?
  `).run(name, phone, address, id);

  return findUserById(id);
};

// ==========================================
// Order Operations
// ==========================================
export const createOrder = ({
  userId = null,
  customerName,
  phone,
  email = '',
  deliveryArea = 'Dubai',
  deliveryAddress = '',
  deliveryDate = '',
  giftNote = '',
  items = [],
  subtotal,
  deliveryFee = 0,
  total,
  paymentMethod = 'Credit / Debit Card',
  paymentStatus = 'Paid'
}) => {
  const nextId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const itemsJson = JSON.stringify(items);
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO orders (
      id, user_id, customer_name, phone, email, delivery_area,
      delivery_address, delivery_date, gift_note, items_json,
      subtotal, delivery_fee, total, currency, payment_method,
      payment_status, order_status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    nextId, userId, customerName, phone, email, deliveryArea,
    deliveryAddress, deliveryDate, giftNote, itemsJson,
    subtotal || total, deliveryFee, total, 'AED', paymentMethod,
    paymentStatus, 'New', createdAt
  );

  return getOrderById(nextId);
};

export const getOrderById = (id) => {
  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (!row) return null;
  return {
    ...row,
    items: JSON.parse(row.items_json || '[]')
  };
};

export const getOrdersByUserId = (userId) => {
  const rows = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  return rows.map(r => ({
    ...r,
    items: JSON.parse(r.items_json || '[]')
  }));
};

export const getAllOrders = () => {
  const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  return rows.map(r => ({
    ...r,
    items: JSON.parse(r.items_json || '[]')
  }));
};

export const updateOrderStatus = (id, { orderStatus, paymentStatus }) => {
  if (orderStatus && paymentStatus) {
    db.prepare('UPDATE orders SET order_status = ?, payment_status = ? WHERE id = ?').run(orderStatus, paymentStatus, id);
  } else if (orderStatus) {
    db.prepare('UPDATE orders SET order_status = ? WHERE id = ?').run(orderStatus, id);
  } else if (paymentStatus) {
    db.prepare('UPDATE orders SET payment_status = ? WHERE id = ?').run(paymentStatus, id);
  }
  return getOrderById(id);
};

// ==========================================
// Payment Operations
// ==========================================
export const createPayment = ({
  orderId,
  amount,
  method,
  status = 'completed',
  cardBrand = null,
  cardLast4 = null,
  details = {}
}) => {
  const id = `PAY-${Date.now()}`;
  const transactionRef = `TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO payments (
      id, order_id, amount, currency, method, status,
      transaction_ref, card_brand, card_last4, details_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, orderId, amount, 'AED', method, status,
    transactionRef, cardBrand, cardLast4, JSON.stringify(details), createdAt
  );

  // Update order's payment status
  if (status === 'completed') {
    db.prepare("UPDATE orders SET payment_status = 'Paid (Verified)' WHERE id = ?").run(orderId);
  }

  return {
    id,
    orderId,
    amount,
    currency: 'AED',
    method,
    status,
    transactionRef,
    cardBrand,
    cardLast4,
    createdAt
  };
};

export const getPaymentsForOrder = (orderId) => {
  return db.prepare('SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC').all(orderId);
};

export default db;
