'use client';

import { useState, useCallback } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface UseChatOptions {
  onFinish?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
}

export function useCustomChat(options?: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      if (!input.trim() || isLoading) return;
      
      // Add user message to state
      const userMessage: ChatMessage = { role: 'user', content: input };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
      setIsLoading(true);
      setError(null);
      
      try {
        let responseText = '';
        
        // Use the server API endpoint for chat
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: newMessages,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Read the streaming response
        const reader = response.body?.getReader();
        if (!reader) throw new Error('Response body is not readable');
        
        const decoder = new TextDecoder();
        
        // Create assistant message placeholder
        const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
        setMessages([...newMessages, assistantMessage]);
        
        // Read and process the stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Decode the chunk and add to response text
          const chunk = decoder.decode(value, { stream: true });
          responseText += chunk;
          
          // Update the assistant message with accumulated text
          setMessages(prev => {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1] = {
              ...updatedMessages[updatedMessages.length - 1],
              content: responseText
            };
            return updatedMessages;
          });
        }
        
        // Call onFinish callback if provided
        if (options?.onFinish) {
          options.onFinish({ role: 'assistant', content: responseText });
        }
      } catch (err) {
        console.error('Chat error:', err);
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        
        // Add error message to chat
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: `I'm sorry, I encountered an error: ${error.message}. Please try again.`
          }
        ]);
        
        if (options?.onError) {
          options.onError(error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, options]
  );

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
  };
}