import React from 'react';

const MessageBubble = ({ message }) => {
  const isAI = message.sender === 'ai';
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isAI
            ? 'bg-soft-gray text-pure-white'
            : 'bg-gradient-primary text-pure-white'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
        <p
          className={`text-xs mt-1 ${
            isAI ? 'text-muted-gray' : 'text-pure-white/70'
          }`}
        >
          {time}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
