"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeGeneratorProps {
  eventCode: string;
}

export default function QRCodeGenerator({ eventCode }: QRCodeGeneratorProps) {
  const url = `http://localhost:3000/event/${eventCode}`;
  const qrRef = useRef<SVGSVGElement | null>(null);

  // Download QR as PNG
  const handleDownload = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = `QR-${eventCode}.png`;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  // Share using Web Share API (mobile support)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Event QR Code",
          text: `Scan this QR code to view event: ${eventCode}`,
          url: url,
        });
      } catch (error) {
        console.error("Sharing failed", error);
      }
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow w-fit flex flex-col items-center">
      <p className="text-lg font-semibold mb-2">Scan QR to access event gallery</p>

      <QRCodeSVG ref={qrRef} value={url} size={200} />

      <p className="mt-2 text-sm break-all text-gray-600">{url}</p>

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Download
        </button>
        <button
          onClick={handleShare}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Share
        </button>
      </div>
    </div>
  );
}
