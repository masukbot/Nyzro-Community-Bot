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
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";

const COMPARISON_ITEMS = [
  { feature: "Multi-Provider AI (23+ Built-in & Custom)", nyzro: true, legacy: false },
  { feature: "Feature-Based AI Model Assignment", nyzro: true, legacy: false },
  { feature: "Vision AI QR & Phishing Attachment Scanner", nyzro: true, legacy: false },
  { feature: "Automatic AI Failover & Budget Router", nyzro: true, legacy: false },
  { feature: "Visual Drag-and-Drop Automation Builder", nyzro: true, legacy: false },
  { feature: "Sub-Second Anti-Nuke & Audit Restore", nyzro: true, legacy: "Partial" },
  { feature: "Real-Time Telemetry & Cost Monitoring", nyzro: true, legacy: false },
  { feature: "Interactive Testing Playground Console", nyzro: true, legacy: false },
];

export function ComparisonMatrix() {
  return (
    <section className="py-24 px-6 relative z-10 bg-[#0f172a]/30">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            Enterprise Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-outfit">
            Why Leading Discord Communities Choose Nyzro
          </h2>
        </div>

        <div className="bg-[#141B2D] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800">
                <th className="p-5 text-xs font-bold text-slate-400 uppercase">Capability / Feature</th>
                <th className="p-5 text-xs font-black text-primary uppercase text-center bg-primary/10 border-x border-primary/20">
                  Nyzro Platform
                </th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase text-center">Legacy Discord Bots</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {COMPARISON_ITEMS.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                  <td className="p-5 font-bold text-slate-200">{item.feature}</td>
                  
                  <td className="p-5 text-center bg-primary/5 border-x border-primary/10">
                    <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Supported</span>
                    </div>
                  </td>

                  <td className="p-5 text-center text-slate-500 text-xs font-bold">
                    {item.legacy === false ? (
                      <div className="flex items-center justify-center gap-1.5 text-slate-600">
                        <XCircle className="h-4 w-4" />
                        <span>Unsupported</span>
                      </div>
                    ) : (
                      <span className="text-amber-400">{item.legacy}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
