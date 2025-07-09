"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebase";
import { collection, getDocs, DocumentData } from "firebase/firestore";
export default function EventPage() {
  const { eventCode } = useParams();
  const [images, setImages] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
// we have to make this to return all we have/want
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesRef = collection(db, "images"); // from flat collection
        const snapshot = await getDocs(imagesRef);

        const eventImages = snapshot.docs
          .map((doc) => doc.data())
          .filter((data) => data.eventCode === String(eventCode) && data.imageURL);

        setImages(eventImages);
      } catch (error) {
        console.error("❌ Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventCode) fetchImages();
  }, [eventCode]);

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
        📸 Event Gallery: {eventCode}
      </h1>

      {loading ? (
        <p className="text-center text-blue-500">Loading images...</p>
      ) : images.length === 0 ? (
        <p className="text-center text-gray-600">No images found for this event.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <img
              key={index}
              src={img.imageURL}
              alt={img.filename || `Uploaded #${index + 1}`}
              className="rounded-xl shadow-md border border-blue-200 hover:scale-105 transition-transform duration-200"
            />
          ))}
        </div>
      )}
    </div>
  );
}
