"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import Image from "next/image";

export default function EventGallery({ eventCode }: { eventCode: string }) {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    if (!eventCode) return;

    const q = query(
      collection(db, "images"),
      where("eventCode", "==", eventCode),
      orderBy("uploadedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setImages(imgs);
    });

    return () => unsubscribe();
  }, [eventCode]);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Event Gallery</h2>
      {images.length === 0 ? (
        <p className="text-gray-500">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative w-full h-40 rounded-lg overflow-hidden shadow">
              <Image
                src={img.filePath}
                alt="Event"
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
