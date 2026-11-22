import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

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
    return true;
  } catch (err) {
    console.error(`Error writing ${fileName}:`, err);
    return false;
  }
};

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'The Gift Curator API',
    brand: 'The Gift Curator (Dubai, UAE)',
    timestamp: new Date().toISOString()
  });
});

// 2. Site Configuration
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

// 3. Products Catalogue
app.get('/api/products', async (req, res) => {
  const products = await readJsonFile('products.json');
  const { category, budget } = req.query;

  let filtered = [...products];

  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (budget === 'under-250') {
    filtered = filtered.filter(p => p.price < 250);
  } else if (budget === '250-350') {
    filtered = filtered.filter(p => p.price >= 250 && p.price <= 350);
  } else if (budget === 'above-350') {
    filtered = filtered.filter(p => p.price > 350);
  }

  res.json(filtered);
});

app.get('/api/products/:id', async (req, res) => {
  const products = await readJsonFile('products.json');
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// 4. Creations Portfolio
app.get('/api/creations', async (req, res) => {
  const creations = await readJsonFile('creations.json');
  res.json(creations);
});

// 5. FAQs & Policies
app.get('/api/faqs', async (req, res) => {
  const faqs = await readJsonFile('faqs.json');
  res.json(faqs);
});

// 6. Curate My Gift Enquiries (Lead Pipeline)
app.post('/api/enquiries', async (req, res) => {
  const { occasion, relationship, budget, interests, exclusions, deliveryArea, deliveryDate, senderName, senderContact } = req.body;

  if (!senderName || !senderContact) {
    return res.status(400).json({ error: 'Sender name and contact are required' });
  }

  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  const referenceId = `TGC-CUR-${year}-${random}`;

  const newEnquiry = {
    referenceId,
    timestamp: new Date().toISOString(),
    status: 'New',
    occasion: occasion || 'Not specified',
    relationship: relationship || 'Not specified',
    budget: budget || 'AED 150 – 250',
    interests: interests || [],
    exclusions: exclusions || '',
    deliveryArea: deliveryArea || 'Dubai',
    deliveryDate: deliveryDate || '',
    senderName,
    senderContact
  };

  const enquiries = await readJsonFile('enquiries.json');
  enquiries.unshift(newEnquiry);
  await writeJsonFile('enquiries.json', enquiries);

  res.status(201).json({
    success: true,
    message: 'Enquiry recorded successfully',
    referenceId,
    enquiry: newEnquiry
  });
});

app.get('/api/enquiries', async (req, res) => {
  const enquiries = await readJsonFile('enquiries.json');
  const { status } = req.query;
  if (status) {
    return res.json(enquiries.filter(e => e.status === status));
  }
  res.json(enquiries);
});

app.patch('/api/enquiries/:refId/status', async (req, res) => {
  const { refId } = req.params;
  const { status } = req.body;

  const enquiries = await readJsonFile('enquiries.json');
  const index = enquiries.findIndex(e => e.referenceId === refId);

  if (index === -1) {
    return res.status(404).json({ error: 'Enquiry reference not found' });
  }

  enquiries[index].status = status;
  enquiries[index].updatedAt = new Date().toISOString();
  await writeJsonFile('enquiries.json', enquiries);

  res.json({ success: true, enquiry: enquiries[index] });
});

// 7. CSV Export for Owner (Spreadsheet Workflow)
app.get('/api/enquiries/export', async (req, res) => {
  const enquiries = await readJsonFile('enquiries.json');
  const headers = ['Reference ID', 'Timestamp', 'Status', 'Sender Name', 'Contact', 'Occasion', 'Recipient', 'Budget', 'Interests', 'Delivery Area', 'Delivery Date'];

  const rows = enquiries.map(e => [
    `"${e.referenceId || ''}"`,
    `"${e.timestamp || ''}"`,
    `"${e.status || 'New'}"`,
    `"${e.senderName || e.contactName || ''}"`,
    `"${e.senderContact || e.contactPhone || ''}"`,
    `"${e.occasion || e.purpose || ''}"`,
    `"${e.relationship || ''}"`,
    `"${e.budget || e.budgetPerUnit || ''}"`,
    `"${(e.interests || []).join('; ')}"`,
    `"${e.deliveryArea || ''}"`,
    `"${e.deliveryDate || ''}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="the_gift_curator_leads_${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csv);
});

// 8. Corporate & Bulk RFQ
app.post('/api/corporate-rfq', async (req, res) => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  const referenceId = `TGC-CORP-${year}-${random}`;

  const rfq = {
    referenceId,
    timestamp: new Date().toISOString(),
    status: 'New',
    ...req.body
  };

  const enquiries = await readJsonFile('enquiries.json');
  enquiries.unshift(rfq);
  await writeJsonFile('enquiries.json', enquiries);

  res.status(201).json({
    success: true,
    referenceId,
    rfq
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  The Gift Curator API Server running on port ${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  Products API: http://localhost:${PORT}/api/products`);
  console.log(`  Enquiries API: http://localhost:${PORT}/api/enquiries`);
  console.log(`=======================================================`);
});
