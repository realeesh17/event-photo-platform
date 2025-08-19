import ImageUploader from "@/components/ImageUploader";
import EventGallery from "@/components/EventGallery";
import Gallery from "@/components/Gallery";

export default function AdminMainPage() {
  const eventCode = "event123"; // later dynamic

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📸 Event Gallery</h1>

      {/* Upload Images */}
      <ImageUploader eventCode={eventCode} />

      {/* Live EventGallery */}
      <EventGallery eventCode={eventCode} />

      {/* Live Gallery */}
      <Gallery eventCode={eventCode} />

    </div>
  );
}
