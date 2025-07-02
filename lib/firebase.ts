import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDZ36BAV3WwwAECvOSWEfmdc3KnkLSzj8",
  authDomain: "facetag-real.firebaseapp.com",
  projectId: "facetag-real",
  storageBucket: "facetag-real.firebasestorage.app",
  messagingSenderId: "284389183358",
  appId: "1:284389183358:web:88eb6af8cc80d83ac3ad2f",
  measurementId: "G-7BGP29JBWP"
};

// Initialize Firebase only once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export { app };
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const db = getFirestore(app);