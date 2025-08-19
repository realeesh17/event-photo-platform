"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AdminMain() {
  const [eventName, setEventName] = useState("");
  const [eventCode, setEventCode] = useState("");
  const [saved, setSaved] = useState(false);

  const generateEventCode = (name: string) => {
    const cleaned = name.toLowerCase().replace(/\s+/g, ""); // remove spaces
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit code
    return `${cleaned}-${randomNum}`;
  };

  const handleSaveEvent = async () => {
    if (!eventName.trim()) return alert("Enter an event name!");

    const code = generateEventCode(eventName);
    setEventCode(code);

    try {
      await addDoc(collection(db, "events"), {
        eventName,
        eventCode: code,
        createdAt: serverTimestamp(),
      });
      setSaved(true);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-md">
      <h1 className="text-xl font-bold text-center mb-4">Create New Event</h1>

      <input
        type="text"
        placeholder="Enter event name"
        className="w-full p-2 border rounded-lg mb-3"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />

      <button
        onClick={handleSaveEvent}
        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
      >
        Save Event
      </button>

      {saved && (
        <div className="mt-4 text-center">
          <p className="font-medium">✅ Event saved!</p>
          <p className="text-gray-600">Event Code: <b>{eventCode}</b></p>
        </div>
      )}
    </div>
  );
}
