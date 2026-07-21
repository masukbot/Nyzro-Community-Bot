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

import React from "react";
import { Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";

const AIManagementDashboard = dynamic(
  () => import("@/components/dashboard/ai/ai-management-dashboard").then(mod => mod.AIManagementDashboard),
  {
    loading: () => <div className="h-[600px] w-full animate-pulse bg-slate-900/40 border border-slate-800 rounded-3xl" />
  }
);

export default async function AIPage({ params }: { params: { guildId: string } }) {
  const config = await api.getAIConfig(params.guildId);
  const channels = await api.getChannels(params.guildId).catch(() => []);

  if (!config) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              AI Orchestration & Management Platform
            </h2>
            <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-[10px] font-black uppercase tracking-wider">
              Enterprise v3.0
            </span>
          </div>
          <p className="text-slate-400 mt-2">
            Centralized control center for 23+ AI providers, custom model registration, feature assignment, vision security, cost analytics, and visual automations.
          </p>
        </div>
      </div>

      <AIManagementDashboard initialConfig={config} guildId={params.guildId} channels={channels} />
    </div>
  );
}
