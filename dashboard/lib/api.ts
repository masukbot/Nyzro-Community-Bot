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

import { 
  BotInfo, 
  BotStatus, 
  GuildSummary, 
  GuildDetails,
  PrefixConfig, 
  AutomodConfig, 
  TicketConfig, 
  LevelingConfig, 
  LoggingConfig,
  PrefixUpdate,
  AutomodUpdate,
  LevelingUpdate,
  LoggingUpdate,
  LeaderboardEntry,
  DiscordChannel,
  DiscordRole,
  AutoRoleConfig,
  AutoRoleUpdate,
  AdminStats,
  AdminConfig,
  AdminConfigUpdate,
  StarboardConfig,
  StarboardUpdate,
  CustomCommandConfig,
  EnterpriseAIConfig
} from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const API_KEY = process.env.NEXT_PUBLIC_DASHBOARD_API_KEY;

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit & { next?: NextFetchRequestConfig } = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers);
  if (API_KEY) {
    headers.set("Authorization", `Bearer ${API_KEY}`);
  }
  headers.set("Content-Type", "application/json");
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      // CRITICAL: Never cache mutation responses. For GETs, use revalidate: 0
      // to always fetch fresh data from the bot API. Caching was causing
      // saved data to "disappear" on reload because Next.js served stale cache.
      next: options.next || { revalidate: 0 },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { detail: "An unknown error occurred" };
      }
      console.error(`[API HTTP Error] Status ${response.status} for ${url}:`, errorData);
      throw new ApiError(response.status, errorData.detail || response.statusText);
    }

    return response.json();
  } catch (error) {
    console.error(`[API Network/Fetch Error] Failed to fetch ${url}:`, error);
    throw error;
  }
}

export const api = {
  // Bot 
  getBotStatus: () => request<BotStatus>("/bot/status", { next: { revalidate: 30 } }), // Cache for 30 seconds
  getBotInfo: () => request<BotInfo>("/bot/info", { next: { revalidate: 60 } }), // Cache for 1 minute

  // Guilds
  listGuilds: () => request<GuildSummary[]>("/guilds/", { next: { revalidate: 10 } }), // Cache for 10 seconds
  getGuildDetails: (guildId: string) => request<any>(`/guilds/${guildId}`, { next: { revalidate: 10 } }),
  getChannels: (guildId: string) => request<DiscordChannel[]>(`/guilds/${guildId}/channels`, { next: { revalidate: 30 } }),
  getRoles: (guildId: string) => request<DiscordRole[]>(`/guilds/${guildId}/roles`, { next: { revalidate: 30 } }),
  
  // Module Configs
  getPrefix: (guildId: string) => request<PrefixConfig>(`/guilds/${guildId}/prefix`, { next: { revalidate: 60 } }),
  updatePrefix: (guildId: string, prefix: string) => 
    request<{ status: string; new_prefix: string }>(`/guilds/${guildId}/prefix`, {
      method: "POST",
      body: JSON.stringify({ prefix }),
    }),

  getAutomod: (guildId: string) => request<AutomodConfig>(`/guilds/${guildId}/automod`, { next: { revalidate: 60 } }),
  updateAutomod: (guildId: string, data: Partial<AutomodConfig>) => 
    request<{ status: string }>(`/guilds/${guildId}/automod`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getTickets: (guildId: string) => request<TicketConfig>(`/guilds/${guildId}/tickets`, { next: { revalidate: 60 } }),
  updateTickets: (guildId: string, data: any) => 
    request<{ status: string }>(`/guilds/${guildId}/tickets`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  
  getLeveling: (guildId: string) => request<LevelingConfig>(`/guilds/${guildId}/leveling`, { next: { revalidate: 60 } }),
  updateLeveling: (guildId: string, data: any) => 
    request<{ status: string }>(`/guilds/${guildId}/leveling`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getLogging: (guildId: string) => request<LoggingConfig>(`/guilds/${guildId}/logging`, { next: { revalidate: 60 } }),
  updateLogging: (guildId: string, data: any) => 
    request<{ status: string }>(`/guilds/${guildId}/logging`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getLeaderboard: (guildId: string) => request<LeaderboardEntry[]>(`/guilds/${guildId}/leveling/leaderboard`, { next: { revalidate: 120 } }), // Cache 2 mins

  getWelcome: (guildId: string) => request<any>(`/guilds/${guildId}/welcome`, { next: { revalidate: 60 } }),
  updateWelcome: (guildId: string, data: any) => 
    request<{ status: string }>(`/guilds/${guildId}/welcome`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getAntiNuke: (guildId: string) => request<any>(`/guilds/${guildId}/antinuke`, { next: { revalidate: 60 } }),
  updateAntiNuke: (guildId: string, data: any) => 
    request<{ status: string }>(`/guilds/${guildId}/antinuke`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getVerification: (guildId: string) => request<any>(`/guilds/${guildId}/verification`, { next: { revalidate: 60 } }),
  updateVerification: (guildId: string, data: any) => 
    request<{ status: string }>(`/guilds/${guildId}/verification`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getVanityRoles: (guildId: string) => request<any[]>(`/guilds/${guildId}/vanityroles`, { next: { revalidate: 60 } }),
  addVanityRole: (guildId: string, data: any) =>
    request<{ status: string }>(`/guilds/${guildId}/vanityroles`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteVanityRole: (guildId: string, vanity: string) =>
    request<{ status: string }>(`/guilds/${guildId}/vanityroles/${vanity}`, {
      method: "DELETE",
    }),

  getAutoRole: (guildId: string) => request<AutoRoleConfig>(`/guilds/${guildId}/autorole`, { next: { revalidate: 60 } }),
  updateAutoRole: (guildId: string, data: AutoRoleUpdate) =>
    request<{ status: string }>(`/guilds/${guildId}/autorole`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getTracking: (guildId: string) => request<any>(`/guilds/${guildId}/tracking`, { next: { revalidate: 60 } }),
  updateTracking: (guildId: string, data: any) =>
    request<{ status: string }>(`/guilds/${guildId}/tracking`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getJ2C: (guildId: string) => request<any>(`/guilds/${guildId}/j2c`, { next: { revalidate: 60 } }),
  updateJ2C: (guildId: string, data: any) =>
    request<{ status: string }>(`/guilds/${guildId}/j2c`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getJoinDM: (guildId: string) => request<any>(`/guilds/${guildId}/joindm`, { next: { revalidate: 60 } }),
  updateJoinDM: (guildId: string, data: any) =>
    request<{ status: string }>(`/guilds/${guildId}/joindm`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getCustomRoles: (guildId: string) => request<any>(`/guilds/${guildId}/customroles`, { next: { revalidate: 60 } }),
  updateCustomRoles: (guildId: string, data: any) =>
    request<{ status: string }>(`/guilds/${guildId}/customroles`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getAutoReact: (guildId: string) => request<any>(`/guilds/${guildId}/autoreact`, { next: { revalidate: 60 } }),
  updateAutoReact: (guildId: string, data: any) =>
    request<{ status: string }>(`/guilds/${guildId}/autoreact`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getInvcRole: (guildId: string) => request<any>(`/guilds/${guildId}/invcrole`, { next: { revalidate: 60 } }),
  updateInvcRole: (guildId: string, data: any) =>
    request<{ status: string }>(`/guilds/${guildId}/invcrole`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getRR: (guildId: string) => request<any>(`/guilds/${guildId}/reactionroles`, { next: { revalidate: 60 } }),
  updateRR: (guildId: string, data: any) =>
    request<{ status: string }>(`/guilds/${guildId}/reactionroles`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  getInvites: (guildId: string) => request<any>(`/guilds/${guildId}/invites`, { next: { revalidate: 60 } }),
  updateInvites: (guildId: string, data: any) =>
    request<{ status: string }>(`/guilds/${guildId}/invites`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getStarboard: (guildId: string) => request<StarboardConfig>(`/guilds/${guildId}/starboard`, { next: { revalidate: 60 } }),
  updateStarboard: (guildId: string, data: StarboardUpdate) =>
    request<{ status: string }>(`/guilds/${guildId}/starboard`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getCustomCommands: (guildId: string) => request<CustomCommandConfig>(`/guilds/${guildId}/customcommands`, { next: { revalidate: 60 } }),
  updateCustomCommands: (guildId: string, data: CustomCommandConfig) =>
    request<{ status: string }>(`/guilds/${guildId}/customcommands`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Admin
  getAdminStats: () => request<AdminStats>("/admin/stats", { next: { revalidate: 60 } }),
  getAdminConfig: () => request<AdminConfig>("/admin/config", { next: { revalidate: 60 } }),
  updateAdminConfig: (data: AdminConfigUpdate) => 
    request<{ status: string }>("/admin/config", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Enterprise AI Management
  getAIConfig: async (guildId: string) => {
    const initial = getInitialEnterpriseAIConfig(guildId);
    try {
      const res = await request<any>(`/guilds/${guildId}/ai`, { next: { revalidate: 0 } });
      if (!res) return initial;
      const provs = Array.isArray(res.providers) ? res.providers : (Array.isArray(res.provider_profiles) ? res.provider_profiles : initial.providers);
      const mods = Array.isArray(res.models) ? res.models : (Array.isArray(res.model_definitions) ? res.model_definitions : initial.models);
      const feats = Array.isArray(res.feature_assignments) && res.feature_assignments.length > 0 ? res.feature_assignments : initial.feature_assignments;
      return {
        ...initial,
        ...res,
        stats: { ...initial.stats, ...(res.stats || {}) },
        providers: provs,
        models: mods,
        feature_assignments: feats,
        chat_channels: Array.isArray(res.chat_channels) ? res.chat_channels : [],
        personas: Array.isArray(res.personas) ? res.personas : initial.personas,
        moderation_detectors: Array.isArray(res.moderation_detectors) ? res.moderation_detectors : initial.moderation_detectors,
        automations: Array.isArray(res.automations) ? res.automations : initial.automations,
        prompts: Array.isArray(res.prompts) ? res.prompts : initial.prompts,
        memory: { ...initial.memory, ...(res.memory || res.memory_config || {}) },
        vision: { ...initial.vision, ...(res.vision || res.vision_config || {}) },
        attachment_scanner: { ...initial.attachment_scanner, ...(res.attachment_scanner || {}) },
        dm_warning: { ...initial.dm_warning, ...(res.dm_warning || {}) },
        translation: { ...initial.translation, ...(res.translation || {}) },
        ticket_form_assistant: { ...initial.ticket_form_assistant, ...(res.ticket_form_assistant || {}) },
        failover: { ...initial.failover, ...(res.failover || res.failover_config || {}) }
      };
    } catch {
      return initial;
    }
  },

  updateAIConfig: (guildId: string, data: any) =>
    request<{ status: string }>(`/guilds/${guildId}/ai`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  testAIProviderConnection: async (providerId: string, profile: any) => {
    return await request<any>(`/guilds/ai/providers/test`, {
      method: "POST",
      body: JSON.stringify({ providerId, profile }),
    });
  },

  runAITestPlayground: async (guildId: string, payload: any) => {
    return await request<any>(`/guilds/${guildId}/ai/playground`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
};

export function getInitialEnterpriseAIConfig(guildId: string): EnterpriseAIConfig {
  return {
    guild_id: guildId,
    ai_enabled: false,
    stats: {
      total_requests: 0,
      active_providers: 0,
      active_models: 0,
      monthly_token_usage: 0,
      monthly_cost_usd: 0,
      average_latency_ms: 0,
      success_rate_pct: 100,
    },
    providers: [],
    models: [],
    feature_assignments: [
      { feature_key: "chat_ai", feature_name: "Chat AI", description: "Handles interactive community chat conversations in designated channels.", category: "chat", assigned_model_id: "", fallback_model_id: "", enabled: false },
      { feature_key: "moderation_ai", feature_name: "Moderation AI", description: "Evaluates context, hate speech, and toxicity in messages.", category: "moderation", assigned_model_id: "", fallback_model_id: "", enabled: false },
      { feature_key: "scam_image_detection", feature_name: "Scam Image Detection", description: "Scans uploaded images for QR code scams, fake gift cards, and nitro giveaways.", category: "vision", assigned_model_id: "", fallback_model_id: "", enabled: false },
      { feature_key: "auto_moderation", feature_name: "Auto Moderation", description: "Rapid sub-second message evaluation for instant action.", category: "moderation", assigned_model_id: "", fallback_model_id: "", enabled: false },
      { feature_key: "translation", feature_name: "Translation", description: "Multi-language real-time translation of user messages.", category: "utility", assigned_model_id: "", fallback_model_id: "", enabled: false },
      { feature_key: "summarization", feature_name: "Summarization", description: "Generates quick recaps of active chat threads and ticket discussions.", category: "utility", assigned_model_id: "", fallback_model_id: "", enabled: false },
      { feature_key: "ticket_form_assistant", feature_name: "Ticket Form Assistant", description: "Summarizes support tickets, suggests mod responses, and scores forms.", category: "utility", assigned_model_id: "", fallback_model_id: "", enabled: false },
    ],
    chat_channels: [],
    personas: [],
    memory: {
      guild_id: guildId,
      global_mode: "disabled",
      max_messages_per_conversation: 10,
      token_limit_window: 4096,
      expiration_hours: 24,
      auto_cleanup: true
    },
    moderation_detectors: [],
    vision: {
      guild_id: guildId,
      scam_image_detection: false,
      qr_scam_detection: false,
      fake_nitro_detection: false,
      malicious_attachment_detection: false,
      ocr_enabled: false,
      nsfw_image_detection: false,
      violence_detection: false,
      assigned_vision_model: "",
      confidence_threshold: 85,
      action: "delete"
    },
    attachment_scanner: {
      guild_id: guildId,
      enabled: false,
      scan_images: false,
      scan_pdf: false,
      scan_doc: false,
      scan_zip: false,
      scan_executables: false,
      scan_scripts: false,
      action: "quarantine",
      model_id: ""
    },
    dm_warning: {
      guild_id: guildId,
      enabled: true,
      warning_template: "Hello {user}, your recent message in **{server}** was automatically flagged by our AI Moderation System for reason: **{reason}**. Please follow the server guidelines.",
      languages: ["English", "Spanish", "French", "German"],
      cooldown_seconds: 60,
      appeal_button_enabled: true,
      notify_moderators: true,
      log_channel_id: "102938475610293899"
    },
    translation: {
      guild_id: guildId,
      enabled: true,
      assigned_model_id: "m3",
      target_languages: ["English", "Spanish", "French", "German", "Japanese"],
      translate_messages: true,
      translate_embeds: true,
      translate_tickets: true,
      translate_announcements: false
    },
    ticket_form_assistant: {
      guild_id: guildId,
      ticket_summarization: true,
      suggest_mod_replies: true,
      faq_auto_response: true,
      ticket_sentiment_analysis: true,
      urgent_escalation: true,
      form_validation: true,
      form_application_scoring: true,
      form_spam_detection: true,
      assigned_model_id: "m2"
    },
    automations: [
      {
        id: "auto1",
        name: "Auto Scam Shield & Mod Notification",
        description: "If message is classified as scam/phishing, delete message, send user DM warning, and alert moderators.",
        enabled: true,
        nodes: [
          { id: "n1", type: "trigger", label: "On Message Received", config: { channel_scope: "all" } },
          { id: "n2", type: "ai_classifier", label: "Scam Detection Model", config: { model_id: "m2", threshold: 0.9 } },
          { id: "n3", type: "action", label: "Delete Message & Notify Mods", config: { action_type: "delete_and_alert" } }
        ]
      }
    ],
    prompts: [
      { id: "pr1", title: "General Support Prompt", version: "v1.2", tags: ["Support", "FAQ"], content: "Provide clear answers to user inquiries using server documentation. Be concise.", assigned_feature: "knowledge_assistant" },
      { id: "pr2", title: "Moderation Context Evaluator", version: "v2.0", tags: ["Moderation", "Safety"], content: "Evaluate context for sarcastic intent vs explicit hostility. Output JSON classification.", assigned_feature: "moderation_ai" }
    ],
    failover: {
      guild_id: guildId,
      enabled: true,
      provider_priority: ["p1", "p2", "p3", "p4"],
      max_retries: 3,
      load_balancing_mode: "priority",
      budget_cap_daily: 15.00,
      budget_cap_monthly: 100.00,
      auto_fallback_on_budget_exceeded: true
    }
  };
}

