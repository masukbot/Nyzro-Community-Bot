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
import { Cpu, Sparkles, Layers, Zap, Server, RefreshCcw, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const PROVIDER_NODES = [
  { id: "gemini", name: "Google Gemini 2.5", latency: "120ms", type: "Multimodal Engine", desc: "Assigned to Chat AI & Summarization" },
  { id: "claude", name: "Anthropic Claude 3.5", latency: "210ms", type: "Reasoning & Mod", desc: "Assigned to Moderation & Ticket Assistant" },
  { id: "openai", name: "OpenAI GPT-4o", latency: "195ms", type: "Vision & OCR", desc: "Assigned to Scam Image Detection & Translation" },
  { id: "groq", name: "Groq Llama 3.3 70B", latency: "45ms", type: "Ultra-Fast Inference", desc: "Assigned to Auto Moderation & Spam Detection" },
  { id: "ollama", name: "Local Ollama Node", latency: "90ms", type: "Zero-Cost Local", desc: "Assigned to Privacy Chat & Budget Fallback" },
];

export function AIArchitectureSection() {
  const [selectedNode, setSelectedNode] = useState("gemini");

  const currentNode = PROVIDER_NODES.find(n => n.id === selectedNode) || PROVIDER_NODES[0];

  return (
    <section id="architecture" className="py-24 px-6 relative z-10 bg-[#0f172a]/50">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
            Multi-Provider Infrastructure
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white font-outfit">
            Intelligent Multi-Model Routing
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Never rely on a single AI provider. Nyzro routes requests across an elite provider matrix with zero downtime failover.
          </p>
        </div>

        {/* Interactive Matrix Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Provider List Switcher */}
          <div className="space-y-3">
            {PROVIDER_NODES.map(node => {
              const isSelected = selectedNode === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between",
                    isSelected
                      ? "bg-primary/15 border-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                      : "bg-[#141B2D] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("h-3 w-3 rounded-full", isSelected ? "bg-primary animate-pulse" : "bg-slate-600")} />
                    <div>
                      <h4 className="font-bold text-sm text-white">{node.name}</h4>
                      <p className="text-[10px] text-slate-500">{node.type}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">{node.latency}</span>
                </button>
              );
            })}
          </div>

          {/* Center Dynamic Routing Diagram */}
          <div className="lg:col-span-2 bg-[#141B2D] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Cpu className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-bold text-white">Active Router Node: {currentNode.name}</h3>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold font-mono">
                SLA Operational
              </span>
            </div>

            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Routing Specification</span>
                <span className="text-primary font-bold">Latency: {currentNode.latency}</span>
              </div>
              <p className="text-sm font-bold text-white leading-relaxed">{currentNode.desc}</p>
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                <div>[0.00s] Gateway receives payload from Discord Shard #07</div>
                <div>[0.02s] Dispatched to provider: {currentNode.name}</div>
                <div>[0.11s] HTTP 200 OK - Tokens evaluated with budget safety</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Failover Retry</p>
                <p className="text-sm font-bold text-white">Exponential Backoff</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Rate Limits</p>
                <p className="text-sm font-bold text-white">1,000 RPM Managed</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 text-center col-span-2 sm:col-span-1">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Encryption</p>
                <p className="text-sm font-bold text-emerald-400">AES-256 GCM</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
