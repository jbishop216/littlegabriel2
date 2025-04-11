'use client';

import { useState, useRef, useEffect } from 'react';
import { useCustomChat } from '@/lib/hooks/useCustomChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MessageBubble from './MessageBubble';

type Message = {
  content: string;
  isUser: boolean;
};

export default function ChatInterface() {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use custom chat hook for functionality
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useCustomChat({
    onFinish: () => {
      // Add a small delay before removing the typing indicator
      setTimeout(() => {
        setIsTyping(false);
      }, 250);
    }
  });

  // Scroll to bottom only when a new message is added or when user sends a message
  useEffect(() => {
    // Only auto-scroll in specific cases to avoid forcing the user to stay at the bottom
    const shouldScroll = 
      // When a new message is added (length changes)
      messages.length > 0 && 
      // Only for the initial load or when the user sends a new message
      !isTyping;
    
    if (shouldScroll) {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages.length, isTyping]);

  // Handle form submission
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
      setIsTyping(true);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-10 w-10 text-indigo-600 dark:text-indigo-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Start a Conversation with Gabriel</h3>
            <p className="mt-2 max-w-md text-gray-600 dark:text-gray-400">
              Ask a question about faith, request spiritual guidance, or explore Biblical teachings. Gabriel is here to provide compassionate, faith-centered counsel.
            </p>
            <div className="mt-6 grid gap-3 text-left md:grid-cols-2">
              <button 
                onClick={() => handleInputChange({ target: { value: "How can I strengthen my faith during difficult times?" } } as any)}
                className="rounded-lg border border-gray-200 bg-white p-3 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-800 dark:hover:bg-gray-700/60"
              >
                <p className="font-medium text-gray-700 dark:text-gray-300">How can I strengthen my faith during difficult times?</p>
              </button>
              <button 
                onClick={() => handleInputChange({ target: { value: "What does the Bible teach about forgiveness?" } } as any)}
                className="rounded-lg border border-gray-200 bg-white p-3 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-800 dark:hover:bg-gray-700/60"
              >
                <p className="font-medium text-gray-700 dark:text-gray-300">What does the Bible teach about forgiveness?</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message: { content: string; role: string }, index: number) => {
              return (
                <MessageBubble
                  key={index}
                  message={message.content}
                  isUser={message.role === 'user'}
                  typing={message.role === 'assistant' && index === messages.length - 1 && isTyping}
                  onTypingComplete={() => setIsTyping(false)}
                />
              );
            })}
            {isLoading && (
              <MessageBubble
                message="..."
                isUser={false}
                typing={true}
              />
            )}
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Message Input */}
      <form onSubmit={onSubmit} className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 md:p-6">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 rounded-full border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="rounded-full bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {isLoading ? (
              <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}