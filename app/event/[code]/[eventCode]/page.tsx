// app/event/[eventCode]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const EventGallery = () => {
  const { eventCode } = useParams();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesRef = collection(db, "photos", String(eventCode), "images");
        const snapshot = await getDocs(imagesRef);
        const urls: string[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.imageURL) {
            urls.push(data.imageURL);
          }
        });

        setImages(urls);
      } catch (error) {
        console.error("❌ Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
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
          {images.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Uploaded #${index + 1}`}
              className="rounded-xl shadow-md border border-blue-200 hover:scale-105 transition-transform duration-200"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventGallery;
