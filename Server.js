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
    db = client.db("AppleTherapeutics"); // This creates your database
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
connectDB();

app.post('/requests', async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      timestamp: req.body.timestamp || new Date().toISOString()
    };
    
    // Saves the request into a collection called 'sample_requests'
    await db.collection('sample_requests').insertOne(requestData);
    console.log("New request saved:", requestData);
    
    res.status(200).json({ message: "Request captured successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save request" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));