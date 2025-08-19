"use client";

import { useState, ChangeEvent } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db, auth } from "@/lib/firebase";

// ✅ Define props clearly
interface Props {
  eventCode: string;
}

export default function ImageUploader({ eventCode }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // ✅ Handle file upload
  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");
    if (!eventCode) return alert("No event code provided.");

    setUploading(true);
    try {
      // 1. Upload file to Firebase Storage
      const fileRef = ref(storage, `events/${eventCode}/${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      // 2. Save metadata in Firestore
      await addDoc(collection(db, "events", eventCode, "photos"), {
        eventCode,
        imageUrl: downloadURL,
        filename: file.name,
        uploaderId: auth.currentUser?.uid || "anonymous",
        timestamp: serverTimestamp(),
        faceDetected: false, // reserved for later backend processing
      });

      alert("✅ Image uploaded & metadata saved!");
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Upload failed. Check console.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-4 rounded-xl shadow bg-white w-full max-w-md">
      <h2 className="text-xl font-bold mb-2">📸 Upload Image</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl w-full"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
