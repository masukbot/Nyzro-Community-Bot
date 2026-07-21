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

import React from "react";
import {
  ShieldCheck,
  Zap,
  Ticket,
  BarChart4,
  FileText,
  Star,
  Layers,
  Sparkles,
  Bot,
  MessageSquare,
  Lock,
  Globe,
  ArrowUpRight
} from "lucide-react";

export function FeatureBentoGrid() {
  return (
    <section id="features" className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest">
            Enterprise Feature Suite
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white font-outfit">
            Engineered for Maximum Performance
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Every feature is designed with zero-compromise precision, low-latency execution, and modular flexibility.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Wide Card - Multi-Provider AI Engine */}
          <div className="md:col-span-2 bg-[#141B2D] border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-primary/50 transition-all duration-500">
            <div className="absolute -right-8 -bottom-8 opacity-[0.05] group-hover:scale-110 transition-transform">
              <Sparkles className="h-64 w-64 text-white" />
            </div>
            
            <div className="space-y-4 relative z-10 max-w-lg">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black text-white">Multi-Provider AI Orchestration</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connect 23+ built-in AI providers or custom REST endpoints. Assign different models to different Discord features with automatic failover and cost optimization.
              </p>
              
              <div className="pt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">Gemini 2.5 Flash</span>
                <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">Claude 3.5 Sonnet</span>
                <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">GPT-4o Vision</span>
                <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">Groq Llama 3.3</span>
              </div>
            </div>
          </div>

          {/* Card 2: Tall Card - Vision AI & Security */}
          <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-primary/50 transition-all duration-500 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-white">Vision AI & Attachment Scanner</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Automatically scan uploaded images, PDF documents, ZIP archives, and executables for QR scams, phishing, and explicit content.
              </p>
            </div>

            <div className="mt-8 p-4 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs font-mono space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>QR Phishing Filter:</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Malicious Binary:</span>
                <span className="text-emerald-400 font-bold">QUARANTINED</span>
              </div>
            </div>
          </div>

          {/* Card 3: Anti-Nuke Security */}
          <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-primary/50 transition-all duration-500 space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-white">Sub-Second Anti-Nuke Shield</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Instant detection against rogue admin bans, mass channel deletions, and role strip attacks with real-time audit restoration.
            </p>
          </div>

          {/* Card 4: Ticket Intelligence */}
          <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-primary/50 transition-all duration-500 space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Ticket className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-white">AI Ticket & Form Assistant</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Auto-summarize complex ticket histories, score staff application forms, and suggest instant moderator response templates.
            </p>
          </div>

          {/* Card 5: Analytics & Growth */}
          <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-primary/50 transition-all duration-500 space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <BarChart4 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-white">Server Growth & Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Track active member engagement, voice retention metrics, command telemetry, and automated XP leveling leaderboards.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
