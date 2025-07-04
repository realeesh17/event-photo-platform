"use client";

import { useState } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const res = await fetch("/admin/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
  };

  return (
    <>
      {/* Floating button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-12 h-12 text-xl shadow-lg z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      {/* Chat box */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white shadow-2xl rounded-xl p-4 z-50 flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
          <h2 className="text-blue-600 font-bold text-lg mb-2">AI Assistant</h2>

          <div className="flex flex-col gap-2 mb-2 overflow-y-auto max-h-48">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-md text-sm ${
                  msg.role === "user"
                    ? "bg-blue-100 self-end"
                    : "bg-gray-100 self-start"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded-md p-2 text-sm"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
