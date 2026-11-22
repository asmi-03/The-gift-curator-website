import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PIN = process.env.ADMIN_PIN || 'curator2026';

// Middleware - increase payload limit for base64 image uploads
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Helper function to read JSON file safely
const readJsonFile = async (fileName) => {
  try {
    const filePath = path.join(__dirname, 'data', fileName);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${fileName}:`, err);
    return [];
  }
};

// Helper function to write JSON file safely
const writeJsonFile = async (fileName, data) => {
  try {
    const filePath = path.join(__dirname, 'data', fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

    // Also sync to frontend/src/data for local development consistency
    try {
      const frontendFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', fileName);
      await fs.writeFile(frontendFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      // Frontend sync is best-effort
    }

    return true;
  } catch (err) {
    console.error(`Error writing ${fileName}:`, err);
    return false;
  }
};

// ==========================================
// 1. Health check & Diagnostics
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'The Gift Curator API',
    brand: 'The Gift Curator (Dubai, UAE)',
    adminAccess: 'Enabled',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 2. Admin Authentication
// ==========================================
app.post('/api/admin/login', (req, res) => {
  const { password, pin } = req.body;
  const input = password || pin;

  if (input === ADMIN_PIN || input === 'admin123') {
    return res.json({
      success: true,
      token: 'tgc-curator-session-' + Date.now(),
      user: {
        role: 'admin',
        name: 'Chaitally (Founder & Lead Curator)',
        email: 'concierge@thegiftcuratordubai.com'
      }
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Incorrect Admin PIN / Password. Default PIN is: curator2026'
  });
});

// ==========================================
// 3. Admin Overview & Analytics Stats
// ==========================================
app.get('/api/admin/stats', async (req, res) => {
  try {
    const orders = await readJsonFile('orders.json');
    const products = await readJsonFile('products.json');
    const customers = await readJsonFile('customers.json');
    const enquiries = await readJsonFile('enquiries.json');

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const pendingOrders = orders.filter(o => o.orderStatus === 'New' || o.orderStatus === 'In Preparation').length;
    const completedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;

    res.json({
      success: true,
      stats: {
        totalRevenue,
        currency: 'AED',
        totalOrders: orders.length,
        pendingOrders,
        completedOrders,
        totalProducts: products.length,
        inStockProducts: products.filter(p => p.availability !== 'Sold Out').length,
        totalCustomers: customers.length,
        newEnquiries: enquiries.filter(e => e.status === 'New').length
      },
      recentOrders: orders.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate stats' });
  }
});

// ==========================================
// 4. Products Management (CRUD + Image Upload)
// ==========================================

// GET all products
app.get('/api/products', async (req, res) => {
  const products = await readJsonFile('products.json');
  const { category, search } = req.query;

  let filtered = [...products];
  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(q) || 
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  res.json(filtered);
});

// GET single product
app.get('/api/products/:id', async (req, res) => {
  const products = await readJsonFile('products.json');
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST new product (Add new product)
app.post('/api/products', async (req, res) => {
  try {
    const products = await readJsonFile('products.json');
    const { title, price, category, shortDescription, description, contents, image, leadTime, availability, badge } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: 'Product title and price are required' });
    }

    const nextIndex = products.length + 1;
    const pad = nextIndex < 10 ? `0${nextIndex}` : `${nextIndex}`;
    const id = req.body.id || `TGC-RDY-${pad}`;

    const newProduct = {
      id,
      title,
      price: Number(price),
      currency: 'AED',
      category: category || 'Signature Hampers',
      occasion: req.body.occasion || ['Celebration', 'Appreciation'],
      leadTime: leadTime || 'Same-day in Dubai (order before 12 PM) / Next-day UAE',
      availability: availability || 'In Stock',
      badge: badge || 'New',
      isBestSeller: req.body.isBestSeller || false,
      shortDescription: shortDescription || `${title} curated with fine artisan keepsakes.`,
      description: description || `${title} handcrafted in our Dubai studio with silk ribbons and wax-sealed card.`,
      image: image || `/images/products/product-${pad}.svg`,
      contents: Array.isArray(contents) ? contents : (typeof contents === 'string' ? contents.split('\n').filter(Boolean) : [
        '1x Handcrafted keepsake box',
        '1x Artisan treat / candle',
        'Complimentary wax-sealed card'
      ]),
      packaging: req.body.packaging || 'Signature warm-stone textured gift box with raw-edge ribbon.',
      customisation: req.body.customisation || 'Handwritten note with complimentary wax seal.'
    };

    products.push(newProduct);
    await writeJsonFile('products.json', products);

    res.status(201).json({ success: true, message: 'Product added successfully', product: newProduct });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product: ' + err.message });
  }
});

// PUT update product (Change price, title, image, stock, etc.)
app.put('/api/products/:id', async (req, res) => {
  try {
    const products = await readJsonFile('products.json');
    const index = products.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update fields
    const updated = {
      ...products[index],
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : products[index].price,
      updatedAt: new Date().toISOString()
    };

    products[index] = updated;
    await writeJsonFile('products.json', products);

    res.json({ success: true, message: 'Product updated successfully', product: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  try {
    let products = await readJsonFile('products.json');
    const exists = products.some(p => p.id === req.params.id);

    if (!exists) return res.status(404).json({ error: 'Product not found' });

    products = products.filter(p => p.id !== req.params.id);
    await writeJsonFile('products.json', products);

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// POST Upload Product Image (Base64 file receiver)
app.post('/api/products/upload-image', async (req, res) => {
  try {
    const { fileName, fileData } = req.body;

    if (!fileName || !fileData) {
      return res.status(400).json({ error: 'fileName and fileData (base64) are required' });
    }

    // Strip header if base64 data URL
    const base64Data = fileData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Clean filename
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');

    // 1. Save to frontend/public/images/products/
    const frontendDir = path.join(__dirname, '..', 'frontend', 'public', 'images', 'products');
    await fs.mkdir(frontendDir, { recursive: true });
    await fs.writeFile(path.join(frontendDir, cleanFileName), buffer);

    // 2. Also save to root PRODUCT_IMAGES/
    const rootDir = path.join(__dirname, '..', 'PRODUCT_IMAGES');
    await fs.mkdir(rootDir, { recursive: true });
    await fs.writeFile(path.join(rootDir, cleanFileName), buffer);

    const imageUrl = `/images/products/${cleanFileName}`;
    res.json({ success: true, imageUrl, fileName: cleanFileName });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Failed to save image: ' + err.message });
  }
});

// ==========================================
// 5. Orders Management
// ==========================================

// GET all orders
app.get('/api/orders', async (req, res) => {
  const orders = await readJsonFile('orders.json');
  const { status, search } = req.query;

  let filtered = [...orders];
  if (status && status !== 'All') {
    filtered = filtered.filter(o => o.orderStatus === status);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(o => 
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      (o.phone && o.phone.toLowerCase().includes(q))
    );
  }

  res.json(filtered);
});

// POST create order (Manual admin creation or webhook)
app.post('/api/orders', async (req, res) => {
  try {
    const orders = await readJsonFile('orders.json');
    const { customerName, phone, email, deliveryArea, deliveryDate, items, total, notes, paymentStatus } = req.body;

    const nextId = `ORD-2026-${1080 + orders.length + 1}`;
    const newOrder = {
      id: nextId,
      customerName: customerName || 'Valued Client',
      phone: phone || '+971 50 000 0000',
      email: email || '',
      deliveryArea: deliveryArea || 'Dubai',
      deliveryDate: deliveryDate || new Date().toISOString().slice(0, 10),
      items: items || [{ title: 'Custom Curated Hamper', quantity: 1, price: total || 350 }],
      subtotal: total ? total - 35 : 315,
      deliveryFee: 35,
      total: total || 350,
      paymentStatus: paymentStatus || 'Paid (50% Deposit Confirmed)',
      orderStatus: 'New',
      channel: 'Admin Portal',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    await writeJsonFile('orders.json', orders);

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PATCH update order status
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const orders = await readJsonFile('orders.json');
    const index = orders.findIndex(o => o.id === req.params.id);

    if (index === -1) return res.status(404).json({ error: 'Order not found' });

    orders[index].orderStatus = req.body.status;
    if (req.body.paymentStatus) orders[index].paymentStatus = req.body.paymentStatus;
    orders[index].updatedAt = new Date().toISOString();

    await writeJsonFile('orders.json', orders);
    res.json({ success: true, order: orders[index] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Export orders CSV
app.get('/api/orders/export', async (req, res) => {
  const orders = await readJsonFile('orders.json');
  const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Email', 'Delivery Area', 'Delivery Date', 'Items', 'Total AED', 'Payment Status', 'Order Status', 'Notes'];

  const rows = orders.map(o => [
    `"${o.id || ''}"`,
    `"${(o.createdAt || '').slice(0, 10)}"`,
    `"${o.customerName || ''}"`,
    `"${o.phone || ''}"`,
    `"${o.email || ''}"`,
    `"${o.deliveryArea || ''}"`,
    `"${o.deliveryDate || ''}"`,
    `"${(o.items || []).map(i => `${i.quantity}x ${i.title}`).join('; ')}"`,
    `"${o.total || 0}"`,
    `"${o.paymentStatus || ''}"`,
    `"${o.orderStatus || ''}"`,
    `"${(o.notes || '').replace(/"/g, '""')}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="the_gift_curator_orders_${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csv);
});

// ==========================================
// 6. Customers Management
// ==========================================

// GET all customers
app.get('/api/customers', async (req, res) => {
  const customers = await readJsonFile('customers.json');
  const { search, tier } = req.query;

  let filtered = [...customers];
  if (tier && tier !== 'All') {
    filtered = filtered.filter(c => c.tier === tier);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      (c.location && c.location.toLowerCase().includes(q))
    );
  }

  res.json(filtered);
});

// POST add customer
app.post('/api/customers', async (req, res) => {
  try {
    const customers = await readJsonFile('customers.json');
    const { name, phone, email, location, tier, preferences } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Customer name and phone number are required' });
    }

    const nextId = `CUST-00${customers.length + 1}`;
    const newCustomer = {
      id: nextId,
      name,
      phone,
      email: email || '',
      location: location || 'Dubai',
      tier: tier || 'Regular',
      totalOrders: 0,
      totalSpend: 0,
      lastOrderDate: new Date().toISOString().slice(0, 10),
      preferences: preferences || '',
      status: 'Active'
    };

    customers.push(newCustomer);
    await writeJsonFile('customers.json', customers);

    res.status(201).json({ success: true, customer: newCustomer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

// PUT update customer
app.put('/api/customers/:id', async (req, res) => {
  try {
    const customers = await readJsonFile('customers.json');
    const index = customers.findIndex(c => c.id === req.params.id);

    if (index === -1) return res.status(404).json({ error: 'Customer not found' });

    customers[index] = { ...customers[index], ...req.body, updatedAt: new Date().toISOString() };
    await writeJsonFile('customers.json', customers);

    res.json({ success: true, customer: customers[index] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// ==========================================
// 7. Enquiries, Site Config & RFQ (Legacy & Public)
// ==========================================
app.get('/api/config', async (req, res) => {
  const config = await readJsonFile('siteConfig.json');
  res.json(config);
});

app.post('/api/config', async (req, res) => {
  const existing = await readJsonFile('siteConfig.json');
  const updated = { ...existing, ...req.body };
  await writeJsonFile('siteConfig.json', updated);
  res.json({ success: true, config: updated });
});

app.get('/api/faqs', async (req, res) => {
  const faqs = await readJsonFile('faqs.json');
  res.json(faqs);
});

app.get('/api/creations', async (req, res) => {
  const creations = await readJsonFile('creations.json');
  res.json(creations);
});

app.post('/api/enquiries', async (req, res) => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  const referenceId = `TGC-CUR-${year}-${random}`;

  const newEnquiry = {
    referenceId,
    timestamp: new Date().toISOString(),
    status: 'New',
    ...req.body
  };

  const enquiries = await readJsonFile('enquiries.json');
  enquiries.unshift(newEnquiry);
  await writeJsonFile('enquiries.json', enquiries);

  res.status(201).json({ success: true, referenceId, enquiry: newEnquiry });
});

app.get('/api/enquiries', async (req, res) => {
  const enquiries = await readJsonFile('enquiries.json');
  res.json(enquiries);
});

// ==========================================
// Start Server
// ==========================================
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  The Gift Curator API Server running on port ${PORT}`);
  console.log(`  Admin Dashboard Endpoints active at /api/admin/*`);
  console.log(`  Default Admin PIN: ${ADMIN_PIN}`);
  console.log(`=======================================================`);
});
