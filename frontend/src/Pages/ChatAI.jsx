import React, { useState, useRef, useEffect } from 'react';
import ScreenContainer from '../Components/ScreenContainer';
import GlassPanel from '../Components/GlassPanel';
import Button from '../Components/Button';
import MessageBubble from '../Components/MessageBubble';
import { chatWithAI } from '../api/ai';

const ChatAI = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI habit coach. How can I help you build better habits today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await chatWithAI(inputMessage);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response.response || response.message || "I'm here to help!",
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="pb-24 pt-24">
      <div className="mb-6">
        <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-3 text-pure-white" style={{ fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif" }}>
          <span style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 50%, #FFFFFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline-block' }}>
            AI Coach
          </span>
        </h1>
        <p className="text-text-tertiary text-sm">Get personalized guidance on building better habits</p>
      </div>

      <GlassPanel className="h-[calc(100vh-320px)] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-muted-gray">
              <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gold rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-gold rounded-full animate-pulse delay-150"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-dark-gray">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about building habits..."
              className="flex-1 px-4 py-2 bg-dark-gray border border-soft-gray rounded-lg text-pure-white placeholder-muted-gray focus:outline-none focus:border-gold transition-colors"
              disabled={loading}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!inputMessage.trim() || loading}
            >
              Send
            </Button>
          </div>
        </form>
      </GlassPanel>
    </ScreenContainer>
  );
};

export default ChatAI;
