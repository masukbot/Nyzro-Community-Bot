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

export interface DocCommand {
  name: string;
  description: string;
  usage: string;
  permission: string;
  aliases: string[];
  requiredRoles?: string[];
  example: string;
}

export interface DocApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  summary: string;
  headers: Record<string, string>;
  params?: { name: string; type: string; required: boolean; description: string }[];
  body?: string;
  response: string;
}

export interface DocArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  subcategory?: string;
  description: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced" | "Developer";
  readTime: string;
  author: string;
  updatedAt: string;
  version: string;
  tags: string[];
  contentBlocks: {
    type: "text" | "heading" | "alert" | "code" | "command" | "steps" | "api" | "preview" | "troubleshoot";
    title?: string;
    level?: number;
    text?: string;
    variant?: "info" | "warning" | "danger" | "success" | "note";
    code?: string;
    language?: string;
    filename?: string;
    command?: DocCommand;
    apiEndpoint?: DocApiEndpoint;
    steps?: { step: number; title: string; desc: string; code?: string }[];
  }[];
  isPublished?: boolean;
}

export interface DocCategory {
  id: string;
  name: string;
  icon: string;
  items: { id: string; title: string; slug: string; difficulty?: string }[];
}

export const INITIAL_CATEGORIES: DocCategory[] = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: "Zap",
    items: [
      { id: "intro", title: "Introduction & Neural Architecture", slug: "intro", difficulty: "Beginner" },
      { id: "quickstart", title: "30-Second Quick Start Guide", slug: "quickstart", difficulty: "Beginner" },
      { id: "invite-bot", title: "Inviting Bot & Required Permissions", slug: "invite-bot", difficulty: "Beginner" },
      { id: "dashboard-setup", title: "Dashboard & OAuth Setup", slug: "dashboard-setup", difficulty: "Intermediate" }
    ]
  },
  {
    id: "moderation-security",
    name: "Moderation & Security",
    icon: "ShieldCheck",
    items: [
      { id: "automod", title: "Sub-Second AutoMod Engine", slug: "automod", difficulty: "Intermediate" },
      { id: "anti-nuke", title: "Anti-Nuke & Lockdown Suite", slug: "anti-nuke", difficulty: "Advanced" },
      { id: "verification", title: "Captcha & Neural Verification", slug: "verification", difficulty: "Intermediate" },
      { id: "welcome-dm", title: "Welcome & Join DM Modules", slug: "welcome-dm", difficulty: "Beginner" },
      { id: "reaction-roles", title: "Auto Role & Reaction Roles", slug: "reaction-roles", difficulty: "Beginner" },
      { id: "tickets", title: "Smart Helpdesk & Ticket System", slug: "tickets", difficulty: "Intermediate" },
      { id: "logging", title: "Audit Trail & Cryptographic Logging", slug: "logging", difficulty: "Advanced" }
    ]
  },
  {
    id: "ai-features",
    name: "AI & Multi-Provider Suite",
    icon: "Cpu",
    items: [
      { id: "ai-overview", title: "Multi-Model AI Architecture", slug: "ai-overview", difficulty: "Intermediate" },
      { id: "ai-channels", title: "AI Chat Channels & Context", slug: "ai-channels", difficulty: "Intermediate" },
      { id: "ai-moderation", title: "Vision & OCR Attachment Scanner", slug: "ai-moderation", difficulty: "Advanced" },
      { id: "ai-providers", title: "Custom API Keys & Ollama Fallback", slug: "ai-providers", difficulty: "Advanced" }
    ]
  },
  {
    id: "developer-api",
    name: "Developer API & SDK",
    icon: "Terminal",
    items: [
      { id: "api-overview", title: "REST API & Auth Overview", slug: "api-overview", difficulty: "Developer" },
      { id: "webhooks", title: "Realtime Event Webhooks", slug: "webhooks", difficulty: "Developer" },
      { id: "sdk-guide", title: "Node.js & Python SDK Setup", slug: "sdk-guide", difficulty: "Developer" }
    ]
  },
  {
    id: "resources",
    name: "Resources & Support",
    icon: "HelpCircle",
    items: [
      { id: "troubleshooting", title: "Interactive Troubleshooting Wizard", slug: "troubleshooting", difficulty: "Beginner" },
      { id: "changelog", title: "Platform Release Notes & Changelog", slug: "changelog", difficulty: "Beginner" },
      { id: "faq", title: "Frequently Asked Questions", slug: "faq", difficulty: "Beginner" }
    ]
  }
];

export const INITIAL_ARTICLES: Record<string, DocArticle> = {
  intro: {
    id: "intro",
    slug: "intro",
    title: "Introduction & Neural Architecture",
    category: "Getting Started",
    description: "Learn how Nyzro protects Discord communities using edge microservices, real-time telemetry, and multi-provider AI.",
    difficulty: "Beginner",
    readTime: "4 min read",
    author: "CodeX Dev Team",
    updatedAt: "July 2026",
    version: "2.4.0",
    tags: ["Overview", "Architecture", "Neural Core", "Latency"],
    contentBlocks: [
      {
        type: "text",
        text: "Nyzro is an enterprise-grade AI security and moderation engine built specifically for high-velocity Discord servers with thousands to millions of members. Operating with ~14.2ms edge dispatch latency, it analyzes every message, attachment, member join event, and administrative command in real time."
      },
      {
        type: "alert",
        variant: "info",
        title: "Enterprise Edge Network",
        text: "All moderation events pass through encrypted edge shards across AWS and Azure, guaranteeing sub-second response times even during massive 5,000+ token bot raids."
      },
      {
        type: "heading",
        level: 2,
        title: "Key Platform Capabilities"
      },
      {
        type: "text",
        text: "• Multi-Provider AI Routing: Switch dynamically between Gemini 2.5 Flash, Claude 3.5 Sonnet, GPT-4o, Groq, and self-hosted Ollama.\n• Sub-Second Anti-Nuke: Automatically revokes rogue admin permissions and restores deleted channels in <0.2 seconds.\n• OCR Vision Scanner: Detects malicious QR code phishing attachments in uploaded images."
      },
      {
        type: "code",
        language: "json",
        filename: "nyzro-config.json",
        code: `{\n  "shard_id": "neural_shard_07",\n  "latency_target_ms": 14.2,\n  "ai_router": {\n    "primary": "gemini-2.5-flash",\n    "fallback": "ollama-local",\n    "auto_cost_optimize": true\n  },\n  "anti_nuke": {\n    "enabled": true,\n    "snapshot_interval_seconds": 60\n  }\n}`
      }
    ]
  },
  quickstart: {
    id: "quickstart",
    slug: "quickstart",
    title: "30-Second Quick Start Guide",
    category: "Getting Started",
    description: "Follow these 5 simple steps to deploy Nyzro in your server in under 30 seconds.",
    difficulty: "Beginner",
    readTime: "2 min read",
    author: "CodeX Dev Team",
    updatedAt: "July 2026",
    version: "2.4.0",
    tags: ["Quickstart", "Installation", "Dashboard"],
    contentBlocks: [
      {
        type: "text",
        text: "Deploying Nyzro to your Discord guild is completely seamless and requires zero code installation."
      },
      {
        type: "steps",
        steps: [
          { step: 1, title: "Invite the Bot", desc: "Open the 'Your Servers' tab in the dashboard and click 'Add to Server' or authorize permissions." },
          { step: 2, title: "Grant Administrator Role", desc: "Ensure Nyzro's bot role is placed at the top of your server role hierarchy." },
          { step: 3, title: "Select Guild in Dashboard", desc: "Navigate to dashboard.nyzro.ai/guilds and select your server." },
          { step: 4, title: "Enable Anti-Raid & AI Modules", desc: "Toggle on Anti-Raid, AutoMod, and AI Classifier under server settings." },
          { step: 5, title: "Verify Shard Connectivity", desc: "Type `/ping` in your server to confirm sub-15ms telemetry response." }
        ]
      },
      {
        type: "command",
        command: {
          name: "/ping",
          description: "Check Nyzro shard response latency and AI router status",
          usage: "/ping",
          permission: "Everyone",
          aliases: ["!ping"],
          example: "/ping"
        }
      }
    ]
  },
  "anti-nuke": {
    id: "anti-nuke",
    slug: "anti-nuke",
    title: "Anti-Nuke & Lockdown Suite",
    category: "Moderation & Security",
    description: "Full protection against rogue administrators, compromised accounts, mass bans, and channel deletion.",
    difficulty: "Advanced",
    readTime: "6 min read",
    author: "Security Team",
    updatedAt: "July 2026",
    version: "2.4.0",
    tags: ["Anti-Nuke", "Lockdown", "Security", "Recovery"],
    contentBlocks: [
      {
        type: "text",
        text: "The Anti-Nuke module continuously monitors administrative audit logs. If an admin account starts deleting channels, kicking members, or stripping roles at an unnatural rate, Nyzro immediately revokes their administrative permissions, quarantines the account, and triggers auto-recovery."
      },
      {
        type: "alert",
        variant: "danger",
        title: "Hierarchical Role Requirement",
        text: "Nyzro's highest bot role MUST be above all moderator and admin roles in Server Settings -> Roles for Anti-Nuke revocation to take effect."
      },
      {
        type: "command",
        command: {
          name: "/antinuke config",
          description: "Configure Anti-Nuke action limits and lockdown triggers",
          usage: "/antinuke config [channel_delete_limit:5] [kick_limit:3] [auto_lockdown:True]",
          permission: "Guild Owner Only",
          aliases: ["/an config"],
          requiredRoles: ["Guild Owner"],
          example: "/antinuke config channel_delete_limit:3 auto_lockdown:True"
        }
      },
      {
        type: "code",
        language: "python",
        filename: "anti_nuke_engine.py",
        code: `# Sub-second anti-nuke telemetry trigger\nasync def on_audit_log_entry(entry):\n    if entry.action == AuditLogAction.channel_delete:\n        counter = await check_rate_limit(entry.user_id, window=5)\n        if counter > THRESHOLD:\n            await revoke_all_roles(entry.user_id)\n            await restore_deleted_channel(entry.target)\n            await notify_owner(entry.user_id, action="Channel Delete Nuke Attempt")`
      }
    ]
  },
  "ai-overview": {
    id: "ai-overview",
    slug: "ai-overview",
    title: "Multi-Model AI Architecture",
    category: "AI & Multi-Provider Suite",
    description: "Configure and assign 16+ LLM models across moderation, custom chat, ticket summarization, and vision OCR.",
    difficulty: "Intermediate",
    readTime: "5 min read",
    author: "AI Research Shards",
    updatedAt: "July 2026",
    version: "2.4.0",
    tags: ["AI", "Gemini", "Claude", "GPT-4o", "Ollama", "Groq"],
    contentBlocks: [
      {
        type: "text",
        text: "Nyzro features an enterprise multi-provider AI pipeline. Guild administrators can assign specific models to specific tasks—such as using Groq for zero-latency moderation, Gemini 2.5 Flash for high-throughput chat, and Claude 3.5 Sonnet for deep support tickets."
      },
      {
        type: "alert",
        variant: "success",
        title: "Zero API Cost Fallback",
        text: "You can connect self-hosted Ollama models (e.g. Llama 3) as a backup provider so your server never runs out of AI quotas."
      },
      {
        type: "command",
        command: {
          name: "/ai set-provider",
          description: "Assign an AI provider and model to a specific server feature",
          usage: "/ai set-provider [feature:moderation] [provider:gemini] [model:gemini-2.5-flash]",
          permission: "Administrator",
          aliases: ["/ai provider"],
          requiredRoles: ["Admin"],
          example: "/ai set-provider feature:moderation provider:groq model:llama3-8b-8192"
        }
      }
    ]
  },
  "api-overview": {
    id: "api-overview",
    slug: "api-overview",
    title: "REST API & Auth Overview",
    category: "Developer API & SDK",
    description: "Programmatically control Nyzro modules, query telemetry logs, and dispatch AI commands over HTTP.",
    difficulty: "Developer",
    readTime: "7 min read",
    author: "API Team",
    updatedAt: "July 2026",
    version: "v1.4",
    tags: ["API", "REST", "Authentication", "JSON"],
    contentBlocks: [
      {
        type: "text",
        text: "The Nyzro REST API allows developers to inspect guild telemetry, manage AI key profiles, stream audit logs, and trigger remote bot commands via bearer token authentication."
      },
      {
        type: "api",
        apiEndpoint: {
          method: "GET",
          path: "/api/v1/bot/info",
          summary: "Retrieve global bot status and active shard telemetry",
          headers: {
            "Authorization": "Bearer nyzro_sec_live_9942a188f"
          },
          response: `{\n  "status": "online",\n  "shards": 12,\n  "latency_ms": 14.2,\n  "active_guilds": 58412,\n  "uptime_seconds": 1849200\n}`
        }
      },
      {
        type: "api",
        apiEndpoint: {
          method: "POST",
          path: "/api/v1/guild/{guild_id}/automod/scan",
          summary: "Submit text for real-time AI toxicity and spam evaluation",
          headers: {
            "Authorization": "Bearer nyzro_sec_live_9942a188f",
            "Content-Type": "application/json"
          },
          body: `{\n  "message_content": "Free Discord Nitro link at http://fake-nitro-scam.xyz",\n  "author_id": "992140285112"\n}`,
          response: `{\n  "is_flagged": true,\n  "category": "phishing_scam",\n  "confidence": 0.998,\n  "recommended_action": "delete_and_mute"\n}`
        }
      }
    ]
  },
  troubleshooting: {
    id: "troubleshooting",
    slug: "troubleshooting",
    title: "Interactive Troubleshooting Wizard",
    category: "Resources & Support",
    description: "Diagnose common setup issues, missing permissions, API timeouts, and shard latency.",
    difficulty: "Beginner",
    readTime: "3 min read",
    author: "Support Desk",
    updatedAt: "July 2026",
    version: "2.4.0",
    tags: ["Troubleshooting", "Fix", "Diagnostics", "Support"],
    contentBlocks: [
      {
        type: "troubleshoot"
      }
    ]
  },
  changelog: {
    id: "changelog",
    slug: "changelog",
    title: "Platform Release Notes & Changelog",
    category: "Resources & Support",
    description: "Track all recent feature additions, performance upgrades, and bug fixes across Nyzro Shards.",
    difficulty: "Beginner",
    readTime: "3 min read",
    author: "Release Shard",
    updatedAt: "July 2026",
    version: "2.4.0",
    tags: ["Changelog", "Updates", "Releases"],
    contentBlocks: [
      {
        type: "text",
        text: "Below is the full historical timeline of Nyzro platform updates and major neural core improvements."
      },
      {
        type: "heading",
        level: 3,
        title: "Version 2.4.0 — Enterprise Multi-Provider AI Architecture (Current)"
      },
      {
        type: "text",
        text: "• Added support for 16 LLM providers (Gemini 2.5, Claude 3.5, GPT-4o, Groq, Ollama, DeepSeek).\n• Added OCR Vision scanner for image attachment phishing verification.\n• Added sub-second auto-nuke channel state snapshots.\n• Redesigned Next.js documentation portal with instant Cmd+K search and AI docs assistant."
      },
      {
        type: "heading",
        level: 3,
        title: "Version 2.3.5 — High-Throughput Edge Sharding"
      },
      {
        type: "text",
        text: "• Reduced API dispatch latency from 45ms to 14.2ms.\n• Added interactive tickets sentiment escalation.\n• Added automatic role hierarchy diagnostic tool."
      }
    ]
  },
  faq: {
    id: "faq",
    slug: "faq",
    title: "Frequently Asked Questions",
    category: "Resources & Support",
    description: "Answers to common questions about permissions, AI key billing, bot invite, and data privacy.",
    difficulty: "Beginner",
    readTime: "4 min read",
    author: "Support Desk",
    updatedAt: "July 2026",
    version: "2.4.0",
    tags: ["FAQ", "Questions", "Help"],
    contentBlocks: [
      {
        type: "heading",
        level: 3,
        title: "Does Nyzro require Administrator permission?"
      },
      {
        type: "text",
        text: "While Administrator permission allows Nyzro to auto-configure anti-nuke and automod rules, you can also assign specific permissions (Manage Roles, Manage Channels, Kick/Ban, Read Message History)."
      },
      {
        type: "heading",
        level: 3,
        title: "Are my server messages stored or trained on by AI models?"
      },
      {
        type: "text",
        text: "No. Nyzro processes text strictly in-memory over zero-retention API endpoints. Data is never used for LLM training."
      }
    ]
  }
};

// AI Knowledge Base Q&A entries
export const AI_DOC_QA = [
  {
    keywords: ["ticket", "setup ticket", "helpdesk"],
    question: "How do I setup the AI Ticket system?",
    answer: "To set up AI Tickets:\n1. Open Dashboard -> Navigate to your server -> Click **Tickets**.\n2. Enable the Ticket Module and select your Ticket Category channel.\n3. Turn on **AI Summarizer** to get instant ticket sentiment reports when users open tickets.\n4. Save changes and run `/ticket panel` in Discord."
  },
  {
    keywords: ["anti nuke", "antinuke", "lockdown", "raid"],
    question: "How do I configure Anti-Nuke protection?",
    answer: "To configure Anti-Nuke:\n1. Ensure Nyzro's bot role is at the TOP of your server role hierarchy in Discord.\n2. Go to Dashboard -> **Anti-Nuke** tab.\n3. Set max channel delete limit (e.g., 3 in 10s) and kick limit.\n4. Enable **Auto-Lockdown** and **Channel Auto-Recovery**."
  },
  {
    keywords: ["ai channel", "ai model", "gemini", "claude", "gpt"],
    question: "How do I assign AI models or setup AI chat channels?",
    answer: "To assign AI models:\n1. Go to Dashboard -> **AI Suite** -> **AI Channels**.\n2. Select a text channel (e.g. `#ai-chat`).\n3. Choose your preferred AI Provider (Gemini 2.5 Flash, Claude 3.5, GPT-4o, or Groq).\n4. Enter custom system instructions if desired and click Save."
  },
  {
    keywords: ["verify", "verification", "captcha"],
    question: "How do I enable Captcha / Neural Verification?",
    answer: "To enable Verification:\n1. Go to Dashboard -> **Verification**.\n2. Choose verification type: Button Click, Web Captcha, or AI Neural Quiz.\n3. Select the Verified Role to award upon completion.\n4. Send the verification panel to your `#verify` channel using `/verify panel`."
  }
];
