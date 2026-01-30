"use client";
import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { useSidebar } from '@/lib/stores/sidebar-store';
import WinningPicksDistribution from './components/WinningPicksDistribution';

const TabNavigation = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [message, setMessage] = useState('');
  const [currentGreeting, setCurrentGreeting] = useState('');
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Get sidebar state from context
  const { openLeftSidebar } = useSidebar();

  const greetingPairs = [
    { withName: "Hey, {name}!", withoutName: "Hey there!" },
    { withName: "Hello, {name}!", withoutName: "Hello there!" },
    { withName: "Hi, {name}!", withoutName: "Hi there!" },
    { withName: "Good morning, {name}!", withoutName: "Good morning!" },
    { withName: "Welcome back, {name}!", withoutName: "Welcome back!" },
    { withName: "Good to see you, {name}!", withoutName: "Good to see you!" },
    { withName: "Habari, {name}!", withoutName: "Habari!" },
    { withName: "Habari yako, {name}!", withoutName: "Habari yako!" },
    { withName: "Unasema aje leo, {name}!", withoutName: "Unasema aje leo!" }
  ];

  const exampleQueries = [
    "Show me the winning patterns",
    "What are the draw statistics?",
    "Analyze home team performance",
    "Show outcome distribution"
  ];

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * greetingPairs.length);
    setCurrentGreeting(greetingPairs[randomIndex].withoutName);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [message]);

  const setExampleQuery = (query) => {
    setMessage(query);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const simulateStreaming = async (text, onUpdate) => {
    const words = text.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      onUpdate(currentText);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isGenerating) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsGenerating(true);

    const assistantMessageId = Date.now() + 1;
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      introText: '',
      showComponents: false,
      afterComponentText: ''
    }]);

    if (message.toLowerCase().includes('winning') || message.toLowerCase().includes('pattern')) {
      const introText = "Based on analyzing previous SportPesa jackpots, here is the winning patterns:";
      
      await simulateStreaming(introText, (text) => {
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, introText: text }
            : msg
        ));
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, showComponents: true }
          : msg
      ));

      await new Promise(resolve => setTimeout(resolve, 500));

      const afterText = "This data shows historical winning patterns from past jackpots. Remember, past results don't guarantee future outcomes, but understanding these patterns can inform your winning strategy.";
      
      await simulateStreaming(afterText, (text) => {
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, afterComponentText: text }
            : msg
        ));
      });
    } else {
      const responseText = "I can help you analyze SportPesa jackpot patterns and statistics. Try asking about 'winning patterns' to see detailed analysis with visual components.";
      
      await simulateStreaming(responseText, (text) => {
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: text }
            : msg
        ));
      });
    }

    setIsGenerating(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Dynamic margin class based on sidebar state
  const inputMarginClass = openLeftSidebar ? 'lg:ml-60' : 'lg:ml-16';

  return (
    <div className="flex-1 flex flex-col w-full">
      {messages.length === 0 ? (
        // Welcome Screen
        <div className="flex-1 flex flex-col px-4 max-w-3xl mx-auto w-full pt-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              {currentGreeting}
            </h1>

            <div className="flex justify-center mb-6">
              <div className="w-full">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative flex-1 w-full mb-4">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <textarea
                      ref={textareaRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="How can I help you today?"
                      className="w-full pl-12 pr-12 py-4 rounded-lg 
                               border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-800 
                               text-gray-900 dark:text-gray-100 
                               placeholder-gray-500 dark:placeholder-gray-400 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                               shadow-sm text-base resize-none leading-5"
                      rows={1}
                      style={{ minHeight: '56px' }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 
                               bg-blue-600 hover:bg-blue-700 
                               dark:bg-blue-500 dark:hover:bg-blue-600 
                               text-white rounded-lg 
                               transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2 justify-center flex-wrap">
                      {exampleQueries.slice(0, 3).map((query, index) => (
                        <button
                          key={index}
                          onClick={() => setExampleQuery(query)}
                          className="bg-white dark:bg-gray-800 
                                   hover:bg-blue-600 hover:text-white 
                                   dark:hover:bg-blue-500 dark:hover:text-white
                                   text-gray-700 dark:text-gray-200 
                                   border border-gray-300 dark:border-gray-600
                                   px-3 py-1.5 rounded-full text-sm 
                                   transition-all duration-200 hover:scale-105"
                        >
                          {query}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => setExampleQuery(exampleQueries[3])}
                        className="bg-white dark:bg-gray-800 
                                 hover:bg-blue-600 hover:text-white 
                                 dark:hover:bg-blue-500
                                 text-gray-700 dark:text-gray-200 
                                 border border-gray-300 dark:border-gray-600
                                 px-3 py-1.5 rounded-full text-sm 
                                 transition-all duration-200 hover:scale-105"
                      >
                        {exampleQueries[3]}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                    💡 Try: "Show me the winning patterns" or click an example above
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Chat Mode
        <div className="flex-1 flex flex-col">
          <div className="flex-1 px-4 max-w-3xl mx-auto w-full pt-1 pb-32">
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div key={index}>
                  {msg.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="bg-blue-600 dark:bg-blue-500 text-white rounded-2xl px-4 py-3 max-w-[85%]">
                        <p className="text-sm md:text-base whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {msg.introText && (
                        <div className="rounded-2xl px-4 py-3">
                          <p className="text-sm md:text-base text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {msg.introText}
                          </p>
                        </div>
                      )}

                      {!msg.introText && msg.content && (
                        <div className="rounded-2xl px-4 py-3">
                          <p className="text-sm md:text-base text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        </div>
                      )}
                      
                      {msg.showComponents && (
                        <div className="flex justify-center my-4">
                          <WinningPicksDistribution />
                        </div>
                      )}

                      {msg.afterComponentText && (
                        <div className="rounded-2xl px-4 py-3">
                          <p className="text-sm md:text-base text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {msg.afterComponentText}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-500" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Fixed Input - Dynamically responds to sidebar state */}
          <div className={`fixed bottom-0 left-0 right-0 
                        ${inputMarginClass}
                        bg-white dark:bg-gray-900 
                        pt-4 pb-4 z-10
                        transition-all duration-300`}>
            <div className="px-4 max-w-3xl mx-auto w-full">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <Sparkles className="h-5 w-5" />
                </div>
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me about jackpot patterns, statistics, or strategies..."
                  className="w-full pl-12 pr-12 py-4 rounded-xl 
                           border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-800 
                           text-gray-900 dark:text-gray-100 
                           placeholder-gray-500 dark:placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                           shadow-lg text-base resize-none leading-5"
                  rows={1}
                  style={{ minHeight: '56px', maxHeight: '200px' }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isGenerating}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 
                           bg-blue-600 hover:bg-blue-700 
                           dark:bg-blue-500 dark:hover:bg-blue-600 
                           text-white rounded-lg 
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabNavigation;
