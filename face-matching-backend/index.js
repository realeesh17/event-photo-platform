const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const faceapi = require("face-api.js");
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
const cors = require("cors");

const app = express();
const PORT = 5000;

// Setup canvas for face-api.js
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

app.use(cors());
app.use(express.json());

// Set up Multer to handle image uploads
const upload = multer({ dest: "uploads/" });

// Load face-api models
const MODEL_URL = path.join(__dirname, "models");

const loadModels = async () => {
  console.log("📦 Loading models from:", MODEL_URL);
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(MODEL_URL, "ssd_mobilenetv1"));
  await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(MODEL_URL, "face_landmark_68"));
  await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(MODEL_URL, "face_recognition"));
  console.log("✅ Models loaded!");
};

// API endpoint to upload an image and return face descriptors
app.post("/match", upload.single("image"), async (req, res) => {
  try {
    const imgPath = req.file.path;
    const img = await canvas.loadImage(imgPath);

    const detections = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors();

    // Clean up uploaded file after reading
    fs.unlinkSync(imgPath);

    res.json({
      message: "Face detection complete",
      faces: detections.length,
      descriptors: detections.map(d => Array.from(d.descriptor)), // Convert Float32Array to normal array
    });
  } catch (error) {
    console.error("❌ Error processing image:", error);
    res.status(500).json({ error: "Face processing failed" });
  }
});

// Start server
app.listen(PORT, async () => {
  await loadModels();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
