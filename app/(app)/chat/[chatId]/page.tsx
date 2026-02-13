"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Dummy chat history based on chatId
const DUMMY_CHAT_HISTORY: Record<string, { title: string; messages: Message[] }> = {
  "1": {
    title: "Betting Strategy Analysis",
    messages: [
      { id: "m1", role: "user", content: "Can you help me analyze the latest jackpot patterns?", timestamp: "2:30 PM" },
      { id: "m2", role: "assistant", content: "I'd be happy to help analyze jackpot patterns. Based on the last 10 SportPesa Mega Jackpots, here are some key trends:\n\n• Home wins occurred in 52% of matches\n• Draws appeared in about 23% of matches\n• Away wins made up the remaining 25%\n\nWould you like me to break this down by league or look at specific match conditions?", timestamp: "2:31 PM" },
      { id: "m3", role: "user", content: "Yes, break it down by league please", timestamp: "2:33 PM" },
      { id: "m4", role: "assistant", content: "Here's the breakdown by league from recent jackpots:\n\n**Premier League:** Home wins 48%, Draws 27%, Away wins 25%\n**La Liga:** Home wins 55%, Draws 21%, Away wins 24%\n**Serie A:** Home wins 51%, Draws 24%, Away wins 25%\n**Bundesliga:** Home wins 49%, Draws 22%, Away wins 29%\n\nLa Liga shows the strongest home advantage, while Bundesliga has the highest away win rate. This could inform your strategy filters.", timestamp: "2:34 PM" },
    ]
  },
  "2": {
    title: "Match Predictions for Weekend",
    messages: [
      { id: "m1", role: "user", content: "What are the predictions for this weekend's matches?", timestamp: "10:00 AM" },
      { id: "m2", role: "assistant", content: "Remember, I don't predict — I help you filter based on your own logic! But I can show you the data for this weekend's jackpot matches.\n\nThere are 17 matches in the upcoming Mega Jackpot. Would you like me to:\n\n1. Show odds overview for all matches\n2. Apply one of your saved strategies\n3. Look at head-to-head records\n\nWhich would be most helpful?", timestamp: "10:01 AM" },
    ]
  },
  "3": {
    title: "Statistics Review",
    messages: [
      { id: "m1", role: "user", content: "Show me the statistics for the last 10 jackpots", timestamp: "Yesterday" },
      { id: "m2", role: "assistant", content: "Here are the stats from the last 10 Mega Jackpots:\n\n**Overall Results:**\n• Total matches analyzed: 170\n• Average home wins per jackpot: 8.9\n• Average draws per jackpot: 3.8\n• Average away wins per jackpot: 4.3\n\n**Best performing filter:**\nHome odds < 1.50 → 78% accuracy\n\n**Most unpredictable league:**\nLigue 1 (highest variance in outcomes)\n\nWant me to go deeper into any of these?", timestamp: "Yesterday" },
    ]
  },
};

const DEFAULT_CHAT = {
  title: "New Chat",
  messages: [] as Message[],
};

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const isNewChat = chatId === "new";

  const chatData = isNewChat ? DEFAULT_CHAT : (DUMMY_CHAT_HISTORY[chatId] || DEFAULT_CHAT);

  const [messages, setMessages] = useState<Message[]>(chatData.messages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `m${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (will be replaced with real API later)
    setTimeout(() => {
      const aiMessage: Message = {
        id: `m${Date.now() + 1}`,
        role: "assistant",
        content: "This is a placeholder response. The AI chat backend will be connected soon with the Vercel AI SDK. For now, explore the interface!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] max-w-3xl mx-auto">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
          {chatData.title}
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Start a conversation
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Ask about jackpot patterns, match statistics, or get help building a strategy.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className={cn(
                "text-xs mt-1",
                message.role === "user"
                  ? "text-blue-200"
                  : "text-gray-400 dark:text-gray-500"
              )}>
                {message.timestamp}
              </p>
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about jackpot stats, strategies, or match data..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-800 px-4 py-2.5 text-sm
                     text-gray-900 dark:text-gray-100
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     max-h-32"
            style={{ minHeight: "42px" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "p-2.5 rounded-xl transition-colors shrink-0",
              input.trim() && !isLoading
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
