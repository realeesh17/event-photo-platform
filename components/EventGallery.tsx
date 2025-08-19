"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import Image from "next/image";

type EventImage = {
  id: string;
  filePath: string;
  uploadedAt: { seconds: number; nanoseconds: number };
};

export default function EventGallery({ eventCode }: { eventCode: string }) {
  const [images, setImages] = useState<EventImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventCode) return;

    try {
      const q = query(
        collection(db, "images"),
        where("eventCode", "==", eventCode),
        orderBy("uploadedAt", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const imgs = snapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as EventImage)
          );
          setImages(imgs);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching images:", err);
          setError("Failed to load images.");
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error(err);
      setError("Unexpected error occurred.");
      setLoading(false);
    }
  }, [eventCode]);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Event Gallery</h2>

      {loading && <p className="text-gray-500">Loading images...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && images.length === 0 && (
        <p className="text-gray-500">No images uploaded yet.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative w-full h-40 rounded-lg overflow-hidden shadow hover:scale-105 transition-transform"
          >
            <Image
              src={img.filePath || "/placeholder.png"}
              alt="Event"
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
