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

export interface BotInfo {
  name: string;
  id: number | null;
  guilds: number;
  users: number;
  commands: number;
  latency: string;
}

export interface BotStatus {
  user: string;
  id: number | null;
  latency: number;
  guild_count: number;
  user_count: number;
  shards: number | null;
}

export interface GuildSummary {
  id: number;
  name: string;
  icon_url: string | null;
  owner_id: number;
  member_count: number;
}

export interface GuildDetails {
  id: number;
  name: string;
  icon: string | null;
  owner_id: number;
  member_count: number;
  role_count: number;
  channel_count: number;
}

export interface PrefixConfig {
  guild_id: number;
  prefix: string;
}

export interface AutomodConfig {
  guild_id: number;
  enabled: boolean;
  punishments: Record<string, string>;
  ignored_roles: number[];
  ignored_channels: number[];
  logging_channel: number | null;
}

export interface TicketCategory {
  name: string;
  emoji: string | null;
  staff_roles: number[];
  button_style?: number;
  discord_category_id?: string | null;
}

export interface TicketEmbed {
  title: string | null;
  description: string | null;
  color?: number | null;
  image_url?: string | null;
  thumbnail_url?: string | null;
}

export interface TicketConfig {
  guild_id: string;
  panel_channel: string | null;
  panel_message: string | null;
  logging_channel?: string | null;
  closed_category?: string | null;
  panel_type?: string;
  embed: TicketEmbed;
  categories: TicketCategory[];
  staff_roles: number[];
  open_ticket_count: number;
}

export interface LevelingEmbedStyle {
  color: string;
  thumbnail: boolean;
  image: string | null;
}

export interface LevelingConfig {
  guild_id: number;
  enabled: boolean;
  xp_per_message: number;
  cooldown: number;
  level_up_channel: number | null;
  embed_style: LevelingEmbedStyle;
}

export interface LoggingConfig {
  guild_id: number;
  log_enabled: Record<string, boolean>;
  log_channels: Record<string, number>;
  ignore_channels: number[];
  ignore_roles: number[];
  ignore_users: number[];
  auto_delete_duration: number | null;
}

// Update Request Types
export interface PrefixUpdate {
  prefix: string;
}

export interface AutomodUpdate {
  enabled?: boolean;
  punishments?: Record<string, string>;
  ignored_roles?: number[];
  ignored_channels?: number[];
  logging_channel?: number;
}

export interface LevelingUpdate {
  enabled?: boolean;
  xp_per_message?: number;
  cooldown?: number;
  level_up_channel?: number;
  embed_color?: string;
}

export interface LoggingUpdate {
  log_enabled?: Record<string, boolean>;
  log_channels?: Record<string, number>;
}

export interface LeaderboardEntry {
  user_id: number;
  name: string;
  level: number;
  xp: number;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: string;
}

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position: number;
}

export interface TicketUpdate {
  panel_channel?: string | null;
  logging_channel?: string | null;
  closed_category?: string | null;
  panel_type?: string;
  embed_title?: string | null;
  embed_description?: string | null;
  embed_color?: number | null;
  embed_image_url?: string | null;
  embed_thumbnail_url?: string | null;
  categories?: TicketCategory[];
}

export interface WelcomeEmbedData {
  message?: string | null;
  title?: string | null;
  description?: string | null;
  color?: string | null;
  footer_text?: string | null;
  footer_icon?: string | null;
  author_name?: string | null;
  author_icon?: string | null;
  thumbnail?: string | null;
  image?: string | null;
}

export interface WelcomeConfig {
  guild_id: number;
  welcome_type?: string | null;
  welcome_message?: string | null;
  channel_id?: string | null;
  embed_data?: WelcomeEmbedData | null;
  auto_delete_duration?: number | null;
}

export interface WelcomeUpdate {
  welcome_type?: string | null;
  welcome_message?: string | null;
  channel_id?: number | null;
  embed_data?: WelcomeEmbedData | null;
  auto_delete_duration?: number | null;
}

export interface AntiNukeConfig {
  guild_id: number;
  status: boolean;
  whitelisted_users?: string[];
}

export interface AntiNukeUpdate {
  status?: boolean;
  add_whitelist?: string;
  remove_whitelist?: string;
}

export interface VerificationConfig {
  guild_id: number;
  verification_channel_id: string | null;
  verified_role_id: string | null;
  log_channel_id: string | null;
  verification_method: string;
  enabled: boolean;
}

export interface VerificationUpdate {
  verification_channel_id?: string | null;
  verified_role_id?: string | null;
  log_channel_id?: string | null;
  verification_method?: string | null;
  enabled?: boolean | null;
}

export interface VanityRoleSetup {
  vanity: string;
  role_id: string;
  log_channel_id: string;
}

export interface AutoRoleConfig {
  guild_id: string;
  bots: string[];
  humans: string[];
}

export interface AutoRoleUpdate {
  bots?: string[];
  humans?: string[];
}

export interface AdminNodeStatus {
  name: string;
  status: string;
  load: string;
  icon: string;
}

export interface AdminStats {
  total_users: string;
  active_servers: string;
  api_latency: string;
  db_size: string;
  nodes: AdminNodeStatus[];
}

export interface AdminConfig {
  maintenance_mode: boolean;
  global_notification: string | null;
}

export interface AdminConfigUpdate {
  maintenance_mode?: boolean;
  global_notification?: string | null;
}

export interface StarboardConfig {
  guild_id: number;
  channel_id?: string | null;
  star_emoji?: string;
  required_stars?: number;
}

export interface StarboardUpdate {
  channel_id?: string | null;
  star_emoji?: string;
  required_stars?: number;
}

export interface CustomCommand {
  name: string;
  response: string;
}

export interface CustomCommandConfig {
  guild_id: number;
  commands: CustomCommand[];
}

// ╔══════════════════════════════════════════════════════════════════╗
// ║              ENTERPRISE AI MANAGEMENT SYSTEM TYPES               ║
// ╚══════════════════════════════════════════════════════════════════╝

export interface AIProviderProfile {
  id: string;
  name: string;
  provider_type: string; // built-in key or 'custom'
  icon: string;
  api_key: string;
  endpoint: string;
  default_model: string;
  api_version?: string;
  organization_id?: string;
  headers?: Record<string, string>;
  query_params?: Record<string, string>;
  timeout_seconds: number;
  retry_policy: {
    max_retries: number;
    backoff_factor: number;
  };
  streaming_supported: boolean;
  rate_limit: {
    rpm: number; // requests per minute
    tpm: number; // tokens per minute
  };
  enabled: boolean;
  is_custom: boolean;
  status: "online" | "degraded" | "offline" | "untested";
  last_latency_ms?: number;
}

export interface AIModelDefinition {
  id: string;
  model_name: string;
  provider_id: string;
  description: string;
  context_window: number;
  max_output_tokens: number;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  supports_vision: boolean;
  supports_image_gen: boolean;
  supports_audio: boolean;
  supports_streaming: boolean;
  input_cost_per_1m: number;
  output_cost_per_1m: number;
  speed_rating: "ultra_fast" | "fast" | "balanced" | "high_precision";
  recommended_use_cases: string[];
}

export interface AIFeatureAssignment {
  feature_key: string;
  feature_name: string;
  description: string;
  category: "chat" | "moderation" | "vision" | "utility" | "support";
  assigned_model_id: string;
  fallback_model_id: string;
  enabled: boolean;
  custom_system_prompt?: string;
}

export interface AIChatChannelConfig {
  id: string;
  channel_id: string;
  channel_name: string;
  provider_id?: string;
  model_id?: string;
  mode?: "reply_all" | "mention_only";
  system_prompt?: string;
  temperature?: number;
  enabled: boolean;
  cooldown_seconds?: number;
  rate_limit_rpm?: number;
  memory_mode?: "disabled" | "temporary" | "persistent" | "per_user" | "per_channel" | "per_server";
  max_memory_messages?: number;
  max_response_length?: number;
  streaming_enabled?: boolean;
  typing_indicator?: boolean;
  reply_behavior?: "reply_to_message" | "send_to_channel";
  mention_required?: boolean;
  prefix_trigger?: string;
  persona_id?: string;
}

export interface AIPersonaConfig {
  id: string;
  name: string;
  preset_type: "friendly" | "developer" | "support" | "moderator" | "gaming" | "anime" | "tutor" | "custom";
  description: string;
  system_prompt: string;
  custom_instructions: string[];
  rules: string[];
  response_style: "concise" | "detailed" | "playful" | "formal" | "technical";
  language_preference: string;
  emoji_usage: "none" | "subtle" | "expressive";
  markdown_enabled: boolean;
  code_formatting_rules: string;
}

export interface AIMemoryConfig {
  guild_id: string;
  global_mode: "disabled" | "temporary" | "persistent" | "per_user" | "per_channel" | "per_server";
  max_messages_per_conversation: number;
  token_limit_window: number;
  expiration_hours: number;
  auto_cleanup: boolean;
}

export interface AIModerationDetector {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  sensitivity: number; // 0 to 100
  assigned_model_id: string;
  action: "delete" | "warn" | "timeout" | "kick" | "ban" | "dm_warn" | "log_only";
  cooldown_seconds: number;
}

export interface AIVisionConfig {
  guild_id: string;
  scam_image_detection: boolean;
  qr_scam_detection: boolean;
  fake_nitro_detection: boolean;
  malicious_attachment_detection: boolean;
  ocr_enabled: boolean;
  nsfw_image_detection: boolean;
  violence_detection: boolean;
  assigned_vision_model: string;
  confidence_threshold: number;
  action: "delete" | "warn" | "timeout" | "kick" | "ban" | "log";
}

export interface AIAttachmentScanner {
  guild_id: string;
  enabled: boolean;
  scan_images: boolean;
  scan_pdf: boolean;
  scan_doc: boolean;
  scan_zip: boolean;
  scan_executables: boolean;
  scan_scripts: boolean;
  action: "delete" | "quarantine" | "warn" | "log";
  model_id: string;
}

export interface AIDmWarningWorkflow {
  guild_id: string;
  enabled: boolean;
  warning_template: string;
  languages: string[];
  cooldown_seconds: number;
  appeal_button_enabled: boolean;
  notify_moderators: boolean;
  log_channel_id: string;
}

export interface AITranslationConfig {
  guild_id: string;
  enabled: boolean;
  assigned_model_id: string;
  target_languages: string[];
  translate_messages: boolean;
  translate_embeds: boolean;
  translate_tickets: boolean;
  translate_announcements: boolean;
}

export interface AITicketFormConfig {
  guild_id: string;
  ticket_summarization: boolean;
  suggest_mod_replies: boolean;
  faq_auto_response: boolean;
  ticket_sentiment_analysis: boolean;
  urgent_escalation: boolean;
  form_validation: boolean;
  form_application_scoring: boolean;
  form_spam_detection: boolean;
  assigned_model_id: string;
}

export interface AIAutomationNode {
  id: string;
  type: "trigger" | "ai_classifier" | "action";
  label: string;
  config: Record<string, any>;
}

export interface AIAutomationWorkflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  nodes: AIAutomationNode[];
}

export interface AIPromptItem {
  id: string;
  title: string;
  version: string;
  tags: string[];
  content: string;
  assigned_feature: string;
}

export interface AIFailoverConfig {
  guild_id: string;
  enabled: boolean;
  provider_priority: string[]; // array of provider IDs
  max_retries: number;
  load_balancing_mode: "priority" | "round_robin" | "lowest_latency";
  budget_cap_daily: number;
  budget_cap_monthly: number;
  auto_fallback_on_budget_exceeded: boolean;
}

export interface AIAuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export interface AITestResult {
  status: "success" | "error";
  latency_ms: number;
  input_tokens: number;
  output_tokens: number;
  estimated_cost: number;
  response_text: string;
  debug_logs: string[];
}

export interface AIDmWarningWorkflow {
  enabled: boolean;
  format: "embed" | "normal";
  warning_template: string;
  color: string;
  notify_moderators: boolean;
  per_feature: {
    [key: string]: {
      enabled: boolean;
      template: string;
      format: "embed" | "normal";
      title: string;
      color: string;
    }
  };
  strikes: {
    enabled: boolean;
    max_strikes: number;
    action: "mute" | "kick" | "ban";
    action_duration_minutes: number;
  };
  appeal: {
    enabled: boolean;
    channel_id: string | null;
    category_id: string | null;
    cooldown_hours: number;
  };
}

export interface EnterpriseAIConfig {
  guild_id: string;
  ai_enabled?: boolean;
  providers: AIProviderProfile[];
  models: AIModelDefinition[];
  feature_assignments: AIFeatureAssignment[];
  chat_channels: AIChatChannelConfig[];
  personas: AIPersonaConfig[];
  memory: AIMemoryConfig;
  moderation_detectors: AIModerationDetector[];
  vision: AIVisionConfig;
  attachment_scanner: AIAttachmentScanner;
  dm_warning: AIDmWarningWorkflow;
  translation: AITranslationConfig;
  ticket_form_assistant: AITicketFormConfig;
  automations: AIAutomationWorkflow[];
  prompts: AIPromptItem[];
  failover: AIFailoverConfig;
  stats: {
    total_requests: number;
    active_providers: number;
    active_models: number;
    monthly_token_usage: number;
    monthly_cost_usd: number;
    average_latency_ms: number;
    success_rate_pct: number;
  };
}

