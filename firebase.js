// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔁 Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCDZ36BAV3WwwAECvOSWEfmdc3KnkLSzj8",
  authDomain: "facetag-real.firebaseapp.com",
  projectId: "facetag-real",
  storageBucket: "facetag-real.firebasestorage.app",
  messagingSenderId: "284389183358",
  appId: "1:284389183358:web:88eb6af8cc80d83ac3ad2f",
  measurementId: "G-7BGP29JBWP"
};

// ✅ Initialize app
const app = initializeApp(firebaseConfig);

// (Optional) Export Firestore and Storage directly
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
