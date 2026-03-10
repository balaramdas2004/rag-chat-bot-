"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessage from "@/components/ChatMessage.jsx";
import Icon from "@/components/Icon.jsx";

/**
 * The main chat window component that displays the conversation with 3D effects.
 * edits
 * @param {{ chatHistory: Array<object>, isLoading: boolean }} props
 */

export default function ChatWindow({ chatHistory = [], isLoading = false }) {
  const chatContainerRef = useRef(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  // Track whether the user has scrolled away from the bottom so we don't
  // force-scroll when they are reading older messages.
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      // Consider the user "at bottom" if they are within 50px of it
      setIsUserAtBottom(distanceFromBottom < 50);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Effect to scroll to the bottom of the chat window when new messages are added
  // or loading state changes, but only if the user is already near the bottom.
  useEffect(() => {
    if (chatContainerRef.current && isUserAtBottom) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading, isUserAtBottom]);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 particle-bg perspective-3d relative min-h-0"
      aria-live="polite"
      style={{
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.02) 50%, rgba(4, 120, 87, 0.05) 100%)"
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-emerald-400/30 rounded-full float-animation" style={{ animationDelay: "0s" }}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-emerald-500/20 rounded-full float-animation" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-emerald-600/25 rounded-full float-animation" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-60 right-1/3 w-2 h-2 bg-emerald-400/20 rounded-full float-animation" style={{ animationDelay: "1.5s" }}></div>
      </div>

      <div className="relative z-10 space-y-6">
        {chatHistory.map((message, index) => (
          <ChatMessage 
            key={`msg-${index}-${message.role}`} 
            message={message}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}

        {isLoading && (
          <div className="chat chat-start slide-in-up">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center ring-2 ring-emerald-500/30 pulse-glow float-animation">
                <Icon name="Bot" size={24} className="text-white" />
              </div>
            </div>
            <div className="chat-bubble shadow-lg chat-bubble-neutral card-3d lighting-effect">
              <div className="flex items-center gap-2">
                <span className="text-glow">AI is thinking</span>
                <div className="flex gap-1">
                  <span className="loading loading-dots loading-sm text-emerald-500"></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
