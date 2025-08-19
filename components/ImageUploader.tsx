"use client";

import { useState } from "react";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface Props {
  eventCode: string;
  uploaderName?: string; // optional, defaults to "Admin"
}

export default function ImageUploader({ eventCode, uploaderName = "Admin" }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        // Upload to Firebase Storage
        const storageRef = ref(storage, `events/${eventCode}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Save metadata to Firestore
        await addDoc(collection(db, "events", eventCode, "images"), {
          eventCode,
          fileName: file.name,
          imageUrl: downloadURL,
          uploaderName,
          uploadedAt: serverTimestamp(),
          faceDetected: false, // default until backend processes
        });
      }

      alert("✅ Upload successful! Metadata saved.");
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-xl shadow-md max-w-md">
      <label className="block font-semibold mb-2">📤 Upload Event Images</label>
      <input
        type="file"
        multiple
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full p-2 border rounded text-sm text-gray-600"
      />
      {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
    </div>
  );
}
