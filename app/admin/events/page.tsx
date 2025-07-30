"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import QRCodeGenerator from "@/components/QRCodeGenerator";

type EventType = {
  docId: string;
  eventCode: string;
  eventName: string;
};

export default function AdminEvents() {
  const [eventCode, setEventCode] = useState("");
  const [eventName, setEventName] = useState("");
  const [events, setEvents] = useState<EventType[]>([]);

  // Real-time Firestore listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const eventData = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...(doc.data() as Omit<EventType, "docId">),
      }));
      setEvents(eventData);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleCreateEvent = async () => {
    if (!eventCode || !eventName) {
      alert("Please fill both fields!");
      return;
    }

    await addDoc(collection(db, "events"), {
      eventCode,
      eventName,
      createdAt: serverTimestamp(),
    });

    setEventCode("");
    setEventName("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📋 Admin: Event Management</h1>

      {/* Event Form */}
      <div className="mb-8 flex gap-3">
        <input
          type="text"
          placeholder="Event Code (e.g. wedding2025)"
          value={eventCode}
          onChange={(e) => setEventCode(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={handleCreateEvent}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ➕ Create Event
        </button>
      </div>

      {/* Event List */}
      {events.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.docId}
              className="border p-4 rounded shadow bg-white flex flex-col items-center"
            >
              <h2 className="text-lg font-bold mb-2">{event.eventName}</h2>
              <p className="text-gray-600 mb-3">Code: {event.eventCode}</p>
              <QRCodeGenerator eventCode={event.eventCode} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
