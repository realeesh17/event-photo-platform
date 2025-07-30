// index.js (face-matching-backend)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// TensorFlow for Node (faster inference)
require('@tensorflow/tfjs-node');

const faceapi = require('face-api.js');
const canvas = require('canvas');
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const app = express();

const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
const MATCH_THRESHOLD = parseFloat(process.env.MATCH_THRESHOLD || '0.5');

// ------------ Middleware ------------
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------ Static uploads ------------
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// ------------ Multer (images only) ------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`)
});

const fileFilter = (req, file, cb) => {
  const ok = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.mimetype);
  if (!ok) return cb(new Error('Only image files are allowed (jpg, png, webp).'));
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 } // 8MB
});

// ------------ Model loading ------------
const MODEL_URL = path.join(__dirname, 'face-models'); // <-- keep models here

async function loadModels() {
  console.log('📦 Loading face-api models from:', MODEL_URL);
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
  console.log('✅ Face-api models loaded successfully');
}

// Utility: detect a single face & return descriptor
async function getSingleFaceDescriptor(img) {
  const result = await faceapi
    .detectSingleFace(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
    .withFaceLandmarks()
    .withFaceDescriptor();

  return result ? result.descriptor : null;
}

// ------------ Routes ------------
app.get('/', (req, res) => {
  res.send('🚀 Face Matching Backend is running 🎯');
});

app.get('/health', (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.get('/version', (req, res) => {
  res.json({
    faceapi: 'v0.x',
    tfjs: 'node',
    threshold: MATCH_THRESHOLD
  });
});

// Single-file upload (debug)
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ file: req.file, url: `/uploads/${path.basename(req.file.path)}` });
});

// Face matching: compare two images (image1 vs image2)
app.post(
  '/match',
  upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]),
  async (req, res) => {
    const cleanup = () => {
      try {
        if (req.files?.image1?.[0]?.path) fs.unlinkSync(req.files.image1[0].path);
        if (req.files?.image2?.[0]?.path) fs.unlinkSync(req.files.image2[0].path);
      } catch (_) {}
    };

    try {
      if (!req.files || !req.files.image1 || !req.files.image2) {
        return res.status(400).json({ error: 'Both image1 and image2 are required.' });
      }

      const imgPath1 = req.files.image1[0].path;
      const imgPath2 = req.files.image2[0].path;

      const img1 = await canvas.loadImage(imgPath1);
      const img2 = await canvas.loadImage(imgPath2);

      // extract descriptors
      const [desc1, desc2] = await Promise.all([
        getSingleFaceDescriptor(img1),
        getSingleFaceDescriptor(img2)
      ]);

      if (!desc1) {
        cleanup();
        return res.status(422).json({ error: 'No single face detected in image1.' });
      }
      if (!desc2) {
        cleanup();
        return res.status(422).json({ error: 'No single face detected in image2.' });
      }

      const distance = faceapi.euclideanDistance(desc1, desc2);
      const match = distance < MATCH_THRESHOLD;

      cleanup();
      return res.json({ match, distance, threshold: MATCH_THRESHOLD });
    } catch (error) {
      console.error('❌ Error during face match:', error);
      cleanup();
      return res.status(500).json({ error: 'Face matching failed', details: error.message });
    }
  }
);

// ------------ Start ------------
loadModels()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running at: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to load models:', err);
    process.exit(1);
  });
