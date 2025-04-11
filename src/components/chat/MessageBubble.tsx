'use client';

import { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';
import TypingIndicator from './TypingIndicator';

type MessageBubbleProps = {
  message: string;
  isUser: boolean;
  typing?: boolean;
  onTypingComplete?: () => void;
};

export default function MessageBubble({ 
  message, 
  isUser, 
  typing = false,
  onTypingComplete
}: MessageBubbleProps) {
  const [showTyping, setShowTyping] = useState(typing);
  const [showContent, setShowContent] = useState(!typing);

  useEffect(() => {
    if (typing) {
      setShowTyping(true);
      setShowContent(false);
    } else {
      // When not typing, show the content immediately
      setShowTyping(false);
      setShowContent(true);
    }
  }, [typing]);

  const handleTypingComplete = () => {
    if (onTypingComplete) {
      onTypingComplete();
    }
  };

  return (
    <div 
      className={`mb-4 flex animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Display assistant avatar for non-user messages */}
      {!isUser && (
        <div className="mr-3 mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md dark:from-indigo-600 dark:to-blue-700">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="h-6 w-6"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" 
            />
          </svg>
        </div>
      )}

      <div 
        className={`relative max-w-[85%] rounded-2xl px-5 py-3 shadow-md md:max-w-[75%] lg:max-w-[65%] ${
          isUser 
            ? 'rounded-tr-none bg-gradient-to-r from-indigo-600 to-blue-500 text-white dark:from-indigo-500 dark:to-blue-400' 
            : 'rounded-tl-none bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        }`}
      >
        {/* Chat bubble pointer */}
        <div 
          className={`absolute top-0 h-3 w-3 ${
            isUser 
              ? 'right-0 -translate-x-px rounded-bl-none bg-indigo-600 dark:bg-indigo-500' 
              : 'left-0 translate-x-px rounded-br-none bg-white dark:bg-gray-800'
          }`} 
          style={{ 
            [isUser ? 'right' : 'left']: -5,
            transform: `rotate(${isUser ? '45deg' : '-45deg'})`,
          }}
        ></div>

        {/* Message content with typing effect */}
        <div className="text-[15px] leading-relaxed">
          {showTyping ? (
            message === "..." ? (
              <TypingIndicator />
            ) : (
              <TypewriterText 
                text={message} 
                speed={50} // Slower typing speed for more visibility
                onComplete={() => {
                  setShowTyping(false);
                  setShowContent(true);
                  handleTypingComplete();
                }} 
              />
            )
          ) : (
            <div className="whitespace-pre-wrap">{message}</div>
          )}
        </div>
      </div>

      {/* Display user avatar for user messages */}
      {isUser && (
        <div className="ml-3 mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600 shadow-md dark:bg-gray-700 dark:text-gray-300">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="h-6 w-6"
          >
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
}