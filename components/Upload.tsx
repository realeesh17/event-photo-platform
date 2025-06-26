// components/Upload.tsx
"use client";
import React, { useState } from "react";
import { storage, db } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const Upload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!image) return;
    setUploading(true);

    const storageRef = ref(storage, `images/${Date.now()}-${image.name}`);
    await uploadBytes(storageRef, image);

    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "images"), {
      url,
      createdAt: Timestamp.now(),
    });

    setImage(null);
    setUploading(false);
    alert("✅ Uploaded successfully!");
  };

  return (
    <div className="p-4 border rounded-xl bg-blue-50 text-center">
      <h2 className="text-lg font-bold mb-2">📤 Upload Photo</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        disabled={!image || uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default Upload;
