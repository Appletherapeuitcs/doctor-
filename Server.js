const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

// PASTE YOUR MONGODB CONNECTION STRING HERE
const uri = "mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority"; 
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("AppleTherapeutics");
    console.log("✅ Connected to MongoDB successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    // Don't crash the whole app if DB fails to connect initially
  }
}
connectDB();

app.post('/requests', async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      timestamp: req.body.timestamp || new Date().toISOString()
    };
    
    await db.collection('sample_requests').insertOne(requestData);
    console.log("📦 New request saved:", requestData);
    
    res.status(200).json({ message: "Request captured successfully" });
  } catch (error) {
    console.error("❌ Error saving request:", error);
    res.status(500).json({ error: "Failed to save request" });
  }
});

// THE FIX FOR RENDER: Explicitly bind to 0.0.0.0
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running and listening on port ${PORT}`);
});
