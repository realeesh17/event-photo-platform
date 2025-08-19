"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

interface Photo {
  id: string;
  imageUrl: string;
  uploaderId?: string;
  timestamp?: any; // Firestore Timestamp
}

export default function Gallery({ eventCode }: { eventCode: string }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventCode) return;

    const photosRef = collection(db, "events", eventCode, "photos");
    const q = query(photosRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const images: Photo[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Photo, "id">),
      }));
      setPhotos(images);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [eventCode]);

  if (loading) {
    return <p className="text-center text-gray-500">⏳ Loading gallery...</p>;
  }

  if (photos.length === 0) {
    return <p className="text-center text-gray-400">No photos uploaded yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="rounded-xl shadow overflow-hidden hover:scale-105 transition"
        >
          <img
            src={photo.imageUrl}
            alt="Event"
            className="w-full h-48 object-cover"
          />
          <div className="p-2 text-sm text-gray-600">
            Uploaded by: {photo.uploaderId || "Anonymous"}
          </div>
        </div>
      ))}
    </div>
  );
}
