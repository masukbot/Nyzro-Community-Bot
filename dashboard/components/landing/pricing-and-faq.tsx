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
import { CheckCircle2, ChevronDown, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const FAQ_ITEMS = [
  {
    q: "How does multi-provider AI routing work in Nyzro?",
    a: "Nyzro allows server administrators to configure 23+ built-in AI providers (Google Gemini, Anthropic Claude, OpenAI, Groq, DeepSeek, Ollama) or custom API endpoints. You can assign different models to different features (e.g. Gemini for Chat, Claude for Ticket Summaries, GPT-4o for Scam Vision) with automated failover and budget caps."
  },
  {
    q: "Can I host local privacy models via Ollama or LM Studio?",
    a: "Yes! Nyzro includes native support for self-hosted Ollama and LM Studio endpoints (`http://localhost:11434`), allowing zero-cost private inference on local hardware."
  },
  {
    q: "What is the response latency for anti-nuke and vision security?",
    a: "Our core security engine operates with sub-second inference latency (~14ms API response), instantly deleting malicious attachment binaries or phishing QR images before community members interact with them."
  },
  {
    q: "Are custom provider API keys encrypted?",
    a: "All provider credentials and secrets are encrypted at rest using enterprise AES-256-GCM encryption with secret masking in the dashboard UI (`sk-...4a9f`)."
  }
];

export function PricingAndFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section id="pricing" className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Section Header: Pricing */}
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            Predictable Scaling
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white font-outfit">
            Simple, Transparent Plans
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Plan 1 */}
          <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase text-slate-500">Community Free</span>
              <h3 className="text-4xl font-black text-white">$0 <span className="text-sm text-slate-500 font-normal">/ forever</span></h3>
              <p className="text-xs text-slate-400">Essential Discord management, standard moderation, and basic AI features.</p>
              
              <div className="space-y-2.5 pt-4 text-xs text-slate-300">
                <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> 1 AI Provider Profile</div>
                <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Standard Automod & Tickets</div>
                <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Basic Leveling & Analytics</div>
              </div>
            </div>

            <Button onClick={() => signIn("discord", { callbackUrl: "/dashboard" })} variant="outline" className="w-full h-12 rounded-xl font-bold">
              Get Started Free
            </Button>
          </div>

          {/* Plan 2: Highlighted Pro */}
          <div className="bg-[#141B2D] border-2 border-primary rounded-3xl p-8 shadow-2xl shadow-primary/20 space-y-6 flex flex-col justify-between relative scale-[1.03]">
            <div className="absolute -top-3 right-8 px-3 py-1 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-wider">
              Most Popular
            </div>

            <div className="space-y-4">
              <span className="text-xs font-bold uppercase text-primary">Pro Guild</span>
              <h3 className="text-4xl font-black text-white">$15 <span className="text-sm text-slate-500 font-normal">/ month</span></h3>
              <p className="text-xs text-slate-400">Full multi-provider AI orchestration, vision scanning, and visual automations.</p>
              
              <div className="space-y-2.5 pt-4 text-xs text-slate-200 font-medium">
                <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Unlimited AI Provider Profiles</div>
                <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Feature-Based AI Model Binding</div>
                <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Vision QR Scam & Attachment Scanner</div>
                <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Visual Automation Node Builder</div>
                <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Automated Failover & Budget Router</div>
              </div>
            </div>

            <Button onClick={() => signIn("discord", { callbackUrl: "/dashboard" })} className="w-full h-12 rounded-xl font-bold">
              Upgrade to Pro
            </Button>
          </div>

          {/* Plan 3 */}
          <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase text-slate-500">Enterprise Dedicated</span>
              <h3 className="text-4xl font-black text-white">Custom <span className="text-sm text-slate-500 font-normal">/ guild</span></h3>
              <p className="text-xs text-slate-400">Dedicated bot shards, custom SLA guarantees, and priority engineer support.</p>
              
              <div className="space-y-2.5 pt-4 text-xs text-slate-300">
                <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Dedicated Shard Infrastructure</div>
                <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Custom Model Adapters</div>
                <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> 99.99% Guaranteed SLA</div>
              </div>
            </div>

            <Button onClick={() => signIn("discord", { callbackUrl: "/dashboard" })} variant="outline" className="w-full h-12 rounded-xl font-bold">
              Contact Enterprise
            </Button>
          </div>

        </div>

        {/* Section Header: FAQ Accordion */}
        <div id="faq" className="max-w-4xl mx-auto space-y-8 pt-12">
          <div className="text-center space-y-3">
            <h3 className="text-3xl font-black text-white font-outfit">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-[#141B2D] border border-slate-800 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between font-bold text-white text-base hover:bg-slate-900/40 transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-4 animate-in fade-in duration-200">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
