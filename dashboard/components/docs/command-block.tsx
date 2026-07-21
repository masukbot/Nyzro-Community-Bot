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
import { Terminal, Copy, Check, Shield } from "lucide-react";
import { DocCommand } from "@/lib/docs-data";

interface CommandBlockProps {
  command: DocCommand;
}

export function CommandBlock({ command }: CommandBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command.example);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-2xl bg-[#0b0e18] border border-red-500/20 overflow-hidden shadow-xl">
      {/* Chrome header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#111522] border-b border-white/5">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-red-500" />
          <span className="font-mono text-xs font-bold text-white">{command.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
            {command.permission}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4 font-sans text-xs">
        <p className="text-slate-300">{command.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
          <div className="p-3 rounded-xl bg-black/40 border border-white/5">
            <span className="text-slate-500 block mb-1">USAGE</span>
            <span className="text-red-400 font-bold">{command.usage}</span>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5">
            <span className="text-slate-500 block mb-1">ALIASES</span>
            <span className="text-slate-300">{command.aliases.join(", ") || "None"}</span>
          </div>
        </div>

        {/* Example Box */}
        <div className="p-3.5 rounded-xl bg-[#060810] border border-white/10 flex items-center justify-between font-mono">
          <div>
            <span className="text-[10px] text-slate-500 block">EXAMPLE COMMAND</span>
            <span className="text-green-400 font-bold">{command.example}</span>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            title="Copy Command"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
