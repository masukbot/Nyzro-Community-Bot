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
import { Play, Copy, Check, Terminal, Code2 } from "lucide-react";
import { DocApiEndpoint } from "@/lib/docs-data";

interface ApiExplorerProps {
  endpoint: DocApiEndpoint;
}

export function ApiExplorer({ endpoint }: ApiExplorerProps) {
  const [copied, setCopied] = useState(false);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(endpoint.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTry = () => {
    setIsLoading(true);
    setTimeout(() => {
      setResponseOutput(endpoint.response);
      setIsLoading(false);
    }, 600);
  };

  const badgeColor = 
    endpoint.method === "GET" ? "bg-green-500/20 text-green-400 border-green-500/30" :
    endpoint.method === "POST" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
    endpoint.method === "PUT" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
    "bg-red-500/20 text-red-400 border-red-500/30";

  return (
    <div className="my-6 rounded-2xl bg-[#0b0e18] border border-white/10 overflow-hidden shadow-xl font-sans text-xs">
      {/* Endpoint Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#111522] border-b border-white/5 font-mono">
        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${badgeColor}`}>
            {endpoint.method}
          </span>
          <span className="text-white font-bold">{endpoint.path}</span>
        </div>
        <button
          onClick={handleTry}
          disabled={isLoading}
          className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>{isLoading ? "Executing..." : "Try Request"}</span>
        </button>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-slate-300">{endpoint.summary}</p>

        {/* Headers */}
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1.5">HEADERS</span>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] space-y-1">
            {Object.entries(endpoint.headers).map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="text-red-400">{k}:</span>
                <span className="text-slate-300">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Body if any */}
        {endpoint.body && (
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1.5">REQUEST BODY (JSON)</span>
            <pre className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-slate-200 overflow-x-auto">
              {endpoint.body}
            </pre>
          </div>
        )}

        {/* Response Box */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase">RESPONSE (200 OK)</span>
            <button onClick={handleCopy} className="text-slate-400 hover:text-white flex items-center gap-1 font-mono text-[10px]">
              {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />} Copy JSON
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-[#060810] border border-white/10 font-mono text-[11px] text-green-400 overflow-x-auto">
            {responseOutput || endpoint.response}
          </pre>
        </div>
      </div>
    </div>
  );
}
