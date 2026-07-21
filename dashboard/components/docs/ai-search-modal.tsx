/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                                                                  ║
 * ║   ░█▀▀░█▀█░█▀▄░█▀▀░█░█   ░█▀▄░█▀▀░█░█░█▀▀                     ║
 * ║   ░█░░░█░█░█░█░█▀▀░▄▀▄   ░█░█░█▀▀░▀▄▀░▀▀█                     ║
 * ║   ░▀▀▀░▀▀▀░▀▀░░▀▀▀░▀░▀   ░▀▀░░▀▀▀░░▀░░▀▀▀                     ║
 * ║                                                                  ║
 * ║           © 2026 CodeX Devs — All Rights Reserved               ║
 * ║                                                                  ║
 * ║   discord  ──  https://discord.gg/codexdev                      ║
 * ║   youtube  ──  https://youtube.com/@CodeXDevs                   ║
 * ║   github   ──  https://github.com/RayExo                        ║
 * ║                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

"use client";

import React, { useState } from "react";
import { Sparkles, Send, X, Bot, CheckCircle, Zap } from "lucide-react";
import { AI_DOC_QA } from "@/lib/docs-data";

interface AiSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiSearchModal({ isOpen, onClose }: AiSearchModalProps) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hello! I am **Nyzro AI Assistant**. Ask me any question about bot commands, anti-nuke setup, AI channels, or verification!" }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSend = (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    setMessages(prev => [...prev, { role: "user", text: textToSend }]);
    if (!userText) setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      const match = AI_DOC_QA.find(qa => qa.keywords.some(k => lower.includes(k)));

      const replyText = match 
        ? match.answer 
        : `I analyzed the Nyzro platform documentation for "${textToSend}". Here is what you should do:\n\n1. Ensure Nyzro bot has Administrator permissions in Discord.\n2. Open Dashboard at **dashboard.nyzro.ai/guilds**.\n3. Navigate to the module tab related to your query and toggle Enabled.\n4. Use \`/ping\` in Discord to test response latency.`;

      setMessages(prev => [...prev, { role: "assistant", text: replyText }]);
      setIsThinking(false);
    }, 750);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-[#0b0e18] border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[560px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-red-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-500">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Nyzro AI Docs Assistant
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">ONLINE</span>
              </h3>
              <p className="text-xs text-slate-400">Instant answers powered by Gemini 2.5 Flash</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-xs">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="h-7 w-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-red-600 text-white rounded-tr-none font-semibold"
                    : "bg-[#141824] border border-white/10 text-slate-200 rounded-tl-none shadow-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-2 items-center text-slate-400 text-xs font-mono">
              <Sparkles className="h-3.5 w-3.5 text-red-500 animate-spin" />
              <span>Scanning documentation index...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="px-5 py-2 flex items-center gap-2 overflow-x-auto border-t border-white/5 bg-[#070911] no-scrollbar">
          <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">Suggested:</span>
          {AI_DOC_QA.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.question)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 whitespace-nowrap transition-colors border border-white/5"
            >
              {item.question}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-[#0c101d] flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask AI anything (e.g. How to setup tickets?)"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50"
          />
          <button
            onClick={() => handleSend()}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex items-center justify-center transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
