"use client";

import { QRCode } from "qrcode.react";

interface QRCodeGeneratorProps {
  eventCode: string;
}

export default function QRCodeGenerator({ eventCode }: QRCodeGeneratorProps) {
  const url = `http://localhost:3000/event/${eventCode}`;

  return (
    <div className="p-4 bg-white rounded shadow w-fit">
      <p className="text-lg font-semibold mb-2">Scan QR to access event gallery</p>
      <QRCode value={url} size={200} />
      <p className="mt-2 text-sm break-all text-gray-600">{url}</p>
    </div>
  );
}
