"use client";
import { useState } from "react";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface Props {
  eventCode: string;
}

export default function ImageUploader({ eventCode }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        // Upload to Storage
        const storageRef = ref(storage, `events/${eventCode}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Save metadata to Firestore
        await addDoc(collection(db, "events", eventCode, "images"), {
          eventCode,
          imageUrl: downloadURL,
          fileName: file.name,
          uploadedAt: serverTimestamp(),
        });
      }
      alert("✅ Upload successful!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Upload failed, check console");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-6">
      <label className="block font-semibold mb-2">Upload Event Images</label>
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
