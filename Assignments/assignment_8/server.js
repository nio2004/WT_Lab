const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define API routes BEFORE static file middleware

// API Routes
// Get all consumers
app.get('/api/consumers', (req, res) => {
  const query = 'SELECT * FROM consumer';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Get consumer by ID
app.get('/api/consumers/:id', (req, res) => {
  const query = 'SELECT * FROM consumer WHERE id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Consumer not found' });
    }
    res.json(results[0]);
  });
});

// Create consumer
app.post('/api/consumers', (req, res) => {
  const { name, address, phone } = req.body;
  if (!name || !address || !phone) {
    return res.status(400).json({ error: 'Name, address, and phone are required' });
  }
  
  const query = 'INSERT INTO consumer (name, address, phone) VALUES (?, ?, ?)';
  db.query(query, [name, address, phone], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const newConsumer = {
      id: results.insertId,
      name,
      address,
      phone
    };
    res.status(201).json(newConsumer);
  });
});

// Calculate bill (without saving)
app.get('/api/calculate-bill', (req, res) => {
  const units = parseInt(req.query.units);
  if (isNaN(units) || units <= 0) {
    return res.status(400).json({ error: 'Valid units parameter is required' });
  }
  
  const amount = calculateBill(units);
  res.json({ units, amount });
});

// Generate and save bill
app.post('/api/billing', (req, res) => {
  const { consumerId, units } = req.body;
  if (!consumerId || !units || isNaN(parseInt(units)) || parseInt(units) <= 0) {
    return res.status(400).json({ error: 'Valid consumerId and units are required' });
  }
  
  // Check if consumer exists
  db.query('SELECT * FROM consumer WHERE id = ?', [consumerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Consumer not found' });
    }
    
    const consumer = results[0];
    const billAmount = calculateBill(parseInt(units));
    
    // Insert bill
    const query = 'INSERT INTO billing (consumer_id, units_consumed, bill_amount) VALUES (?, ?, ?)';
    db.query(query, [consumerId, units, billAmount], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const billResponse = {
        billId: results.insertId,
        consumerId,
        consumerName: consumer.name,
        unitsConsumed: parseInt(units),
        billAmount,
        billingDate: new Date().toISOString()
      };
      
      res.status(201).json(billResponse);
    });
  });
});

// Get billing history for a consumer
app.get('/api/billing/history/:consumerId', (req, res) => {
  const consumerId = req.params.consumerId;
  
  const query = `
    SELECT b.id as billId, b.consumer_id as consumerId, c.name as consumerName, 
           b.units_consumed as unitsConsumed, b.bill_amount as billAmount, 
           b.billing_date as billingDate
    FROM billing b
    JOIN consumer c ON b.consumer_id = c.id
    WHERE b.consumer_id = ?
    ORDER BY b.billing_date DESC
  `;
  
  db.query(query, [consumerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// AFTER defining API routes, then add static file middleware
app.use(express.static(path.join(__dirname)));

// Serve index.html for the root route (as a fallback)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // Change this to your MySQL password
  database: 'electricity_billing'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Utility function to calculate bill amount
function calculateBill(units) {
  let amount = 0;
  
  if (units <= 50) {
    amount = units * 3.50;
  } else if (units <= 150) {
    amount = 50 * 3.50 + (units - 50) * 4.00;
  } else if (units <= 250) {
    amount = 50 * 3.50 + 100 * 4.00 + (units - 150) * 5.20;
  } else {
    amount = 50 * 3.50 + 100 * 4.00 + 100 * 5.20 + (units - 250) * 6.50;
  }
  
  return parseFloat(amount.toFixed(2));
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});