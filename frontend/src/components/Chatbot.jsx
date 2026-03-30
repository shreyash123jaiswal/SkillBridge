import { useState } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import { api } from "../api";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I'm your AI assistant. How can I help you?" }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.chat(input, messages.filter(m => m.sender === 'user').map(m => ({ role: 'user', content: m.text })));
      const botMessage = { sender: "bot", text: response.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { sender: "bot", text: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔵 FLOATING BUTTON */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
        >
          <FaRobot size={20} />
        </button>
      )}

      {/* 💬 CHAT WINDOW */}
      {open && (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 flex justify-between items-center">
            <h3 className="font-semibold">AI Assistant</h3>
            <FaTimes
              className="cursor-pointer"
              onClick={() => setOpen(false)}
            />
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[75%] text-sm ${
                  msg.sender === "user"
                    ? "bg-purple-500 text-white ml-auto"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="p-3 border-t flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask something..."
              className="flex-1 border rounded-lg px-3 py-2 outline-none text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
              disabled={loading}
            />

            <button
              onClick={handleSend}
              className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
              disabled={loading}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
}