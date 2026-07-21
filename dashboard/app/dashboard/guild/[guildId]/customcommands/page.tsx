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
import { Terminal } from "lucide-react";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";

const CustomCommandsForm = dynamic(() => import("@/components/dashboard/customcommands-form").then(mod => mod.CustomCommandsForm), {
  loading: () => <div className="h-96 w-full animate-pulse bg-slate-800/20 rounded-3xl" />
});

export default async function CustomCommandsPage({ params }: { params: { guildId: string } }) {
  const customCommandsConfig = await api.getCustomCommands(params.guildId);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Terminal className="h-6 w-6 text-primary" />
            Custom Commands
          </h2>
          <p className="text-slate-400 mt-1">Create custom commands for your server!</p>
        </div>
      </div>

      <CustomCommandsForm initialConfig={customCommandsConfig} guildId={params.guildId} />
    </div>
  );
}
