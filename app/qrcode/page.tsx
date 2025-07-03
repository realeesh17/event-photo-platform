"use client";
import { useState, useRef } from "react";
import { QRCode } from "qrcode.react";

const QRGenerator = () => {
  const [eventCode, setEventCode] = useState("demo123");
  const inputRef = useRef<HTMLInputElement>(null);
  const url = `http://localhost:3000/event/${eventCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert("🔗 Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        📷 Generate QR for Event
      </h1>

      {/* Event Code Input */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter Event Code"
        value={eventCode}
        onChange={(e) => setEventCode(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-full max-w-xs text-center focus:outline-none focus:ring focus:border-blue-500"
      />

      {/* QR Box */}
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        {eventCode.trim() === "" ? (
          <p className="text-sm text-red-600 font-medium">Enter an event code first!</p>
        ) : (
          <>
            <QRCode value={url} size={200} />
            <p className="mt-4 text-sm text-blue-700 font-medium break-all">{url}</p>

            <button
              onClick={copyToClipboard}
              className="mt-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              📋 Copy Link
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QRGenerator;
