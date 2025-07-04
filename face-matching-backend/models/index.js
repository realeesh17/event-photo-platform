const faceapi = require('face-api.js');
const canvas = require('canvas');
const path = require('path');

// Patch the environment for face-api.js
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_URL = path.join(__dirname, 'models');

async function loadModels() {
  try {
    console.log("📦 Loading models from:", MODEL_URL);

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);

    console.log("✅ All models loaded successfully!");
  } catch (err) {
    console.error("❌ Error loading models:", err);
  }
}

loadModels();
