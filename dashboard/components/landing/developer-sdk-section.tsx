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
import { Terminal, Copy, CheckCircle2, Code } from "lucide-react";
import { cn } from "@/lib/utils";

const PYTHON_CODE = `# Initialize Nyzro AI Multi-Provider Manager
from ai.manager import AIManager

ai = AIManager(config_path="config.yml")

# Dispatch request mapped to 'moderation_ai' feature
response = await ai.execute_feature(
    feature_key="moderation_ai",
    messages=[{"role": "user", "content": "Scan message for context"}]
)

print(f"Provider: {response.provider} | Latency: {response.latency_ms}ms")`;

const TS_CODE = `import { api } from "@/lib/api";

// Execute Live AI Playground Test
const result = await api.runAITestPlayground("guild_850129", {
  prompt: "Verify community guideline compliance",
  feature: "chat_ai",
  modelId: "gemini-2.5-flash"
});

console.log(\`Execution status: \${result.status} | Latency: \${result.latency_ms}ms\`);`;

export function DeveloperSdkSection() {
  const [activeLang, setActiveLang] = useState<"python" | "typescript">("python");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = activeLang === "python" ? PYTHON_CODE : TS_CODE;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 px-6 relative z-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            Developer Experience & SDK
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-outfit">
            Programmatic API & Extensible Architecture
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Integrate custom provider adapters, automate bot feature assignments, and manage telemetry programmatically.
          </p>
        </div>

        {/* Code Block Container */}
        <div className="bg-[#141B2D] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Header Bar */}
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveLang("python")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold font-mono transition-colors",
                    activeLang === "python" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  python/ai_manager.py
                </button>
                <button
                  onClick={() => setActiveLang("typescript")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold font-mono transition-colors",
                    activeLang === "typescript" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  typescript/api.ts
                </button>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>

          {/* Syntax Highlighted Code Output */}
          <div className="p-6 bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto">
            <pre>
              <code>{activeLang === "python" ? PYTHON_CODE : TS_CODE}</code>
            </pre>
          </div>

        </div>

      </div>
    </section>
  );
}
