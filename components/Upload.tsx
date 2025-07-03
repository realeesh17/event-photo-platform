"use client";
import React, { useState } from "react";
import { storage, db } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const Upload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [eventCode, setEventCode] = useState("demo123"); // Default event code

  const handleUpload = async () => {
    if (!image) return;
    setUploading(true);

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `event_photos/${eventCode}/${Date.now()}-${image.name}`);
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);

      // Save metadata to Firestore
      await addDoc(collection(db, "photos", eventCode, "images"), {
        imageURL: url,
        eventCode,
        uploadedBy: "Anonymous",
        timestamp: Timestamp.now(),
      });

      alert("✅ Uploaded successfully!");
      setImage(null);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("❌ Upload failed. Check console.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-blue-50 text-center">
      <h2 className="text-lg font-bold mb-2">📤 Upload Photo</h2>

      {/* Event Code Input */}
      <input
        type="text"
        placeholder="Enter Event Code"
        value={eventCode}
        onChange={(e) => setEventCode(e.target.value)}
        className="mb-2 px-2 py-1 rounded border text-sm w-full"
      />

      {/* Image Upload Input */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="mb-2 w-full"
      />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!image || uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default Upload;
