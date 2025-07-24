"use client";

import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { app } from "../firebase"; // your firebase.js config

const storage = getStorage(app);
const db = getFirestore(app);

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [eventCode, setEventCode] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file || !eventCode) {
      alert("Please select a file and enter event code");
      return;
    }

    try {
      setUploading(true);
      setMessage("Uploading...");

      const fileRef = ref(storage, `${eventCode}/${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      await addDoc(collection(db, "eventPhotos"), {
        eventCode,
        fileName: file.name,
        url: downloadURL,
        uploadedAt: Timestamp.now(),
      });

      setMessage("Upload & metadata saved successfully ✅");
      setFile(null);
      setEventCode("");
    } catch (error) {
      console.error("Error uploading:", error);
      setMessage("Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-primary">Upload Event Photo</h2>

      <input
        type="text"
        placeholder="Enter Event Code"
        value={eventCode}
        onChange={(e) => setEventCode(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <input
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
          } else {
            setFile(null);
          }
        }}
        className="w-full p-2 mb-4 border rounded"
      />

      <button
        onClick={handleUpload}
        className="w-full bg-accent text-white font-semibold py-2 px-4 rounded hover:bg-blue-500 disabled:opacity-50"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
