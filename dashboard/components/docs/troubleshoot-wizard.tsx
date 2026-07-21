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
import { HelpCircle, CheckCircle, AlertTriangle, ArrowRight, RefreshCw, Terminal } from "lucide-react";

const ISSUES = [
  {
    id: "no_respond",
    title: "Bot does not respond to commands",
    cause: "Nyzro bot role is below required server roles or missing Read Message History permission.",
    solution: "Move the Nyzro bot role above all user roles in Discord Server Settings -> Roles, and verify permissions.",
    command: "/ping"
  },
  {
    id: "anti_nuke_failed",
    title: "Anti-nuke did not block admin deletion",
    cause: "Bot lacks Administrator permission or action threshold limits are set too high.",
    solution: "Grant Administrator permission to the bot or lower the channel delete threshold in `/antinuke config`.",
    command: "/antinuke config channel_delete_limit:2"
  },
  {
    id: "ai_error",
    title: "AI Chat returns quota or API key error",
    cause: "Configured AI key has expired or fallback Ollama node is offline.",
    solution: "Check API key under Dashboard -> AI Suite -> Providers and test connection status.",
    command: "/ai test-connection"
  },
  {
    id: "verify_captcha",
    title: "Users cannot complete Captcha verification",
    cause: "The verified role is managed by an integration or missing Manage Roles permission.",
    solution: "Assign a standard role as the Verified Role in Dashboard -> Verification settings.",
    command: "/verify status"
  }
];

export function TroubleshootWizard() {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const issueData = ISSUES.find(i => i.id === selectedIssue);

  return (
    <div className="my-8 rounded-2xl bg-[#0b0e18] border border-white/10 p-6 space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500">
          <HelpCircle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Interactive Diagnostic Assistant</h3>
          <p className="text-xs text-slate-400">Select your problem below for immediate resolution steps</p>
        </div>
      </div>

      {!selectedIssue ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ISSUES.map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedIssue(item.id)}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-red-400">{item.title}</span>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-5 rounded-xl bg-[#101422] border border-red-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              {issueData?.title}
            </h4>
            <button
              onClick={() => setSelectedIssue(null)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
            >
              <RefreshCw className="h-3 w-3" /> Reset Wizard
            </button>
          </div>

          <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 block">ROOT CAUSE</span>
            <p className="text-xs text-slate-300 font-sans">{issueData?.cause}</p>
          </div>

          <div className="p-3.5 rounded-lg bg-green-500/10 border border-green-500/20 space-y-1">
            <span className="text-[10px] font-mono text-green-400 block flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> RECOMMENDED FIX
            </span>
            <p className="text-xs text-slate-200 font-sans">{issueData?.solution}</p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#060810] border border-white/10 font-mono text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-red-500" />
              <span className="text-slate-400">Diagnostic Command:</span>
              <span className="text-white font-bold">{issueData?.command}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
