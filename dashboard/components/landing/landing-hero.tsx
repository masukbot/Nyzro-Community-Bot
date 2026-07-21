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

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Bot,
  Activity,
  ArrowRight,
  LogIn,
  CheckCircle2,
  ShieldAlert,
  Server,
  Terminal,
  Cpu,
  Radio,
  Clock,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  const [threatCount, setThreatCount] = useState(482910);
  const [commandCount, setCommandCount] = useState(1482094);

  useEffect(() => {
    const interval = setInterval(() => {
      setThreatCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      setCommandCount(prev => prev + Math.floor(Math.random() * 5) + 2);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative pt-36 pb-20 px-6 overflow-hidden">
      {/* Background Animated Grid & Spotlight */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ef444408_1px,transparent_1px),linear-gradient(to_bottom,#ef444408_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Red Ambient Beam Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-red-500/15 via-red-600/5 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">

          {/* Floating Telemetry Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#141B2D]/80 border border-red-500/20 text-red-400 text-xs font-bold shadow-xl shadow-red-500/5 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-white font-mono font-black uppercase text-[10px] tracking-wider">
              Nyzro AI Engine v3.0 • 14ms Latency
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 text-[11px]">85,000+ Verified Communities</span>
          </div>

          {/* Hero Main Heading */}
          <div className="max-w-4xl space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08] font-outfit">
              The Enterprise-Grade <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-slate-100 to-red-500 bg-clip-text text-transparent">
                AI Orchestration Platform
              </span> <br className="hidden sm:inline" />
              For Discord.
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
              Empower your server with 23+ multi-provider AI models, automated vision moderation, ticket intelligence, and visual workflows in one cinematic management platform.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Button
              onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
              className="h-14 px-9 rounded-2xl bg-primary hover:bg-red-600 text-white font-bold text-base shadow-xl shadow-red-500/25 transition-all duration-300 hover:scale-[1.03] active:scale-95 gap-3 group"
            >
              <span>Add to Discord Server</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Link href="#interactive-dashboard">
              <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-base gap-2.5">
                <Terminal className="h-5 w-5 text-primary" />
                Explore Live Demo
              </Button>
            </Link>
          </div>

          {/* Live Telemetry Floating Widget Bar */}
          <div className="pt-12 w-full grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl">
            <div className="p-4 bg-[#141B2D]/60 border border-slate-800/80 rounded-2xl backdrop-blur-md text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                <span>Threats Blocked</span>
              </div>
              <p className="text-xl font-black text-white font-mono">{threatCount.toLocaleString()}</p>
            </div>

            <div className="p-4 bg-[#141B2D]/60 border border-slate-800/80 rounded-2xl backdrop-blur-md text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <Zap className="h-4 w-4 text-amber-400" />
                <span>Commands Processed</span>
              </div>
              <p className="text-xl font-black text-white font-mono">{commandCount.toLocaleString()}</p>
            </div>

            <div className="p-4 bg-[#141B2D]/60 border border-slate-800/80 rounded-2xl backdrop-blur-md text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span>API Latency</span>
              </div>
              <p className="text-xl font-black text-emerald-400 font-mono">14.2 ms</p>
            </div>

            <div className="p-4 bg-[#141B2D]/60 border border-slate-800/80 rounded-2xl backdrop-blur-md text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <Radio className="h-4 w-4 text-blue-400" />
                <span>Uptime SLA</span>
              </div>
              <p className="text-xl font-black text-white font-mono">99.99%</p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
