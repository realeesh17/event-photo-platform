import QRCodeGenerator from "@/components/QRCodeGenerator";

export default function QRCodePage() {
  const eventCode = "wedding123"; // temporary hardcoded value

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <QRCodeGenerator eventCode={eventCode} />
    </div>
  );
}
