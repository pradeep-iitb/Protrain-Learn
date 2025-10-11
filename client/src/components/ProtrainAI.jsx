import React, { useState, useEffect } from 'react';

export default function ProtrainAI({ isThinking = false, isPulsing = false }) {
  const [pulseAnimation, setPulseAnimation] = useState(0);

  useEffect(() => {
    if (isPulsing) {
      const interval = setInterval(() => {
        setPulseAnimation(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPulsing]);

  return (
    <div className="relative w-20 h-20 mx-auto mb-4">
      {/* Outer glow rings */}
      {isPulsing && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 to-cyan-400/30 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 animate-pulse" />
        </>
      )}
      
      {/* Main orb */}
      <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 shadow-2xl shadow-blue-500/50 ${
        isThinking ? 'animate-pulse' : ''
      }`}>
        {/* Inner gradient layers */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/60 to-transparent" />
        
        {/* Shimmer effect */}
        <div 
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: `linear-gradient(${pulseAnimation}deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)`
          }}
        />
        
        {/* Core light */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-8 h-8 rounded-full bg-white/80 ${
            isThinking ? 'animate-ping' : 'animate-pulse'
          }`} />
        </div>
        
        {/* Thinking particles */}
        {isThinking && (
          <>
            <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '600ms' }} />
          </>
        )}
      </div>
      
      {/* Status indicator */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 shadow-lg shadow-green-400/50" />
    </div>
  );
}

// Message component with AI profile
export function AIMessage({ message, timestamp, isTyping = false }) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (isTyping && message) {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= message.length) {
          setDisplayedText(message.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 20);
      return () => clearInterval(interval);
    } else {
      setDisplayedText(message);
    }
  }, [message, isTyping]);

  useEffect(() => {
    if (isTyping) {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
    }
  }, [isTyping]);

  return (
    <div className="flex gap-4 items-start mb-4">
      <div className="flex-shrink-0 mt-1">
        <ProtrainAI isPulsing={isTyping} />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-blue-400">ProTrain.AI</span>
          <span className="text-xs text-slate-500">
            {timestamp || new Date().toLocaleTimeString()}
          </span>
        </div>
        
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-2xl rounded-tl-none p-4 shadow-lg">
          <p className="text-slate-200 leading-relaxed">
            {displayedText}
            {isTyping && showCursor && <span className="inline-block w-1 h-5 bg-blue-400 ml-1 animate-pulse" />}
          </p>
        </div>
      </div>
    </div>
  );
}
