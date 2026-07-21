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
import { signIn } from "next-auth/react";
import {
  ShieldCheck,
  Zap,
  Sparkles,
  Cpu,
  Bot,
  Ticket,
  Check,
  Minus,
  Crown,
  Flame,
  Plus,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Database,
  Lock,
  Layers,
  Activity,
  Users,
  Star,
  Globe,
  Sliders,
  Calculator,
  Terminal
} from "lucide-react";

export function EnterprisePricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Calculator State
  const [calcServers, setCalcServers] = useState<number>(3);
  const [calcMessages, setCalcMessages] = useState<number>(25000);
  const [calcAiRequests, setCalcAiRequests] = useState<number>(2500);

  // Calculation Logic
  let recommendedPlan = "Starter";
  let estimatedCost = "$0";
  let savings = "Included Free";

  if (calcServers > 5 || calcMessages > 100000 || calcAiRequests > 10000) {
    recommendedPlan = "Enterprise";
    estimatedCost = "Custom SLA";
    savings = "Dedicated Edge Shards";
  } else if (calcServers > 1 || calcMessages > 10000 || calcAiRequests > 1000) {
    recommendedPlan = "Pro Guild";
    estimatedCost = billingCycle === "yearly" ? "$9.60 / mo" : "$12 / mo";
    savings = "Save 20% on Annual Billing";
  }

  const proPrice = billingCycle === "yearly" ? "$9.60" : "$12";

  return (
    <section id="pricing" className="w-full relative py-32 bg-[#05060a] text-slate-300 font-sans border-t border-white/10 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-500/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
        
        {/* SECTION HEADER */}
        <div className="w-full text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-mono text-xs font-bold tracking-widest uppercase shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>PRICING</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold text-white font-display tracking-tight leading-tight">
            Simple Pricing. <span className="text-red-500">Powerful Features.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 font-sans max-w-xl mx-auto">
            Choose the plan that matches your community. Upgrade anytime as your server grows.
          </p>

          {/* BILLING TOGGLE */}
          <div className="pt-6 flex justify-center w-full">
            <div className="p-1.5 rounded-2xl bg-[#0e121e] border border-white/10 flex items-center gap-2 shadow-2xl">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                  billingCycle === "yearly"
                    ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Yearly</span>
                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-[10px]">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 MAIN PRICING CARDS */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          
          {/* STARTER CARD */}
          <div className="w-full p-8 lg:p-10 rounded-3xl bg-[#0b0e18] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between shadow-xl space-y-8">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 block mb-2 font-bold">Starter</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-white font-display">$0</span>
                  <span className="text-sm font-mono text-slate-500">/ mo</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Essential Discord moderation and core features for growing guilds.</p>
              </div>

              <button
                onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs font-mono transition-all hover:border-white/30"
              >
                Get Started
              </button>

              <div className="pt-4 border-t border-white/5 space-y-3.5 font-sans text-xs">
                {[
                  { icon: ShieldCheck, text: "Basic Moderation Engine" },
                  { icon: Bot, text: "Welcome & Auto Role" },
                  { icon: Terminal, text: "Audit Logs (7 Days)" },
                  { icon: Lock, text: "Captcha Verification" },
                  { icon: Users, text: "Community Helpdesk Support" }
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-3 text-slate-300">
                    <f.icon className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PRO CARD (FEATURED / AMBIENT GLOW) */}
          <div className="w-full relative p-9 lg:p-10 rounded-3xl bg-gradient-to-b from-[#121626] to-[#0b0e18] border-2 border-red-500 shadow-2xl shadow-red-500/20 flex flex-col justify-between transition-all hover:border-red-400 space-y-8">
            {/* Animated Glow Border Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white text-[11px] font-mono font-bold uppercase tracking-widest shadow-lg shadow-red-500/40 border border-white/20 whitespace-nowrap">
              MOST POPULAR
            </div>

            <div className="space-y-6 pt-2">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-red-400 block mb-2 font-bold">Pro Guild</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-white font-display">{proPrice}</span>
                  <span className="text-sm font-mono text-slate-400">/ mo</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">Full multi-provider AI, vision OCR scanner, and sub-second anti-nuke.</p>
              </div>

              <button
                onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold text-xs font-mono shadow-xl shadow-red-500/30 transition-all"
              >
                Upgrade to Pro
              </button>

              <div className="pt-4 border-t border-white/10 space-y-3.5 font-sans text-xs">
                {[
                  { icon: Zap, text: "Unlimited Discord Servers" },
                  { icon: Sparkles, text: "AI Multi-Provider Suite (Gemini, Claude, GPT-4o)" },
                  { icon: Cpu, text: "Vision QR & Image Phishing Scanner" },
                  { icon: Flame, text: "Sub-Second Anti-Nuke Recovery" },
                  { icon: Ticket, text: "AI Ticket Summarizer & Escalation" },
                  { icon: Layers, text: "Reaction Roles & Join To Create" },
                  { icon: Activity, text: "Advanced Telemetry Analytics" },
                  { icon: Crown, text: "24/7 Priority Support" }
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-3 text-slate-200 font-medium">
                    <f.icon className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ENTERPRISE CARD */}
          <div className="w-full p-8 lg:p-10 rounded-3xl bg-[#0b0e18] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between shadow-xl space-y-8">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-purple-400 block mb-2 font-bold">Enterprise</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-white font-display">Custom</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Dedicated edge shards, custom AI fine-tuning, and 99.99% uptime SLAs.</p>
              </div>

              <button
                onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs font-mono transition-all hover:border-white/30"
              >
                Contact Sales
              </button>

              <div className="pt-4 border-t border-white/5 space-y-3.5 font-sans text-xs">
                {[
                  { icon: Database, text: "Dedicated Shard Infrastructure" },
                  { icon: Cpu, text: "Custom Fine-Tuned AI Models" },
                  { icon: Lock, text: "Custom Webhooks & REST Integrations" },
                  { icon: Crown, text: "Guaranteed 99.99% Uptime SLA" },
                  { icon: Globe, text: "White Label Bot Branding" },
                  { icon: ShieldCheck, text: "Dedicated Technical Account Manager" }
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-3 text-slate-300">
                    <f.icon className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE AI USAGE CALCULATOR */}
        <div className="w-full p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-[#0c101d] to-[#070912] border border-white/10 shadow-2xl space-y-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-6">
            <div className="p-3 rounded-2xl bg-red-500/10 text-red-500">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white font-display">Interactive AI & Infrastructure Calculator</h3>
              <p className="text-xs text-slate-400">Estimate your monthly cost and recommended plan based on your community size</p>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Sliders */}
            <div className="space-y-6 w-full">
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400">Number of Discord Servers:</span>
                  <span className="text-white font-bold">{calcServers}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={calcServers}
                  onChange={(e) => setCalcServers(parseInt(e.target.value))}
                  className="w-full accent-red-500 bg-white/10 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400">Messages Scanned per Day:</span>
                  <span className="text-white font-bold">{calcMessages.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="500000"
                  step="5000"
                  value={calcMessages}
                  onChange={(e) => setCalcMessages(parseInt(e.target.value))}
                  className="w-full accent-red-500 bg-white/10 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400">AI Requests per Day:</span>
                  <span className="text-white font-bold">{calcAiRequests.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="50000"
                  step="500"
                  value={calcAiRequests}
                  onChange={(e) => setCalcAiRequests(parseInt(e.target.value))}
                  className="w-full accent-red-500 bg-white/10 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Result Card */}
            <div className="w-full p-8 rounded-2xl bg-[#0f1424] border border-red-500/30 space-y-6 text-center lg:text-left shadow-xl">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1">ESTIMATED MONTHLY COST</span>
                <span className="text-4xl font-extrabold text-white font-display">{estimatedCost}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block">Recommended Plan</span>
                  <span className="text-red-400 font-bold text-base">{recommendedPlan}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Value Benefit</span>
                  <span className="text-green-400 font-bold">{savings}</span>
                </div>
              </div>

              <button
                onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono transition-all shadow-lg shadow-red-500/20"
              >
                Select {recommendedPlan} Plan
              </button>
            </div>
          </div>
        </div>

        {/* FEATURE COMPARISON TABLE */}
        <div className="w-full space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-extrabold text-white font-display">Compare Plan Features</h3>
            <p className="text-xs text-slate-400 mt-2">Comprehensive matrix of capability limits across plans</p>
          </div>

          <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-[#0b0e18]">
            <table className="w-full text-xs text-left min-w-[640px]">
              <thead className="bg-[#111522] border-b border-white/10 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-4 font-semibold">Capability</th>
                  <th className="p-4 font-semibold text-center">Starter ($0)</th>
                  <th className="p-4 font-semibold text-center text-red-400 bg-red-500/10">Pro Guild ($12)</th>
                  <th className="p-4 font-semibold text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {[
                  { name: "Multi-Model AI Chat (Gemini/Claude/GPT)", starter: false, pro: true, enterprise: true },
                  { name: "Vision & OCR Phishing Attachment Scanner", starter: false, pro: true, enterprise: true },
                  { name: "Sub-Second Anti-Nuke State Snapshot", starter: false, pro: true, enterprise: true },
                  { name: "Smart Ticket Summarization & Sentiment", starter: false, pro: true, enterprise: true },
                  { name: "Custom AI Provider API Keys & Ollama", starter: false, pro: true, enterprise: true },
                  { name: "Audit Trail Logging & Recovery", starter: "7 Days", pro: "90 Days", enterprise: "Unlimited" },
                  { name: "Dedicated Edge Shard Routing", starter: false, pro: false, enterprise: true },
                  { name: "Custom Webhook REST API Access", starter: false, pro: true, enterprise: true },
                  { name: "Support Response SLA", starter: "Community", pro: "< 2 Hours", enterprise: "15-Min Dedicated" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-medium text-slate-200">{row.name}</td>
                    <td className="p-4 text-center">
                      {typeof row.starter === "boolean" ? (
                        row.starter ? <Check className="h-4 w-4 text-green-400 mx-auto" /> : <Minus className="h-4 w-4 text-slate-600 mx-auto" />
                      ) : <span className="font-mono text-slate-400">{row.starter}</span>}
                    </td>
                    <td className="p-4 text-center bg-red-500/[0.03]">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? <Check className="h-4 w-4 text-red-400 mx-auto font-bold" /> : <Minus className="h-4 w-4 text-slate-600 mx-auto" />
                      ) : <span className="font-mono text-red-400 font-bold">{row.pro}</span>}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.enterprise === "boolean" ? (
                        row.enterprise ? <Crown className="h-4 w-4 text-purple-400 mx-auto" /> : <Minus className="h-4 w-4 text-slate-600 mx-auto" />
                      ) : <span className="font-mono text-purple-400 font-bold">{row.enterprise}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TRUST INDICATORS & ANIMATED COUNTERS */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: "12M+", label: "Protected Users" },
            { value: "5,000+", label: "Communities" },
            { value: "99.99%", label: "Uptime SLA" },
            { value: "50+", label: "Global Shard Regions" }
          ].map((c, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#0b0e18] border border-white/10 text-center space-y-1 shadow-lg">
              <span className="text-3xl lg:text-4xl font-extrabold text-white font-display block">{c.value}</span>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{c.label}</span>
            </div>
          ))}
        </div>

        {/* FAQ ACCORDION */}
        <div id="faq" className="w-full max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold">FAQ</span>
            <h3 className="text-3xl font-extrabold text-white font-display">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-3 font-sans text-xs">
            {[
              { q: "Can I change plans anytime?", a: "Yes! You can upgrade or downgrade your guild plan anytime directly from the dashboard." },
              { q: "Do you store server messages?", a: "No. Nyzro processes all telemetry in-memory over encrypted edge endpoints without permanent message storage." },
              { q: "Can I use my own AI API keys?", a: "Yes, Pro and Enterprise plans allow custom API profiles for OpenAI, Anthropic, Gemini, Groq, and Ollama." },
              { q: "What happens if a bot raid occurs?", a: "Nyzro automatically quarantines joining raid accounts in <0.14s and restores any altered roles or deleted channels." },
              { q: "What is the difference between Pro and Enterprise?", a: "Pro provides complete AI and security features for individual guilds. Enterprise offers dedicated hardware shards and custom fine-tuned models." }
            ].map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-white/10 bg-[#0b0e18] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-100 flex items-center justify-between gap-4"
                >
                  <span className="text-sm">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-red-500 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FINAL CTA BANNER */}
        <div className="w-full relative p-12 lg:p-16 rounded-3xl bg-gradient-to-r from-[#121626] via-[#1a0e1c] to-[#121626] border border-red-500/30 text-center space-y-6 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-red-500/10 blur-3xl pointer-events-none" />
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight relative z-10">
            Ready to Scale Your Community?
          </h3>
          <p className="text-base text-slate-300 max-w-xl mx-auto relative z-10">
            Deploy enterprise-grade moderation and multi-provider AI in under 30 seconds.
          </p>
          <div className="flex justify-center gap-4 relative z-10">
            <button
              onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
              className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono shadow-xl shadow-red-500/30 transition-all"
            >
              Start Free Today
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
