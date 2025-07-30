"use client";

import { useState } from "react";

export default function TestAPIPage() {
  const [response, setResponse] = useState<string>("");

  const callMatchFaces = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/match-faces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventCode: "wedding2025",
          images: ["image1.jpg", "image2.jpg"], // test data
        }),
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(`Error: ${error}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Test Face Matching API</h1>
      <button
        onClick={callMatchFaces}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Call /match-faces
      </button>

      <pre className="mt-4 bg-gray-100 p-3 rounded">
        {response || "Click the button to test the API"}
      </pre>
    </div>
  );
}
