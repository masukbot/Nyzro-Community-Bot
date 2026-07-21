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
import { 
  Save,
  RefreshCcw
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { StarboardConfig, DiscordChannel } from "@/types/api";

interface StarboardFormProps {
  initialConfig: StarboardConfig;
  channels: DiscordChannel[];
  guildId: string;
}

export function StarboardForm({ initialConfig, channels, guildId }: StarboardFormProps) {
  const [config, setConfig] = useState<StarboardConfig>(initialConfig || {
    guild_id: parseInt(guildId),
    star_emoji: "⭐",
    required_stars: 3
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const promise = api.updateStarboard(guildId, config);

    toast.promise(promise, {
      loading: 'Saving starboard configuration...',
      success: 'Starboard settings saved successfully!',
      error: 'Failed to update starboard settings',
    });

    try {
      await promise;
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const channelOptions = channels.map(c => ({
    value: c.id.toString(),
    label: `#${c.name}`
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[#141B2D] border border-slate-800 rounded-3xl shadow-xl p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase text-slate-500 tracking-widest pl-1">Starboard Channel</label>
              <Select 
                value={config.channel_id || ""}
                onValueChange={(val) => setConfig({ ...config, channel_id: val })}
                options={channelOptions}
                placeholder="Select a channel..."
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-slate-500 tracking-widest pl-1">Star Emoji</label>
              <input 
                type="text"
                value={config.star_emoji || "⭐"}
                onChange={(e) => setConfig({ ...config, star_emoji: e.target.value })}
                className="w-full mt-2 bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                placeholder="⭐"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-slate-500 tracking-widest pl-1">Required Stars</label>
              <input 
                type="number"
                min="1"
                value={config.required_stars || 3}
                onChange={(e) => setConfig({ ...config, required_stars: parseInt(e.target.value) || 3 })}
                className="w-full mt-2 bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
              />
            </div>
          </div>

          <Button 
            onClick={handleSave}
            disabled={saving}
            className="w-full h-14 text-base font-bold gap-2"
          >
            {saving ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
