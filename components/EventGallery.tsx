"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

interface Props {
  eventCode: string;
}

export default function EventGallery({ eventCode }: Props) {
  const [images, setImages] = useState<{ imageURL: string; filename: string }[]>([]);

  useEffect(() => {
    const q = query(collection(db, "images"), where("eventCode", "==", eventCode));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imgs = snapshot.docs.map((doc) => ({
        imageURL: doc.data().imageURL,
        filename: doc.data().filename,
      }));
      setImages(imgs);
    });

    return () => unsubscribe(); // Cleanup listener
  }, [eventCode]);

  if (!images.length) return <p className="text-center">No images yet...</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {images.map((img, idx) => (
        <div key={idx} className="border rounded-xl overflow-hidden shadow">
          <img src={img.imageURL} alt={img.filename} className="w-full h-48 object-cover" />
          <p className="text-sm p-2">{img.filename}</p>
        </div>
      ))}
    </div>
  );
}
