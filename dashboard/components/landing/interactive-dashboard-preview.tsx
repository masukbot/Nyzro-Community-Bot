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
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Activity,
  Server,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  Terminal,
  Eye,
  MessageSquare,
  Lock,
  Search,
  Bell
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const MOCK_LOGS = [
  { time: "03:49:12", type: "AI_MOD", msg: "Scam QR image detected in #general -> Action: Deleted message & DM warned user", level: "warn" },
  { time: "03:49:08", type: "VISION", msg: "OCR extracted fake Nitro gift URL -> Action: Auto-quarantined attachment", level: "error" },
  { time: "03:49:01", type: "CHAT_AI", msg: "Gemini 2.5 Flash generated response in #ai-lounge (18ms latency)", level: "info" },
  { time: "03:48:54", type: "TICKET", msg: "Ticket #1042 summarized by Claude 3.5 Sonnet -> Escalated to Moderator", level: "info" },
  { time: "03:48:42", type: "ROUTER", msg: "Budget cap trigger evaluated -> Routed to zero-cost Ollama node", level: "success" }
];

export function InteractiveDashboardPreview() {
  const [activeTab, setActiveTab] = useState<"overview" | "ai_router" | "vision" | "moderation">("overview");
  const [automodEnabled, setAutomodEnabled] = useState(true);
  const [visionScanEnabled, setVisionScanEnabled] = useState(true);
  const [failoverEnabled, setFailoverEnabled] = useState(true);
  const [logs, setLogs] = useState(MOCK_LOGS);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        time: new Date().toTimeString().split(" ")[0],
        type: ["AI_MOD", "VISION", "CHAT_AI", "ROUTER", "ANTINUKE"][Math.floor(Math.random() * 5)],
        msg: `Telemetry update: Processed request #${Math.floor(Math.random() * 9000 + 1000)} with 100% safety rating.`,
        level: ["info", "success", "warn"][Math.floor(Math.random() * 3)]
      };
      setLogs(prev => [newLog, ...prev.slice(0, 4)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="interactive-dashboard" className="py-20 px-6 relative z-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            Interactive Product Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-outfit">
            Experience Next-Generation AI Control
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Interact with live modules, test provider routing, toggle automated filters, and view real-time telemetry logs.
          </p>
        </div>

        {/* Dashboard Shell Frame */}
        <div className="bg-[#141B2D] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/80">
          
          {/* Top Window Bar */}
          <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-4 text-xs font-mono text-slate-400 hidden sm:inline">dashboard.nyzro.ai/guild/850129</span>
            </div>

            {/* Inner Dashboard Tabs */}
            <div className="flex items-center gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab("overview")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  activeTab === "overview" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                )}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("ai_router")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  activeTab === "ai_router" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                )}
              >
                AI Model Router
              </button>
              <button
                onClick={() => setActiveTab("vision")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  activeTab === "vision" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                )}
              >
                Vision AI
              </button>
              <button
                onClick={() => setActiveTab("moderation")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  activeTab === "moderation" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                )}
              >
                Moderation
              </button>
            </div>
          </div>

          {/* Interactive Content Body */}
          <div className="p-8 space-y-8">

            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Active AI Providers</p>
                    <h3 className="text-2xl font-black text-white">8 Active Providers</h3>
                    <p className="text-xs text-emerald-400 font-bold">100% SLA Operational</p>
                  </div>

                  <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Token Throughput</p>
                    <h3 className="text-2xl font-black text-white">48.2M Tokens / mo</h3>
                    <p className="text-xs text-primary font-bold">Automatic Cost Optimization</p>
                  </div>

                  <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Average Latency</p>
                    <h3 className="text-2xl font-black text-white">14.2 ms</h3>
                    <p className="text-xs text-blue-400 font-bold">Sub-Second Response</p>
                  </div>
                </div>

                {/* Simulated Activity Stream */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live System Audit Feed</h4>
                  <div className="space-y-2 font-mono text-xs">
                    {logs.map((log, i) => (
                      <div key={i} className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 text-[10px]">{log.time}</span>
                          <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-[10px] font-bold">{log.type}</span>
                          <span className="text-slate-300">{log.msg}</span>
                        </div>
                        <span className="text-emerald-400 text-[10px] font-bold">OK</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: AI Router */}
            {activeTab === "ai_router" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">Primary Model: Gemini 2.5 Flash</h4>
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold">Active</span>
                    </div>
                    <p className="text-xs text-slate-400">Assigned to: Chat AI & Summarization</p>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full w-[85%]" />
                    </div>
                  </div>

                  <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">Fallback Model: Groq Llama 3.3</h4>
                      <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold">Standby</span>
                    </div>
                    <p className="text-xs text-slate-400">Assigned to: Auto Moderation</p>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full w-[95%]" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
                  <div>
                    <h4 className="font-bold text-white text-sm">Automated Budget Failover Trigger</h4>
                    <p className="text-xs text-slate-400">Route to zero-cost Ollama node if monthly budget cap is reached.</p>
                  </div>
                  <Switch checked={failoverEnabled} onCheckedChange={setFailoverEnabled} />
                </div>
              </div>
            )}

            {/* Tab: Vision AI */}
            {activeTab === "vision" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
                  <div>
                    <h4 className="font-bold text-white text-sm">Scam Image & QR Code Filter</h4>
                    <p className="text-xs text-slate-400">GPT-4o Vision scans uploaded images for fake Nitro, phishing, and QR scams.</p>
                  </div>
                  <Switch checked={visionScanEnabled} onCheckedChange={setVisionScanEnabled} />
                </div>

                <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Recent Vision Analysis</span>
                    <span className="text-emerald-400 font-mono">100% Confidence Match</span>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
                    Analysis: Detected phishing QR URL pointing to malicious domain. Action: Deleted message & logged security alert.
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Moderation */}
            {activeTab === "moderation" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
                  <div>
                    <h4 className="font-bold text-white text-sm">Master Automod Engine</h4>
                    <p className="text-xs text-slate-400">Sub-second neural evaluation for spam, caps, invites, and mass mentions.</p>
                  </div>
                  <Switch checked={automodEnabled} onCheckedChange={setAutomodEnabled} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {["Anti-Spam", "Anti-Phishing", "Anti-Caps", "Anti-Invites"].map(rule => (
                    <div key={rule} className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 text-center">
                      <p className="text-xs font-bold text-white">{rule}</p>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase mt-1 block">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
