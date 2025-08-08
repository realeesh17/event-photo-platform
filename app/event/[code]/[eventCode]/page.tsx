"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebase";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import Link from "next/link";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventPage() {
  const { eventCode } = useParams();
  const [images, setImages] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesRef = collection(db, "images");
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-primary">SnapShare</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Event Code: <span className="font-semibold">{eventCode}</span>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <p className="text-center text-blue-500">Loading images...</p>
        ) : images.length === 0 ? (
          <div className="text-center mt-12">
            <h2 className="text-xl font-semibold text-gray-600">No images found for this event.</h2>
            <p className="text-muted-foreground mt-2 mb-6">Try again later or check the event code.</p>
            <div className="flex justify-center gap-3">
              <Link href="/event">
                <Button variant="outline">Open another event</Button>
              </Link>
              <Link href="/">
                <Button>Back to Start</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
              📸 Event Gallery: {eventCode}
            </h1>
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
          </div>
        )}
      </main>
    </div>
  );
}
