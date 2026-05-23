const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

// 1. Allow the Hostinger website to fetch data
const corsOptions = {
  origin: ['https://palegreen-dotterel-629054.hostingersite.com', 'http://localhost:3000'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 2. CONNECT TO MONGODB (Updated with exact credentials)
const uri = "mongodb+srv://digital_db_user:Apple2026@cluster0.cmdl06a.mongodb.net/?appName=Cluster0"; 
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("AppleTherapeutics");
    console.log("✅ Connected to MongoDB successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}
connectDB(); // This triggers the connection!

// 3. ROUTE TO RECEIVE DATA FROM DOCTORS
app.post('/requests', async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      timestamp: req.body.timestamp || new Date().toISOString()
    };
    
    await db.collection('sample_requests').insertOne(requestData);
    console.log("📦 New request saved:", requestData.product_name);
    res.status(200).json({ message: "Request captured successfully" });
  } catch (error) {
    console.error("❌ Error saving request:", error);
    res.status(500).json({ error: "Failed to save request" });
  }
});

// 4. ROUTE TO SEND DATA TO ADMIN DASHBOARD
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const allRequests = await db.collection('sample_requests').find().sort({ timestamp: -1 }).toArray();
    res.status(200).json(allRequests);
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

// 5. ROUTE TO CLEAR DATABASE (Requires Admin Action)
app.delete('/api/admin/reset', async (req, res) => {
  try {
    // deleteMany({}) deletes all documents inside the collection
    await db.collection('sample_requests').deleteMany({});
    console.log("🗑️ Database wiped clean for the new week.");
    res.status(200).json({ message: "Database reset successfully" });
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    res.status(500).json({ error: "Failed to reset database" });
  }
});


// 5. START THE SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running and listening on port ${PORT}`);
});

