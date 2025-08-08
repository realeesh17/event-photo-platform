// firebaseAdmin.js
import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

// Initialize Firebase Admin using service account credentials
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  storageBucket: "facetag-real.appspot.com", // your storage bucket
});

// Export Firestore and Storage
export const db = admin.firestore();
export const bucket = admin.storage().bucket();
