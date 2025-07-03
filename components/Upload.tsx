"use client";
import React, { useState } from "react";
import { storage, db } from "../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const Upload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [eventCode, setEventCode] = useState("demo123"); // Default code

  const handleUpload = async () => {
    if (!image || !eventCode.trim()) {
      alert("⚠️ Please select an image and enter an event code.");
      return;
    }

    setUploading(true);

    try {
      const filePath = `event_photos/${eventCode}/${Date.now()}-${image.name}`;
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(percent));
        },
        (error) => {
          console.error("❌ Upload error:", error);
          alert("❌ Upload failed.");
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          await addDoc(collection(db, "photos", eventCode, "images"), {
            imageURL: downloadURL,
            eventCode,
            uploadedBy: "Anonymous",
            timestamp: Timestamp.now(),
            filePath,
          });

          alert("✅ Photo uploaded successfully!");
          setImage(null);
          setProgress(0);
          setUploading(false);
        }
      );
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("❌ Something went wrong.");
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-blue-50 text-center max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4 text-blue-800">📤 Upload Event Photo</h2>

      {/* Event Code Input */}
      <input
        type="text"
        placeholder="Enter Event Code"
        value={eventCode}
        onChange={(e) => setEventCode(e.target.value)}
        className="mb-3 px-3 py-2 rounded border text-sm w-full"
      />

      {/* Image File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="mb-3 w-full"
      />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!image || uploading}
        className={`px-4 py-2 w-full rounded text-white font-medium ${
          uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-4 text-blue-700 font-medium text-sm">
          ⏳ Uploading... {progress}%
          <div className="w-full bg-blue-100 h-2 mt-1 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
