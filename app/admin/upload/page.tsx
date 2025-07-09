import ImageUploader from "@/components/ImageUploader";

export default function AdminUploadPage() {
  return (
    <main className="flex justify-center items-center min-h-screen bg-blue-50">
      <ImageUploader eventCode="wedding2025" />
    </main>
  );
}
