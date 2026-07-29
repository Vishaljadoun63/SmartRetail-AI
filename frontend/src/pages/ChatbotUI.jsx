import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
  Clock,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const suggestions = [
  "Show today's analytics",
  "Analyze customer sentiment",
  "Summarize recent reviews",
  "Returning customers",
  "Product recommendations",
  "Weekly store performance",
];

const getCurrentTime = () => {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChatbotUI = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Welcome to SmartRetail AI. I can help you analyze customers, reviews, products and store analytics.",
      time: getCurrentTime(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

const chatRef = useRef(null);

useEffect(() => {
  if (chatRef.current) {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }
}, [messages, loading]);

  const clearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "👋 Welcome back! How can I help you today?",
        time: getCurrentTime(),
      },
    ]);
  };

  const sendMessage = async (messageText = null) => {
    const userMessage = (messageText || input).trim();

    if (!userMessage) return;

    if (!messageText) setInput("");

    const userObj = {
      sender: "user",
      text: userMessage,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userObj]);

    setLoading(true);

    try {
      const response = await api.post("/ml/chatbot", {
        message: userMessage,
      });

      const botObj = {
        sender: "bot",
        text: response.data.reply,
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, botObj]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Unable to connect to the server.",
          time: getCurrentTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="max-w-5xl mx-auto h-full flex flex-col">

    {/* Header */}
    <div className="flex items-center justify-between mb-6">

      <div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg">
            <Bot size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              SmartRetail AI Assistant
            </h1>

            <p className="text-gray-400">
              Customer Support • Product Insights • Analytics
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">

        <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          Online
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all"
        >
          <Trash2 size={16} />
          Clear Chat
        </button>

      </div>

    </div>

    {/* Chat Card */}

    <div className="glass-panel flex-1 flex flex-col overflow-hidden">

      {/* Suggestions */}

      {messages.length === 1 && (

        <div className="border-b border-white/10 p-6">

          <div className="flex items-center gap-2 mb-4">

            <Sparkles className="text-primary" size={18} />

            <span className="font-semibold">
              Suggested Questions
            </span>

          </div>

          <div className="flex flex-wrap gap-3">

            {suggestions.map((item) => (

              <button
                key={item}
                onClick={() => sendMessage(item)}
                className="px-4 py-2 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 transition-all"
              >
                {item}
              </button>

            ))}

          </div>

        </div>

      )}

      {/* Messages */}

      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
      >

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`flex ${
              msg.sender === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`flex gap-3 max-w-[80%] ${
                msg.sender === "user"
                  ? "flex-row-reverse"
                  : ""
              }`}
            >

              {/* Avatar */}

              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === "bot"
                    ? "bg-gradient-to-r from-primary to-accent"
                    : "bg-primary"
                }`}
              >

                {msg.sender === "bot" ? (
                  <Bot size={18} />
                ) : (
                  <User size={18} />
                )}

              </div>

              {/* Bubble */}

              <div>

                <div
                  className={`px-6 py-4 rounded-3xl shadow-lg ${
                    msg.sender === "bot"
                      ? "bg-white/10 border border-white/10 rounded-tl-md"
                      : "bg-primary text-white rounded-tr-md"
                  }`}
                >

                  {msg.text}

                </div>

                <div
                  className={`flex items-center gap-1 text-xs text-gray-500 mt-2 ${
                    msg.sender === "user"
                      ? "justify-end"
                      : ""
                  }`}
                >

                  <Clock size={12} />

                  {msg.time}

                </div>

              </div>

            </div>

          </div>

        ))}

        {loading && (

          <div className="flex">

            <div className="flex gap-3">

              <div className="w-11 h-11 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">

                <Bot size={18} />

              </div>

              <div className="bg-white/10 px-6 py-5 rounded-3xl border border-white/10">

                <div className="flex gap-2">

                  <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></span>

                  <span
                    className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: ".15s" }}
                  ></span>

                  <span
                    className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: ".3s" }}
                  ></span>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

      {/* Input */}

      <div className="border-t border-white/10 p-5 bg-black/20">

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-4"
        >

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your retail store..."
            className="input-field flex-1 rounded-full px-6 bg-white/5"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50"
          >

            <Send size={20} />

          </button>

        </form>

      </div>

    </div>

  </div>
  );
};

export default ChatbotUI;