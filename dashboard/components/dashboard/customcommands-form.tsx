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
  RefreshCcw,
  Plus,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CustomCommandConfig, CustomCommand } from "@/types/api";

interface CustomCommandsFormProps {
  initialConfig: CustomCommandConfig;
  guildId: string;
}

export function CustomCommandsForm({ initialConfig, guildId }: CustomCommandsFormProps) {
  const [config, setConfig] = useState<CustomCommandConfig>(initialConfig || {
    guild_id: parseInt(guildId),
    commands: []
  });
  const [saving, setSaving] = useState(false);
  const [newCommandName, setNewCommandName] = useState("");
  const [newCommandResponse, setNewCommandResponse] = useState("");

  const handleSave = async () => {
    setSaving(true);
    const promise = api.updateCustomCommands(guildId, config);

    toast.promise(promise, {
      loading: 'Saving custom commands...',
      success: 'Custom commands saved successfully!',
      error: 'Failed to update custom commands',
    });

    try {
      await promise;
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addCommand = () => {
    if (!newCommandName || !newCommandResponse) return;
    setConfig({
      ...config,
      commands: [...config.commands, { name: newCommandName.toLowerCase(), response: newCommandResponse }]
    });
    setNewCommandName("");
    setNewCommandResponse("");
  };

  const removeCommand = (index: number) => {
    setConfig({
      ...config,
      commands: config.commands.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[#141B2D] border border-slate-800 rounded-3xl shadow-xl p-8 space-y-6">
          <h3 className="text-lg font-bold text-white">Add New Command</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase text-slate-500 tracking-widest pl-1">Command Name</label>
              <input
                type="text"
                value={newCommandName}
                onChange={(e) => setNewCommandName(e.target.value)}
                placeholder="hello"
                className="w-full mt-2 bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-black uppercase text-slate-500 tracking-widest pl-1">Response</label>
            <textarea
              value={newCommandResponse}
              onChange={(e) => setNewCommandResponse(e.target.value)}
              placeholder="Hello {user}! Welcome to {server_name}!"
              className="w-full mt-2 bg-[#0f172a] border border-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white min-h-[100px]"
            />
          </div>
          <Button onClick={addCommand} className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Add Command
          </Button>

          <div className="border-t border-slate-800 pt-6 mt-6">
            <h3 className="text-lg font-bold text-white mb-4">Existing Commands</h3>
            {config.commands.length === 0 ? (
              <p className="text-slate-500">No custom commands yet!</p>
            ) : (
              <div className="space-y-3">
                {config.commands.map((cmd, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#0f172a] border border-slate-800 rounded-xl">
                    <div>
                      <p className="text-white font-bold">{cmd.name}</p>
                      <p className="text-slate-400 text-sm">{cmd.response}</p>
                    </div>
                    <Button variant="ghost" onClick={() => removeCommand(index)} className="text-red-500 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
