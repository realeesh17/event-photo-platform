"use client";

import { useState, ChangeEvent } from "react";
import { storage, db } from "../firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ✅ Add correct prop typing
interface Props {
  eventCode: string;
}

export default function ImageUploader({ eventCode }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !eventCode) return alert("Please select a file and event code.");

    setUploading(true);
    try {
      const storageRef = ref(storage, `images/${eventCode}/${file.name}`);
      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "images"), {
        eventCode,
        imageURL: downloadURL,
        filename: file.name,
        timestamp: serverTimestamp(),
        faceDetected: false,
      });

      alert("✅ Uploaded & Metadata saved!");
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Use correct type for file input change
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
