import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

// To be moved to env vars later
const API_URL = import.meta.env.VITE_API_URL;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // Load user ID from localStorage if available
  useEffect(() => {
    const storedId = localStorage.getItem("goabroad_user_id");
    if (storedId) {
      setUserId(parseInt(storedId));
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!userId) {
      alert("Please submit your profile first!");
      window.location.href = "/profile";
      return;
    }

    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat/ask`, {
        user_id: userId,
        question: newMessage.content,
      });

      const aiMessage: Message = {
        role: "assistant",
        content: response.data.response,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-gray-50 shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-xl font-semibold">👋 Welcome back!</p>
            <p>Ask me anything about studying abroad.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border text-gray-800 shadow-sm"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2 text-gray-900" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-3 mb-2 text-gray-800" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-base font-semibold mt-2 mb-1 text-gray-700" {...props} />,
                      p: ({ node, ...props }) => <p className="mb-2 text-gray-700 leading-relaxed" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc ml-5 mb-2 space-y-1" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal ml-5 mb-2 space-y-1" {...props} />,
                      li: ({ node, ...props }) => <li className="text-gray-700" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                      em: ({ node, ...props }) => <em className="italic" {...props} />,
                      code: ({ node, ...props }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800" {...props} />,
                      pre: ({ node, ...props }) => <pre className="bg-gray-100 p-2 rounded overflow-x-auto mb-2" {...props} />,
                      blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-500 pl-3 italic text-gray-600 my-2" {...props} />,
                      a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                      hr: ({ node, ...props }) => <hr className="my-3 border-gray-300" {...props} />,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 p-3 rounded-lg animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-white border-t rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Ask your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
