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
  Sparkles,
  Server,
  Cpu,
  Layers,
  MessageSquare,
  UserCheck,
  Brain,
  ShieldAlert,
  Eye,
  Paperclip,
  Bell,
  Languages,
  Ticket,
  Workflow,
  FileCode,
  RefreshCcw,
  Zap,
  Lock,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertTriangle,
  Play,
  Copy,
  Download,
  Upload,
  Globe,
  Sliders,
  DollarSign,
  Activity,
  Terminal,
  ChevronRight,
  ChevronLeft,
  Shield,
  KeyRound,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  EnterpriseAIConfig,
  AIProviderProfile,
  AIModelDefinition,
  AIFeatureAssignment,
  AIChatChannelConfig,
  AIPersonaConfig,
  AIModerationDetector,
  AIAutomationWorkflow,
  AIPromptItem,
  DiscordChannel
} from "@/types/api";

const BUILTIN_PROVIDERS_LIST = [
  { key: "openai", name: "OpenAI", icon: "zap", default_endpoint: "https://api.openai.com/v1" },
  { key: "anthropic", name: "Anthropic (Claude)", icon: "bot", default_endpoint: "https://api.anthropic.com/v1" },
  { key: "gemini", name: "Google Gemini", icon: "sparkles", default_endpoint: "https://generativelanguage.googleapis.com" },
  { key: "groq", name: "Groq", icon: "cpu", default_endpoint: "https://api.groq.com/openai/v1" },
  { key: "openrouter", name: "OpenRouter", icon: "network", default_endpoint: "https://openrouter.ai/api/v1" },
  { key: "opencode", name: "OpenCode", icon: "code", default_endpoint: "https://api.opencode.ai/v1" },
  { key: "deepseek", name: "DeepSeek", icon: "brain", default_endpoint: "https://api.deepseek.com" },
  { key: "xai", name: "xAI (Grok)", icon: "shield", default_endpoint: "https://api.x.ai/v1" },
  { key: "cohere", name: "Cohere", icon: "layers", default_endpoint: "https://api.cohere.com/v2" },
  { key: "mistral", name: "Mistral AI", icon: "wind", default_endpoint: "https://api.mistral.ai/v1" },
  { key: "together", name: "Together AI", icon: "users", default_endpoint: "https://api.together.xyz/v1" },
  { key: "azure_openai", name: "Azure OpenAI", icon: "cloud", default_endpoint: "https://YOUR-RESOURCE.openai.azure.com" },
  { key: "aws_bedrock", name: "AWS Bedrock", icon: "server", default_endpoint: "https://bedrock-runtime.us-east-1.amazonaws.com" },
  { key: "ollama", name: "Ollama (Self Hosted)", icon: "hard-drive", default_endpoint: "http://localhost:11434" },
  { key: "lm_studio", name: "LM Studio", icon: "laptop", default_endpoint: "http://localhost:1234/v1" },
  { key: "huggingface", name: "Hugging Face", icon: "smile", default_endpoint: "https://api-inference.huggingface.co" },
  { key: "fireworks", name: "Fireworks AI", icon: "flame", default_endpoint: "https://api.fireworks.ai/inference/v1" },
  { key: "perplexity", name: "Perplexity AI", icon: "search", default_endpoint: "https://api.perplexity.ai" },
  { key: "cerebras", name: "Cerebras", icon: "cpu", default_endpoint: "https://api.cerebras.ai/v1" },
  { key: "minimax", name: "MiniMax", icon: "activity", default_endpoint: "https://api.minimax.chat/v1" },
  { key: "zhipu", name: "Zhipu AI (GLM)", icon: "globe", default_endpoint: "https://open.bigmodel.cn/api/paas/v4" },
  { key: "sambanova", name: "SambaNova", icon: "zap", default_endpoint: "https://api.sambanova.ai/v1" },
  { key: "nvidia_nim", name: "NVIDIA NIM", icon: "cpu", default_endpoint: "https://integrate.api.nvidia.com/v1" },
  { key: "custom", name: "Custom Provider", icon: "sliders", default_endpoint: "https://api.yourdomain.com/v1" },
];

const SUB_MODULES = [
  { id: "overview", name: "Overview & Analytics", icon: Activity },
  { id: "providers", name: "AI Providers", icon: Server },
  { id: "models", name: "Model Library", icon: Cpu },
  { id: "assignment", name: "Feature Mapping", icon: Layers },
  { id: "channels", name: "AI Chat Channels", icon: MessageSquare },
  { id: "personas", name: "AI Personas", icon: UserCheck },
  { id: "memory", name: "Memory System", icon: Brain },
  { id: "moderation", name: "AI Moderation", icon: ShieldAlert },
  { id: "vision", name: "Vision & Attachments", icon: Eye },
  { id: "dm_warnings", name: "DM Warnings", icon: Bell },
  { id: "services", name: "Translation & Tickets", icon: Languages },
  { id: "automation", name: "Automation Builder", icon: Workflow },
  { id: "prompts", name: "Prompt Library", icon: FileCode },
  { id: "failover", name: "Failover & Budget", icon: RefreshCcw },
  { id: "testing", name: "Testing Playground", icon: Terminal },
  { id: "security", name: "Security & Keys", icon: Lock },
];

interface AIManagementDashboardProps {
  initialConfig: EnterpriseAIConfig;
  guildId: string;
  channels: DiscordChannel[];
}

export function AIManagementDashboard({ initialConfig, guildId, channels }: AIManagementDashboardProps) {
  const [config, setConfig] = useState<EnterpriseAIConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [saving, setSaving] = useState(false);
  const [testingProviderId, setTestingProviderId] = useState<string | null>(null);

  // Playground interactive state
  const [testPrompt, setTestPrompt] = useState("Scan this prompt for community guidelines adherence.");
  const [testFeature, setTestFeature] = useState("chat_ai");
  const [testModelId, setTestModelId] = useState("m1");
  const [testRunning, setTestRunning] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Modal / Form state for new provider
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [newProviderType, setNewProviderType] = useState("gemini");
  const [newProviderName, setNewProviderName] = useState("My Gemini Provider");
  const [newProviderKey, setNewProviderKey] = useState("");
  const [newProviderEndpoint, setNewProviderEndpoint] = useState("https://generativelanguage.googleapis.com");
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [selectedNewChannelId, setSelectedNewChannelId] = useState<string>("");

  const handleAddChatChannel = () => {
    if (!selectedNewChannelId) return;
    const targetChan = channels.find(c => c.id === selectedNewChannelId);
    const existing = config.chat_channels.find(c => c.channel_id === selectedNewChannelId);
    if (existing) {
      toast.error("Channel already added to AI Chat channels.");
      return;
    }

    const newChatChannel = {
      id: `c_${Date.now()}`,
      channel_id: selectedNewChannelId,
      channel_name: targetChan ? `#${targetChan.name}` : selectedNewChannelId,
      enabled: true,
      mode: "reply_all" as const,
      model_id: "m1",
      system_prompt: "You are Nyzro AI assistant. Help community members politely.",
      temperature: 0.7
    };

    setConfig(prev => ({ ...prev, chat_channels: [...prev.chat_channels, newChatChannel] }));
    setSelectedNewChannelId("");
    toast.success(`Added #${targetChan?.name || selectedNewChannelId} to AI Chat Channels!`);
  };

  const activeModuleIndex = Math.max(0, SUB_MODULES.findIndex(m => m.id === activeTab));

  // Save Config to Server
  const handleSave = async () => {
    setSaving(true);
    const promise = api.updateAIConfig(guildId, config);

    toast.promise(promise, {
      loading: "Saving Enterprise AI Orchestration Settings...",
      success: "Enterprise AI Configuration Saved!",
      error: (err) => err.message || "Failed to save configuration",
    });

    try {
      await promise;
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Test Connection for Provider Profile
  const handleTestConnection = async (profile: AIProviderProfile) => {
    setTestingProviderId(profile.id);
    toast.info(`Testing connection to ${profile.name}...`);
    try {
      const res = await api.testAIProviderConnection(profile.id, profile);
      if (res.status === "ok") {
        toast.success(`Connected to ${profile.name}! Latency: ${res.latency_ms}ms`);
        // Update profile status
        setConfig(prev => ({
          ...prev,
          providers: prev.providers.map(p => p.id === profile.id ? { ...p, status: "online", last_latency_ms: res.latency_ms } : p)
        }));
      } else {
        toast.error(`Connection failed: ${res.error || "Timeout"}`);
      }
    } catch (err: any) {
      toast.error(`Test failed: ${err.message || "Server unreachable"}`);
    } finally {
      setTestingProviderId(null);
    }
  };

  // Run Test Playground
  const handleRunPlayground = async () => {
    setTestRunning(true);
    setTestResult(null);
    try {
      const res = await api.runAITestPlayground(guildId, {
        prompt: testPrompt,
        feature: testFeature,
        modelId: testModelId,
      });
      setTestResult(res);
      toast.success("AI Playground execution complete.");
    } catch (err: any) {
      toast.error(`Execution error: ${err.message}`);
    } finally {
      setTestRunning(false);
    }
  };

  // Add Provider Profile
  const handleCreateProvider = () => {
    const template = BUILTIN_PROVIDERS_LIST.find(p => p.key === newProviderType);
    const newId = `prov_${Date.now()}`;
    const newProf: AIProviderProfile = {
      id: newId,
      name: newProviderName || (template ? template.name : "Custom AI"),
      provider_type: newProviderType,
      icon: template?.icon || "bot",
      api_key: newProviderKey,
      endpoint: newProviderEndpoint || template?.default_endpoint || "https://api.openai.com/v1",
      default_model: "default-model",
      timeout_seconds: 30,
      retry_policy: { max_retries: 3, backoff_factor: 2 },
      streaming_supported: true,
      rate_limit: { rpm: 500, tpm: 250000 },
      enabled: true,
      is_custom: newProviderType === "custom",
      status: "untested",
    };

    setConfig(prev => ({ ...prev, providers: [...prev.providers, newProf] }));
    setShowAddProviderModal(false);
    setNewProviderKey("");
    toast.success(`Provider profile '${newProf.name}' created!`);
  };

  // Delete Provider Profile
  const handleDeleteProvider = (id: string) => {
    setConfig(prev => ({ ...prev, providers: prev.providers.filter(p => p.id !== id) }));
    toast.success("Provider profile removed.");
  };

  return (
    <div className="space-y-8">
      {/* Platform Sub-Module Navigation Header with Scroll Arrows */}
      <div className="relative bg-[#141B2D] border border-slate-800 rounded-3xl p-3 shadow-xl flex items-center gap-2">
        <button
          onClick={() => {
            if (scrollContainerRef.current) scrollContainerRef.current.scrollBy({ left: -220, behavior: "smooth" });
          }}
          className="p-2.5 rounded-2xl bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50 flex-shrink-0 transition-colors"
          title="Scroll Left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div ref={scrollContainerRef} className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-1">
          {SUB_MODULES.map(mod => {
            const isActive = activeTab === mod.id;
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveTab(mod.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 flex-shrink-0",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/30 ring-1 ring-white/10 scale-[1.02]"
                    : "text-slate-400 bg-slate-900/40 hover:bg-slate-800/60 hover:text-white border border-slate-800/40"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "animate-pulse" : "opacity-60")} />
                {mod.name}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            if (scrollContainerRef.current) scrollContainerRef.current.scrollBy({ left: 220, behavior: "smooth" });
          }}
          className="p-2.5 rounded-2xl bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50 flex-shrink-0 transition-colors"
          title="Scroll Right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Main Content Area based on activeTab */}
      <div className="space-y-6">

        {/* 1. OVERVIEW & ANALYTICS */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-[0.04] group-hover:scale-110 transition-transform">
                  <Server className="h-28 w-28 text-white" />
                </div>
                <p className="text-xs uppercase font-black text-slate-500 tracking-wider">Active Providers</p>
                <div className="flex items-baseline gap-3 mt-3">
                  <h3 className="text-3xl font-black text-white">{config.providers.filter(p => p.enabled).length}</h3>
                  <span className="text-xs text-emerald-400 font-bold">/ {config.providers.length} Total</span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{config.providers.filter(p => p.status === "online").length} Online & Healthy</span>
                </div>
              </div>

              <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-[0.04] group-hover:scale-110 transition-transform">
                  <Cpu className="h-28 w-28 text-white" />
                </div>
                <p className="text-xs uppercase font-black text-slate-500 tracking-wider">Registered Models</p>
                <div className="flex items-baseline gap-3 mt-3">
                  <h3 className="text-3xl font-black text-white">{config.models.length}</h3>
                  <span className="text-xs text-primary font-bold">Multi-Provider</span>
                </div>
                <p className="mt-4 text-xs text-slate-400">Mapped across 13 bot features</p>
              </div>

              <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-[0.04] group-hover:scale-110 transition-transform">
                  <DollarSign className="h-28 w-28 text-white" />
                </div>
                <p className="text-xs uppercase font-black text-slate-500 tracking-wider">Est. Monthly Cost</p>
                <div className="flex items-baseline gap-3 mt-3">
                  <h3 className="text-3xl font-black text-white">${config.stats.monthly_cost_usd.toFixed(2)}</h3>
                  <span className="text-xs text-amber-400 font-bold">Cap: ${config.failover.budget_cap_monthly}</span>
                </div>
                <div className="mt-4 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(config.stats.monthly_cost_usd / config.failover.budget_cap_monthly) * 100}%` }} />
                </div>
              </div>

              <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-[0.04] group-hover:scale-110 transition-transform">
                  <Activity className="h-28 w-28 text-white" />
                </div>
                <p className="text-xs uppercase font-black text-slate-500 tracking-wider">Avg Latency & Success</p>
                <div className="flex items-baseline gap-3 mt-3">
                  <h3 className="text-3xl font-black text-white">{config.stats.average_latency_ms}ms</h3>
                  <span className="text-xs text-emerald-400 font-bold">{config.stats.success_rate_pct}% Success</span>
                </div>
                <p className="mt-4 text-xs text-slate-400">Total Requests: {config.stats.total_requests.toLocaleString()}</p>
              </div>
            </div>

            {/* Quick Status Overview */}
            <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Enterprise Multi-Provider Health Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {config.providers.map(p => (
                  <div key={p.id} className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-primary font-bold">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{p.name}</h4>
                        <p className="text-xs text-slate-500">{p.default_model}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        p.status === "online" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800 text-slate-400"
                      )}>
                        {p.status}
                      </span>
                      {p.last_latency_ms && <p className="text-[10px] text-slate-500 mt-1">{p.last_latency_ms}ms</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. AI PROVIDER MANAGEMENT */}
        {activeTab === "providers" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  AI Provider Profiles (Built-in 23+ & Custom)
                </h3>
                <p className="text-xs text-slate-400 mt-1">Manage unlimited API provider profiles with reusable configurations.</p>
              </div>
              <Button onClick={() => setShowAddProviderModal(true)} className="gap-2 font-bold">
                <Plus className="h-4 w-4" /> Add Provider Profile
              </Button>
            </div>

            {/* Provider Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.providers.map(p => (
                <div key={p.id} className="bg-[#141B2D] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{p.name}</h4>
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{p.provider_type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={p.enabled}
                        onCheckedChange={() => setConfig(prev => ({
                          ...prev,
                          providers: prev.providers.map(item => item.id === p.id ? { ...item, enabled: !item.enabled } : item)
                        }))}
                      />
                      <button onClick={() => handleDeleteProvider(p.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Endpoint / Base URL</label>
                      <Input
                        value={p.endpoint}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          providers: prev.providers.map(item => item.id === p.id ? { ...item, endpoint: e.target.value } : item)
                        }))}
                        className="bg-slate-900/60 border-slate-800 text-xs text-slate-300 mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">API Key (Secret Encrypted)</label>
                      <Input
                        type="password"
                        value={p.api_key}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          providers: prev.providers.map(item => item.id === p.id ? { ...item, api_key: e.target.value } : item)
                        }))}
                        className="bg-slate-900/60 border-slate-800 text-xs text-slate-300 mt-1"
                        placeholder="sk-..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Default Model</label>
                        <Input
                          value={p.default_model}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            providers: prev.providers.map(item => item.id === p.id ? { ...item, default_model: e.target.value } : item)
                          }))}
                          className="bg-slate-900/60 border-slate-800 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Timeout (sec)</label>
                        <Input
                          type="number"
                          value={p.timeout_seconds}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            providers: prev.providers.map(item => item.id === p.id ? { ...item, timeout_seconds: parseInt(e.target.value) || 30 } : item)
                          }))}
                          className="bg-slate-900/60 border-slate-800 text-xs mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                    <span className="text-xs text-slate-500">Rate Limit: {p.rate_limit.rpm} RPM</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection(p)}
                      disabled={testingProviderId === p.id}
                      className="gap-2 text-xs font-bold"
                    >
                      {testingProviderId === p.id ? <RefreshCcw className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5 text-amber-400" />}
                      Test Connection
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal for New Provider */}
            {showAddProviderModal && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                <div className="bg-[#141B2D] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Create AI Provider Profile</h3>
                    <button onClick={() => setShowAddProviderModal(false)} className="text-slate-400 hover:text-white">✕</button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Provider Template</label>
                      <Select
                        value={newProviderType}
                        onValueChange={(val) => {
                          setNewProviderType(val);
                          const t = BUILTIN_PROVIDERS_LIST.find(p => p.key === val);
                          if (t) {
                            setNewProviderName(`${t.name} Profile`);
                            setNewProviderEndpoint(t.default_endpoint);
                          }
                        }}
                        options={BUILTIN_PROVIDERS_LIST.map(p => ({ value: p.key, label: p.name }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Profile Display Name</label>
                      <Input
                        value={newProviderName}
                        onChange={(e) => setNewProviderName(e.target.value)}
                        placeholder="e.g. Gemini Production, Local Ollama"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Endpoint URL</label>
                      <Input
                        value={newProviderEndpoint}
                        onChange={(e) => setNewProviderEndpoint(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">API Key (Optional for Local)</label>
                      <Input
                        type="password"
                        value={newProviderKey}
                        onChange={(e) => setNewProviderKey(e.target.value)}
                        placeholder="sk-..."
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={() => setShowAddProviderModal(false)}>Cancel</Button>
                    <Button onClick={handleCreateProvider} className="font-bold">Add Profile</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. AI MODEL LIBRARY */}
        {activeTab === "models" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  AI Model Registry Library
                </h3>
                <p className="text-xs text-slate-400 mt-1">Register models, token context limits, cost parameters, and capabilities.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.models.map(m => {
                const parentProvider = config.providers.find(p => p.id === m.provider_id);
                return (
                  <div key={m.id} className="bg-[#141B2D] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 bg-primary/20 text-primary border border-primary/30 rounded-lg text-[10px] font-black uppercase">
                          {parentProvider?.name || "Provider"}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{m.speed_rating}</span>
                      </div>

                      <h4 className="font-black text-white text-lg tracking-tight">{m.model_name}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{m.description}</p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {m.supports_vision && <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-[10px] font-bold">Vision</span>}
                        {m.supports_streaming && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-[10px] font-bold">Streaming</span>}
                        {m.supports_image_gen && <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold">Image Gen</span>}
                      </div>

                      <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 text-xs space-y-1">
                        <div className="flex justify-between text-slate-400">
                          <span>Context Window:</span>
                          <span className="text-white font-mono">{m.context_window.toLocaleString()} tokens</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>1M Token Input:</span>
                          <span className="text-white font-mono">${m.input_cost_per_1m.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>1M Token Output:</span>
                          <span className="text-white font-mono">${m.output_cost_per_1m.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 italic">
                      Recommended: {m.recommended_use_cases.join(", ")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. FEATURE-BASED AI ASSIGNMENT */}
        {activeTab === "assignment" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Feature-Based AI Assignment Matrix
              </h3>
              <p className="text-xs text-slate-400 mt-1">Bind individual AI models and fallbacks to specific system features.</p>
            </div>

            <div className="bg-[#141B2D] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="divide-y divide-slate-800">
                {config.feature_assignments.map(feat => (
                  <div key={feat.feature_key} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-900/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{feat.feature_name}</h4>
                        <p className="text-xs text-slate-500">{feat.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-full sm:w-48">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Primary Model</label>
                        <Select
                          value={feat.assigned_model_id}
                          onValueChange={(val) => setConfig(prev => ({
                            ...prev,
                            feature_assignments: prev.feature_assignments.map(f => f.feature_key === feat.feature_key ? { ...f, assigned_model_id: val } : f)
                          }))}
                          options={config.models.map(m => ({ value: m.id, label: `${m.model_name}` }))}
                          className="mt-1"
                        />
                      </div>

                      <div className="w-full sm:w-48">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Fallback Model</label>
                        <Select
                          value={feat.fallback_model_id}
                          onValueChange={(val) => setConfig(prev => ({
                            ...prev,
                            feature_assignments: prev.feature_assignments.map(f => f.feature_key === feat.feature_key ? { ...f, fallback_model_id: val } : f)
                          }))}
                          options={config.models.map(m => ({ value: m.id, label: `${m.model_name}` }))}
                          className="mt-1"
                        />
                      </div>

                      <Switch
                        checked={feat.enabled}
                        onCheckedChange={() => setConfig(prev => ({
                          ...prev,
                          feature_assignments: prev.feature_assignments.map(f => f.feature_key === feat.feature_key ? { ...f, enabled: !f.enabled } : f)
                        }))}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. AI CHAT CHANNELS */}
        {activeTab === "channels" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  AI Chat Channel Management
                </h3>
                <p className="text-xs text-slate-400 mt-1">Select and configure specific Discord text channels where Nyzro AI auto-chat responds.</p>
              </div>

              {/* Add Channel Picker */}
              <div className="flex items-center gap-3">
                <Select
                  value={selectedNewChannelId}
                  onValueChange={setSelectedNewChannelId}
                  options={channels.map(c => ({ value: c.id, label: `#${c.name}` }))}
                  placeholder="Select Discord Channel..."
                  className="w-56"
                />
                <Button
                  onClick={handleAddChatChannel}
                  disabled={!selectedNewChannelId}
                  className="gap-2 font-bold"
                >
                  <Plus className="h-4 w-4" /> Add Channel
                </Button>
              </div>
            </div>

            {config.chat_channels.length === 0 ? (
              <div className="p-12 text-center bg-[#141B2D] border border-slate-800 rounded-3xl space-y-3 shadow-xl">
                <MessageSquare className="h-10 w-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No AI Chat Channels Configured</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Select a text channel above and click &quot;Add Channel&quot; to enable custom AI responses in your Discord server.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {config.chat_channels.map((ch, idx) => (
                  <div key={ch.channel_id || idx} className="p-6 bg-[#141B2D] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">{ch.channel_name || `#${ch.channel_id}`}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {ch.channel_id}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">Channel AI</span>
                          <Switch
                            checked={ch.enabled}
                            onCheckedChange={(val) => {
                              const updated = [...config.chat_channels];
                              updated[idx].enabled = val;
                              setConfig(prev => ({ ...prev, chat_channels: updated }));
                            }}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updated = config.chat_channels.filter((_, i) => i !== idx);
                            setConfig(prev => ({ ...prev, chat_channels: updated }));
                            toast.success("AI Chat Channel removed.");
                          }}
                          className="text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Response Mode</label>
                        <Select
                          value={ch.mode || "reply_all"}
                          onValueChange={(val: any) => {
                            const updated = [...config.chat_channels];
                            updated[idx].mode = val;
                            setConfig(prev => ({ ...prev, chat_channels: updated }));
                          }}
                          options={[
                            { value: "reply_all", label: "Respond to All Messages" },
                            { value: "mention_only", label: "Respond Only When @Mentioned" }
                          ]}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Assigned Model Override</label>
                        <Select
                          value={ch.model_id || "default"}
                          onValueChange={(val) => {
                            const updated = [...config.chat_channels];
                            updated[idx].model_id = val === "default" ? undefined : val;
                            setConfig(prev => ({ ...prev, chat_channels: updated }));
                          }}
                          options={[
                            { value: "default", label: "Default System Model" },
                            ...config.models.map(m => ({ value: m.id, label: m.model_name }))
                          ]}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Channel Custom System Prompt</label>
                      <Textarea
                        value={ch.system_prompt || ""}
                        onChange={(e) => {
                          const updated = [...config.chat_channels];
                          updated[idx].system_prompt = e.target.value;
                          setConfig(prev => ({ ...prev, chat_channels: updated }));
                        }}
                        placeholder="e.g. You are an expert gaming guide for our Discord server..."
                        className="mt-1 bg-slate-900/60 border-slate-800 text-xs h-20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. AI PERSONAS */}
        {activeTab === "personas" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                AI Personas & Personality Presets
              </h3>
              <p className="text-xs text-slate-400 mt-1">Craft unique system prompts and formatting rules for your AI.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.personas.map(p => (
                <div key={p.id} className="bg-[#141B2D] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-lg">{p.name}</h4>
                    <span className="px-2.5 py-1 bg-slate-800 text-slate-400 text-[10px] uppercase font-black rounded-lg">
                      {p.preset_type}
                    </span>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">System Prompt</label>
                    <Textarea
                      rows={3}
                      value={p.system_prompt}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        personas: prev.personas.map(item => item.id === p.id ? { ...item, system_prompt: e.target.value } : item)
                      }))}
                      className="bg-slate-900/60 border-slate-800 text-xs mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Response Style</label>
                      <Select
                        value={p.response_style}
                        onValueChange={(val: any) => setConfig(prev => ({
                          ...prev,
                          personas: prev.personas.map(item => item.id === p.id ? { ...item, response_style: val } : item)
                        }))}
                        options={[
                          { value: "concise", label: "Concise" },
                          { value: "detailed", label: "Detailed" },
                          { value: "playful", label: "Playful" },
                          { value: "formal", label: "Formal" },
                          { value: "technical", label: "Technical" },
                        ]}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Emoji Usage</label>
                      <Select
                        value={p.emoji_usage}
                        onValueChange={(val: any) => setConfig(prev => ({
                          ...prev,
                          personas: prev.personas.map(item => item.id === p.id ? { ...item, emoji_usage: val } : item)
                        }))}
                        options={[
                          { value: "none", label: "None" },
                          { value: "subtle", label: "Subtle" },
                          { value: "expressive", label: "Expressive" },
                        ]}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. AI MEMORY SYSTEM */}
        {activeTab === "memory" && (
          <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6 max-w-3xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Conversation Memory Architecture
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Memory Scope Mode</label>
                <Select
                  value={config.memory.global_mode}
                  onValueChange={(val: any) => setConfig(prev => ({ ...prev, memory: { ...prev.memory, global_mode: val } }))}
                  options={[
                    { value: "disabled", label: "Disabled (Stateless)" },
                    { value: "temporary", label: "Temporary (Session Only)" },
                    { value: "persistent", label: "Persistent DB Storage" },
                    { value: "per_user", label: "Per User Memory" },
                    { value: "per_channel", label: "Per Channel Memory" },
                    { value: "per_server", label: "Per Server Memory" },
                  ]}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Max History Messages</label>
                <Input
                  type="number"
                  value={config.memory.max_messages_per_conversation}
                  onChange={(e) => setConfig(prev => ({ ...prev, memory: { ...prev.memory, max_messages_per_conversation: parseInt(e.target.value) || 10 } }))}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Expiration (Hours)</label>
                <Input
                  type="number"
                  value={config.memory.expiration_hours}
                  onChange={(e) => setConfig(prev => ({ ...prev, memory: { ...prev.memory, expiration_hours: parseInt(e.target.value) || 24 } }))}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <span className="text-xs font-bold text-slate-300">Auto Memory Cleanup</span>
                <Switch
                  checked={config.memory.auto_cleanup}
                  onCheckedChange={(val) => setConfig(prev => ({ ...prev, memory: { ...prev.memory, auto_cleanup: val } }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* 8. AI MODERATION CENTER */}
        {activeTab === "moderation" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" />
                AI Moderation Center (13 Neural Detectors)
              </h3>
              <p className="text-xs text-slate-400 mt-1">Configure automated context detection and action policies.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.moderation_detectors.map(det => (
                <div key={det.id} className="bg-[#141B2D] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-base">{det.name}</h4>
                    <Switch
                      checked={det.enabled}
                      onCheckedChange={() => setConfig(prev => ({
                        ...prev,
                        moderation_detectors: prev.moderation_detectors.map(item => item.id === det.id ? { ...item, enabled: !item.enabled } : item)
                      }))}
                    />
                  </div>

                  <p className="text-xs text-slate-400">{det.description}</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Sensitivity ({det.sensitivity}%)</label>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={det.sensitivity}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          moderation_detectors: prev.moderation_detectors.map(item => item.id === det.id ? { ...item, sensitivity: parseInt(e.target.value) } : item)
                        }))}
                        className="w-full mt-2 accent-primary"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Enforced Action</label>
                      <Select
                        value={det.action}
                        onValueChange={(val: any) => setConfig(prev => ({
                          ...prev,
                          moderation_detectors: prev.moderation_detectors.map(item => item.id === det.id ? { ...item, action: val } : item)
                        }))}
                        options={[
                          { value: "delete", label: "Delete Message" },
                          { value: "warn", label: "Warn User" },
                          { value: "timeout", label: "Timeout User" },
                          { value: "kick", label: "Kick User" },
                          { value: "ban", label: "Ban User" },
                          { value: "dm_warn", label: "Send DM Warning" },
                          { value: "log_only", label: "Log Only" },
                        ]}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. VISION & ATTACHMENT SCANNER */}
        {activeTab === "vision" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Vision AI Image Filters
              </h3>

              <div className="space-y-4">
                {[
                  { key: "scam_image_detection", label: "Scam Image Detection" },
                  { key: "qr_scam_detection", label: "QR Code Scam Filter" },
                  { key: "fake_nitro_detection", label: "Fake Nitro Giveaway Images" },
                  { key: "nsfw_image_detection", label: "NSFW & Explicit Image Filter" },
                  { key: "ocr_enabled", label: "OCR Image Text Extraction" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
                    <span className="text-sm font-bold text-slate-200">{item.label}</span>
                    <Switch
                      checked={(config.vision as any)[item.key]}
                      onCheckedChange={(val) => setConfig(prev => ({
                        ...prev,
                        vision: { ...prev.vision, [item.key]: val }
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Paperclip className="h-5 w-5 text-primary" />
                AI Attachment File Scanner
              </h3>

              <div className="space-y-4">
                {[
                  { key: "scan_images", label: "Scan Image Attachments" },
                  { key: "scan_pdf", label: "Scan PDF Documents" },
                  { key: "scan_doc", label: "Scan Word & Office Files" },
                  { key: "scan_zip", label: "Scan ZIP & Archives" },
                  { key: "scan_executables", label: "Scan Executable Binaries (.exe)" },
                  { key: "scan_scripts", label: "Scan Scripts (.py, .js, .sh)" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
                    <span className="text-sm font-bold text-slate-200">{item.label}</span>
                    <Switch
                      checked={(config.attachment_scanner as any)[item.key]}
                      onCheckedChange={(val) => setConfig(prev => ({
                        ...prev,
                        attachment_scanner: { ...prev.attachment_scanner, [item.key]: val }
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 10. DM WARNINGS */}
        {activeTab === "dm_warnings" && (
          <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                AI DM Warning & Appeal Workflow
              </h3>
              <Switch
                checked={config.dm_warning.enabled}
                onCheckedChange={(val) => setConfig(prev => ({ ...prev, dm_warning: { ...prev.dm_warning, enabled: val } }))}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Warning Message Template</label>
              <Textarea
                rows={4}
                value={config.dm_warning.warning_template}
                onChange={(e) => setConfig(prev => ({ ...prev, dm_warning: { ...prev.dm_warning, warning_template: e.target.value } }))}
                className="bg-slate-900/60 border-slate-800 text-xs mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <span className="text-xs font-bold text-slate-300">Appeal Button</span>
                <Switch
                  checked={config.dm_warning.appeal_button_enabled}
                  onCheckedChange={(val) => setConfig(prev => ({ ...prev, dm_warning: { ...prev.dm_warning, appeal_button_enabled: val } }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <span className="text-xs font-bold text-slate-300">Notify Mods</span>
                <Switch
                  checked={config.dm_warning.notify_moderators}
                  onCheckedChange={(val) => setConfig(prev => ({ ...prev, dm_warning: { ...prev.dm_warning, notify_moderators: val } }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* 11. TRANSLATION & TICKETS */}
        {activeTab === "services" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" />
                AI Real-Time Translation
              </h3>

              <div className="space-y-4">
                {[
                  { key: "translate_messages", label: "Translate User Messages" },
                  { key: "translate_embeds", label: "Translate Bot Embeds" },
                  { key: "translate_tickets", label: "Translate Support Tickets" },
                  { key: "translate_announcements", label: "Translate Announcements" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
                    <span className="text-sm font-bold text-slate-200">{item.label}</span>
                    <Switch
                      checked={(config.translation as any)[item.key]}
                      onCheckedChange={(val) => setConfig(prev => ({
                        ...prev,
                        translation: { ...prev.translation, [item.key]: val }
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                AI Ticket & Form Assistant
              </h3>

              <div className="space-y-4">
                {[
                  { key: "ticket_summarization", label: "Ticket Auto Summarization" },
                  { key: "suggest_mod_replies", label: "Suggest Moderator Replies" },
                  { key: "faq_auto_response", label: "FAQ Auto Assistant" },
                  { key: "form_application_scoring", label: "Application Form Scoring" },
                  { key: "urgent_escalation", label: "Urgent Ticket Sentiment Escalation" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
                    <span className="text-sm font-bold text-slate-200">{item.label}</span>
                    <Switch
                      checked={(config.ticket_form_assistant as any)[item.key]}
                      onCheckedChange={(val) => setConfig(prev => ({
                        ...prev,
                        ticket_form_assistant: { ...prev.ticket_form_assistant, [item.key]: val }
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 12. AUTOMATION BUILDER */}
        {activeTab === "automation" && (
          <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Workflow className="h-5 w-5 text-primary" />
                Visual AI Automation Builder
              </h3>
              <p className="text-xs text-slate-400 mt-1">Create drag-and-drop IF-THEN triggers, AI classifiers, and automated system actions.</p>
            </div>

            <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-primary font-bold text-xs flex items-center gap-2">
                <Play className="h-4 w-4" /> Trigger Node
              </div>
              <ChevronRight className="h-5 w-5 text-slate-600 hidden md:block" />
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-300 font-bold text-xs flex items-center gap-2">
                <Brain className="h-4 w-4" /> AI Classifier (GPT-4o / Claude)
              </div>
              <ChevronRight className="h-5 w-5 text-slate-600 hidden md:block" />
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 font-bold text-xs flex items-center gap-2">
                <Shield className="h-4 w-4" /> Action: Delete & Alert Mods
              </div>
            </div>

            {config.automations.map(auto => (
              <div key={auto.id} className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{auto.name}</h4>
                  <p className="text-xs text-slate-500">{auto.description}</p>
                </div>
                <Switch checked={auto.enabled} onCheckedChange={() => {}} />
              </div>
            ))}
          </div>
        )}

        {/* 13. PROMPT LIBRARY */}
        {activeTab === "prompts" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileCode className="h-5 w-5 text-primary" />
                Prompt Management Library
              </h3>
              <p className="text-xs text-slate-400 mt-1">Manage versioned prompt templates and binding assignments.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.prompts.map(pr => (
                <div key={pr.id} className="bg-[#141B2D] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-base">{pr.title}</h4>
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-black rounded-full">
                      {pr.version}
                    </span>
                  </div>

                  <Textarea
                    rows={3}
                    value={pr.content}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      prompts: prev.prompts.map(item => item.id === pr.id ? { ...item, content: e.target.value } : item)
                    }))}
                    className="bg-slate-900/60 border-slate-800 text-xs mt-1"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 14. FAILOVER & BUDGET */}
        {activeTab === "failover" && (
          <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <RefreshCcw className="h-5 w-5 text-primary" />
                Provider Failover & Budget Routing
              </h3>
              <Switch
                checked={config.failover.enabled}
                onCheckedChange={(val) => setConfig(prev => ({ ...prev, failover: { ...prev.failover, enabled: val } }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Daily Budget Cap ($ USD)</label>
                <Input
                  type="number"
                  value={config.failover.budget_cap_daily}
                  onChange={(e) => setConfig(prev => ({ ...prev, failover: { ...prev.failover, budget_cap_daily: parseFloat(e.target.value) || 0 } }))}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Monthly Budget Cap ($ USD)</label>
                <Input
                  type="number"
                  value={config.failover.budget_cap_monthly}
                  onChange={(e) => setConfig(prev => ({ ...prev, failover: { ...prev.failover, budget_cap_monthly: parseFloat(e.target.value) || 0 } }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <span className="text-xs font-bold text-slate-300">Auto Fallback to Zero-Cost Provider on Budget Cap</span>
              <Switch
                checked={config.failover.auto_fallback_on_budget_exceeded}
                onCheckedChange={(val) => setConfig(prev => ({ ...prev, failover: { ...prev.failover, auto_fallback_on_budget_exceeded: val } }))}
              />
            </div>
          </div>
        )}

        {/* 15. TESTING PLAYGROUND */}
        {activeTab === "testing" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                AI Interactive Testing Center
              </h3>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Target Feature</label>
                <Select
                  value={testFeature}
                  onValueChange={setTestFeature}
                  options={config.feature_assignments.map(f => ({ value: f.feature_key, label: f.feature_name }))}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Test Model</label>
                <Select
                  value={testModelId}
                  onValueChange={setTestModelId}
                  options={config.models.map(m => ({ value: m.id, label: m.model_name }))}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Input Test Prompt</label>
                <Textarea
                  rows={4}
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="bg-slate-900/60 border-slate-800 text-xs mt-1"
                />
              </div>

              <Button onClick={handleRunPlayground} disabled={testRunning} className="w-full font-bold gap-2">
                {testRunning ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Execute AI Request
              </Button>
            </div>

            <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-400" />
                Execution Results & Debug Console
              </h3>

              {testResult ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 bg-slate-900 rounded-xl text-center">
                      <p className="text-[10px] text-slate-500 uppercase">Latency</p>
                      <p className="text-sm font-bold text-emerald-400">{testResult.latency_ms}ms</p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl text-center">
                      <p className="text-[10px] text-slate-500 uppercase">Tokens</p>
                      <p className="text-sm font-bold text-white">{testResult.input_tokens} / {testResult.output_tokens}</p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl text-center">
                      <p className="text-[10px] text-slate-500 uppercase">Cost</p>
                      <p className="text-sm font-bold text-amber-400">${testResult.estimated_cost}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Response Output</label>
                    <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs text-slate-200 font-mono whitespace-pre-wrap">
                      {testResult.response_text}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Debug Routing Logs</label>
                    <div className="p-3 bg-black/60 border border-slate-800 rounded-xl text-[10px] text-emerald-400 font-mono space-y-1">
                      {testResult.debug_logs?.map((log: string, idx: number) => (
                        <div key={idx}>{log}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
                  <Terminal className="h-8 w-8 mb-2 opacity-30" />
                  Run a test prompt above to view real-time latency, token usage, cost, and debug logs.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 16. SECURITY & KEYS */}
        {activeTab === "security" && (
          <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6 max-w-3xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Security, Secret Masking & Audit Logs
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="text-xs text-emerald-300 font-bold">API Key AES-256-GCM Encryption Active</span>
              </div>

              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Secret Key Masking</h4>
                  <p className="text-xs text-slate-500">Mask API keys in dashboard UI (`sk-...4a9f`)</p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>
            </div>
          </div>
        )}
        {/* Linear Previous / Next Module Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <Button
            variant="outline"
            disabled={activeModuleIndex <= 0}
            onClick={() => setActiveTab(SUB_MODULES[activeModuleIndex - 1].id)}
            className="gap-2 font-bold text-xs"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous: {activeModuleIndex > 0 ? SUB_MODULES[activeModuleIndex - 1].name : "Start"}
          </Button>

          <span className="text-xs font-mono text-slate-500 font-bold">
            {activeModuleIndex + 1} of {SUB_MODULES.length} Modules
          </span>

          <Button
            variant="outline"
            disabled={activeModuleIndex >= SUB_MODULES.length - 1}
            onClick={() => setActiveTab(SUB_MODULES[activeModuleIndex + 1].id)}
            className="gap-2 font-bold text-xs"
          >
            Next: {activeModuleIndex < SUB_MODULES.length - 1 ? SUB_MODULES[activeModuleIndex + 1].name : "End"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

      </div>

      {/* Global Bottom Sticky Save Bar */}
      <div className="sticky bottom-6 z-40 bg-[#141B2D]/90 backdrop-blur-md border border-slate-800 rounded-3xl p-4 shadow-2xl flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-400 font-medium">Enterprise AI Management Platform Ready</span>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-12 px-8 font-bold gap-2 text-sm"
        >
          {saving ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Enterprise AI Settings
        </Button>
      </div>
    </div>
  );
}
