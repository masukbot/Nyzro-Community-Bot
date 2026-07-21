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
import { Activity, Users, MessageSquare, BarChart3 } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";

export default async function AnalyticsPage({ params }: { params: { guildId: string } }) {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Server Analytics
          </h2>
          <p className="text-slate-400 mt-1">View your server&apos;s statistics!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Users}
          name="Total Members"
          value="0"
          trend={{ value: "0%", isUp: true }}
        />
        <MetricCard
          icon={MessageSquare}
          name="Total Messages"
          value="0"
          trend={{ value: "0%", isUp: true }}
        />
        <MetricCard
          icon={Activity}
          name="Commands Used"
          value="0"
          trend={{ value: "0%", isUp: true }}
        />
        <MetricCard
          icon={BarChart3}
          name="Active Users (24h)"
          value="0"
          trend={{ value: "0%", isUp: true }}
        />
      </div>

      <div className="bg-[#141B2D] border border-slate-800 rounded-3xl shadow-xl p-8">
        <h3 className="text-white font-bold mb-4">Recent Activity</h3>
        <p className="text-slate-400">Coming soon: detailed analytics and charts!</p>
      </div>
    </div>
  );
}
