"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import QRCode from "qrcode.react";

export default function Page() {
  const [eventName, setEventName] = useState("");
  const [eventCode, setEventCode] = useState("");
  const [saved, setSaved] = useState(false);

  // Generate a unique event code
  const generateEventCode = (name: string) => {
    const cleaned = name.toLowerCase().replace(/\s+/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random
    return `${cleaned}-${randomNum}`;
  };

  const handleSaveEvent = async () => {
    if (!eventName.trim()) return alert("Please enter an event name!");

    const code = generateEventCode(eventName);
    setEventCode(code);

    try {
      await addDoc(collection(db, "events"), {
        eventName,
        eventCode: code,
        createdAt: serverTimestamp(),
      });
      setSaved(true);
    } catch (err) {
      console.error("Error saving event:", err);
      alert("❌ Failed to save event.");
    }
  };

  // Copy QR content
  const handleCopy = () => {
    navigator.clipboard.writeText(`http://localhost:3000/user/main?eventCode=${eventCode}`);
    alert("✅ Event link copied!");
  };

  // Download QR as PNG
  const handleDownload = () => {
    const canvas = document.getElementById("qrCode") as HTMLCanvasElement;
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${eventCode}-QR.png`;
    downloadLink.click();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Create New Event</h1>

      <input
        type="text"
        placeholder="Enter event name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        className="w-full p-2 border rounded-lg mb-3"
      />

      <button
        onClick={handleSaveEvent}
        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 mb-4"
      >
        Save Event
      </button>

      {saved && (
        <div className="text-center">
          <p className="font-medium text-green-600">✅ Event saved successfully!</p>
          <p className="mt-1 mb-2">Event Code: <b>{eventCode}</b></p>

          {/* QR Code */}
          <QRCode
            id="qrCode"
            value={`http://localhost:3000/user/main?eventCode=${eventCode}`}
            size={180}
            className="mx-auto mb-2"
          />

          <div className="flex justify-center gap-3 mt-2">
            <button
              onClick={handleCopy}
              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              Copy Link
            </button>
            <button
              onClick={handleDownload}
              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              Download QR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
