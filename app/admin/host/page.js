import { useState } from "react";

export default function HostEvent() {
  const [eventName, setEventName] = useState("");
  const [eventCode, setEventCode] = useState("");

  const handleCreateEvent = (e) => {
    e.preventDefault();

    // For now just generate a simple code
    const code = eventName.replace(/\s+/g, "").toLowerCase() + Math.floor(Math.random() * 1000);
    setEventCode(code);

    // TODO: Save to Firestore
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Host Event</h1>
        <form onSubmit={handleCreateEvent}>
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="border rounded-lg w-full p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 w-full rounded-lg"
          >
            Create Event
          </button>
        </form>

        {eventCode && (
          <div className="mt-6 text-center">
            <p className="text-lg">Event Code:</p>
            <p className="text-2xl font-bold text-blue-600">{eventCode}</p>
          </div>
        )}
      </div>
    </div>
  );
}
