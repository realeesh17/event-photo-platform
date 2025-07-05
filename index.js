// index.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const faceapi = require('face-api.js');
const canvas = require('canvas');

// Setup face-api.js with canvas for Node.js
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const app = express();
const PORT = process.env.PORT || 5000;

// 📁 Serve uploaded files publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📂 Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// 🧠 Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

// 📍 Path to face-api models
const MODEL_URL = path.join(__dirname, 'models');

// 🧠 Load models from disk
console.log("📦 Loading face-api models...");
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL),
  faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL),
  faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL)
]).then(() => {
  console.log('✅ Face-api models loaded successfully');

  // 🧪 Root Test Route
  app.get('/', (req, res) => {
    res.send('🚀 Face Matching Backend is running 🎯');
  });

  // 📤 Upload Route
  app.post('/upload', upload.single('image'), (req, res) => {
    res.json({ file: req.file });
  });

  // 🔍 Face Matching Route
  app.post('/match', upload.fields([{ name: 'image1' }, { name: 'image2' }]), async (req, res) => {
    try {
      const img1 = await canvas.loadImage(req.files['image1'][0].path);
      const img2 = await canvas.loadImage(req.files['image2'][0].path);

      const desc1 = await faceapi.computeFaceDescriptor(img1);
      const desc2 = await faceapi.computeFaceDescriptor(img2);

      const distance = faceapi.euclideanDistance(desc1, desc2);
      const match = distance < 0.5;

      res.json({ match, distance });
    } catch (error) {
      console.error('❌ Error during face match:', error);
      res.status(500).json({ error: 'Face matching failed', details: error.message });
    }
  });

  // 🟢 Start server
  app.listen(PORT, () => {
    console.log(`✅ Server running at: http://localhost:${PORT}`);
  });

}).catch((err) => {
  console.error('❌ Failed to load models:', err);
});
