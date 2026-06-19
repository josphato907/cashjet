import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/game-store';
import { generateRandomUsername } from '@/utils/usernames';
import { Send, Droplet } from 'lucide-react';

const INITIAL_CHAT_MESSAGES = [
  { id: "1", username: "Lynn K.", message: "Rain", timestamp: "09:41", type: "message" },
  { id: "2", username: "Riddick", message: "Lets go to 10x!", timestamp: "00:51", type: "message" },
  { id: "3", username: "Kenya KE", message: "withdrawal plizz plizzzz", timestamp: "05:53", type: "message" },
  { id: "4", username: "Kenya KE", message: "hello support my withdrawal", timestamp: "06:06", type: "message" },
  { id: "5", username: "Kenya KE", message: "8hrs down the line.....cmuangalie whatsup with your withdrawals plizzzzz", timestamp: "12:43", type: "message" },
  { id: "6", username: "Jeff", message: "Someone to send a rain to me and I will send back", timestamp: "17:17", type: "message" },
  { id: "7", username: "wuod nyayala", message: "Leo sio siku yangu, ok", timestamp: "00:57", type: "message" },
  { id: "8", username: "Clin001", message: "What is wrong admin with my withdrawal 😢", timestamp: "19:13", type: "message" },
  { id: "9", username: "Anelka@gmail", message: "My withdrawal please", timestamp: "12:08", type: "message" },
  { id: "10", username: "Anelka@gmail", message: "My withdrawal please", timestamp: "18:24", type: "message" },
  { id: "11", username: "Anelka@gmail", message: "@ Support, withdrawal please", timestamp: "18:45", type: "message" }
];

const BOT_MESSAGES = [
  "Nice win!",
  "Withdraw please",
  "When is rain? 🌧️",
  "Good luck everyone",
  "I won KSH 5000!",
  "Support help",
  "Let's go!",
  "Rain please 🌧️🌧️",
  "Another crash 😭",
  "This plane is flying today!",
  "Is the withdrawal working?",
  "Received my payout, thanks admin!",
  "Let's push 5x guys",
  "Crashed @ 1.01x, bad luck!",
  "KSH 200 placed, let's pray"
];

export default function LiveChat() {
  const [messages, setMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef(null);
  const username = useGameStore((state) => state.username);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate bot messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newMsg = {
          id: Date.now().toString() + Math.random().toString(),
          username: generateRandomUsername(),
          message: BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)],
          timestamp: new Date().toLocaleTimeString("en-KE", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          }),
          type: "message"
        };
        setMessages((prev) => [...prev.slice(-49), newMsg]);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      username: username || "Player",
      message: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString("en-KE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }),
      type: "message"
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-white">
      {/* Chat header */}
      <div className="flex justify-between items-center bg-slate-950 px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          <h3 className="font-bold text-sm text-gray-200">Live Chat</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Droplet className="w-3.5 h-3.5 text-blue-400" />
          <span>Rain active</span>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-sm" style={{ maxHeight: '420px', minHeight: '320px' }}>
        {messages.map((msg) => {
          const isOwnMessage = msg.username === username;
          return (
            <div key={msg.id} className="flex flex-col space-y-0.5 max-w-[90%] break-words">
              <div className="flex items-baseline gap-2">
                <span className={`font-bold text-xs ${isOwnMessage ? 'text-green-400' : 'text-yellow-500'}`}>
                  {msg.username}
                </span>
                <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
              </div>
              <p className="bg-slate-800/60 text-gray-200 px-3 py-1.5 rounded-r-xl rounded-bl-xl border border-slate-800/40">
                {msg.message}
              </p>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSendMessage} className="bg-slate-950 p-3 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          placeholder="Send a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
        />
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold p-2.5 rounded-xl transition flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
