// firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDZ36BAV3WwwAECvOSWEfmdc3KnkLSzj8",
  authDomain: "facetag-real.firebaseapp.com",
  projectId: "facetag-real",
  storageBucket: "facetag-real.firebasestorage.app",
  messagingSenderId: "284389183358",
  appId: "1:284389183358:web:88eb6af8cc80d83ac3ad2f",
  measurementId: "G-7BGP29JBWP"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };
