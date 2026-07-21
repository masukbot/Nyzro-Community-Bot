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

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  Bot,
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Terminal,
  HelpCircle,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Clock,
  User,
  Calendar,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Copy,
  Check,
  Edit3,
  Globe,
  ExternalLink,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
  Flame,
  Star,
  Activity,
  Layers
} from "lucide-react";

import { INITIAL_CATEGORIES, INITIAL_ARTICLES, DocArticle } from "@/lib/docs-data";
import { GlobalSearchModal } from "@/components/docs/global-search-modal";
import { AiSearchModal } from "@/components/docs/ai-search-modal";
import { CommandBlock } from "@/components/docs/command-block";
import { ApiExplorer } from "@/components/docs/api-explorer";
import { TroubleshootWizard } from "@/components/docs/troubleshoot-wizard";
import { CmsEditorModal } from "@/components/docs/cms-editor-modal";

export default function DocumentationPlatformPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [articles, setArticles] = useState<Record<string, DocArticle>>(INITIAL_ARTICLES);
  const [activeSlug, setActiveSlug] = useState<string>("intro");
  
  // Sidebar expand states
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "getting-started": true,
    "moderation-security": true,
    "ai-features": true,
    "developer-api": true,
    "resources": true
  });

  // Favorites & Bookmarks State
  const [favorites, setFavorites] = useState<string[]>(["intro", "anti-nuke"]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(["quickstart", "ai-overview"]);
  const [likesCount, setLikesCount] = useState<number>(42);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // General state
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("v2.4.0 (Latest)");

  const currentArticle = articles[activeSlug] || articles["intro"];

  // Category Icon Renderer
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap": return <Zap className="h-4 w-4 text-red-500" />;
      case "ShieldCheck": return <ShieldCheck className="h-4 w-4 text-red-500" />;
      case "Cpu": return <Cpu className="h-4 w-4 text-red-500" />;
      case "Terminal": return <Terminal className="h-4 w-4 text-red-500" />;
      default: return <HelpCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const handleSelectArticle = (slug: string) => {
    setActiveSlug(slug);
    if (!recentlyViewed.includes(slug)) {
      setRecentlyViewed(prev => [slug, ...prev.slice(0, 3)]);
    }
    setMobileSidebarOpen(false);
  };

  const toggleFavorite = (slug: string) => {
    setFavorites(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleUpdateArticle = (updated: DocArticle) => {
    setArticles(prev => ({ ...prev, [updated.slug]: updated }));
  };

  // Find previous and next articles
  const allSlugs = categories.flatMap(c => c.items.map(i => i.slug));
  const currentIndex = allSlugs.indexOf(activeSlug);
  const prevSlug = currentIndex > 0 ? allSlugs[currentIndex - 1] : null;
  const nextSlug = currentIndex < allSlugs.length - 1 ? allSlugs[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#05060a] text-slate-300 font-sans selection:bg-red-500/30 selection:text-white">
      {/* Search Modals */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={handleSelectArticle}
      />
      <AiSearchModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />
      <CmsEditorModal
        isOpen={isCmsOpen}
        onClose={() => setIsCmsOpen(false)}
        article={currentArticle}
        onSaveArticle={handleUpdateArticle}
      />

      {/* TOP STICKY NAVBAR */}
      <nav className="sticky top-0 z-40 h-16 bg-[#0b0e18]/80 backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black text-white font-display tracking-tight flex items-center gap-2">
                NYZRO <span className="text-red-500 font-mono text-xs">DOCS</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden sm:inline-block">Neural Shard Documentation</span>
            </div>
          </Link>

          {/* Cmd+K Search Bar Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center gap-3 bg-white/[0.03] border border-white/10 hover:border-red-500/30 rounded-xl px-4 py-2 text-xs text-slate-400 hover:text-slate-200 transition-all w-72"
          >
            <Search className="h-3.5 w-3.5 text-red-500" />
            <span className="flex-1 text-left">Search docs, API, commands...</span>
            <kbd className="font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300">Ctrl K</kbd>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* AI Search Floating Button */}
          <button
            onClick={() => setIsAiOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-500/20 to-red-700/20 border border-red-500/40 text-red-400 hover:text-white font-mono text-xs font-bold shadow-lg shadow-red-500/10 transition-all hover:scale-105"
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="hidden sm:inline">Ask AI Assistant</span>
          </button>

          {/* Version Selector */}
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="hidden lg:block bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none"
          >
            <option value="v2.4.0 (Latest)">v2.4.0 (Latest)</option>
            <option value="v2.3.5">v2.3.5</option>
            <option value="v2.0.0">v2.0.0</option>
          </select>

          {/* Admin CMS Trigger Button */}
          <button
            onClick={() => setIsCmsOpen(true)}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-mono font-semibold transition-colors"
            title="Edit Document via CMS"
          >
            <Edit3 className="h-3.5 w-3.5 text-red-500" />
            <span>CMS Editor</span>
          </button>

          <a href="https://discord.gg/codexdev" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white p-2 hidden sm:block">
            <ExternalLink className="h-4 w-4" />
          </a>

          <button
            onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
            className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-500/20 transition-all"
          >
            Console Login
          </button>

          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* 3-COLUMN MAIN LAYOUT */}
      <div className="max-w-[1536px] mx-auto flex min-h-[calc(100vh-64px)]">
        
        {/* LEFT SIDEBAR COLUMN */}
        <aside className={`
          fixed lg:sticky top-16 z-30 w-80 h-[calc(100vh-64px)] bg-[#080b13] border-r border-white/10 overflow-y-auto p-5 no-scrollbar transition-transform lg:translate-x-0
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="space-y-6">
            {/* Quick Search on Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-400"
              >
                <Search className="h-4 w-4 text-red-500" />
                <span>Search Documentation...</span>
              </button>
            </div>

            {/* Categories & Nested Items */}
            {categories.map((cat) => {
              const isExpanded = expandedCategories[cat.id] ?? true;
              return (
                <div key={cat.id} className="space-y-2">
                  <button
                    onClick={() => setExpandedCategories(prev => ({ ...prev, [cat.id]: !isExpanded }))}
                    className="w-full flex items-center justify-between text-left py-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-slate-400">
                      {getCategoryIcon(cat.icon)}
                      <span>{cat.name}</span>
                    </div>
                    {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="pl-6 space-y-1 border-l border-white/5">
                      {cat.items.map((item) => {
                        const isActive = activeSlug === item.slug;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelectArticle(item.slug)}
                            className={`
                              w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all
                              ${isActive 
                                ? "bg-red-500/10 border border-red-500/30 text-red-400 shadow-lg shadow-red-500/5" 
                                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"}
                            `}
                          >
                            <span className="truncate">{item.title}</span>
                            {item.difficulty && (
                              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                                item.difficulty === "Developer" ? "bg-purple-500/20 text-purple-400" :
                                item.difficulty === "Advanced" ? "bg-red-500/20 text-red-400" :
                                "bg-slate-800 text-slate-400"
                              }`}>
                                {item.difficulty[0]}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bookmarks Section */}
            {favorites.length > 0 && (
              <div className="pt-4 border-t border-white/5 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block flex items-center gap-1.5">
                  <Bookmark className="h-3.5 w-3.5 text-amber-500" /> Bookmarks
                </span>
                <div className="space-y-1">
                  {favorites.map(favSlug => {
                    const art = articles[favSlug];
                    if (!art) return null;
                    return (
                      <button
                        key={favSlug}
                        onClick={() => handleSelectArticle(favSlug)}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white truncate block hover:bg-white/5 font-mono"
                      >
                        • {art.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <div className="pt-4 border-t border-white/5 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" /> Recently Viewed
                </span>
                <div className="space-y-1">
                  {recentlyViewed.map(rvSlug => {
                    const art = articles[rvSlug];
                    if (!art) return null;
                    return (
                      <button
                        key={rvSlug}
                        onClick={() => handleSelectArticle(rvSlug)}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white truncate block hover:bg-white/5 font-mono"
                      >
                        • {art.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* CENTER MAIN CONTENT COLUMN */}
        <main className="flex-1 p-6 lg:p-12 max-w-4xl mx-auto overflow-y-auto">
          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300">Docs</Link>
            <span>/</span>
            <span className="text-slate-400">{currentArticle.category}</span>
            <span>/</span>
            <span className="text-red-400 font-bold">{currentArticle.title}</span>
          </div>

          {/* Article Header */}
          <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono font-bold">
                {currentArticle.difficulty || "Beginner"}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 text-slate-400 text-xs font-mono flex items-center gap-1">
                <Clock className="h-3 w-3" /> {currentArticle.readTime}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 text-slate-400 text-xs font-mono flex items-center gap-1">
                <User className="h-3 w-3" /> {currentArticle.author}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 text-slate-400 text-xs font-mono flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Updated {currentArticle.updatedAt}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-white font-display tracking-tight">
              {currentArticle.title}
            </h1>

            <p className="text-base text-slate-300 leading-relaxed font-sans">
              {currentArticle.description}
            </p>

            {/* Action Bar */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => toggleFavorite(currentArticle.slug)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                  favorites.includes(currentArticle.slug)
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>{favorites.includes(currentArticle.slug) ? "Bookmarked" : "Bookmark"}</span>
              </button>

              <button
                onClick={() => {
                  setLikesCount(l => l + (hasLiked ? -1 : 1));
                  setHasLiked(!hasLiked);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                  hasLiked
                    ? "bg-red-500/20 border-red-500/40 text-red-400"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{likesCount} Likes</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white text-xs font-mono font-bold transition-all"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedLink ? "Link Copied!" : "Copy Page Link"}</span>
              </button>
            </div>
          </div>

          {/* Dynamic Content Blocks Rendering */}
          <div className="space-y-6">
            {currentArticle.contentBlocks.map((block, idx) => {
              if (block.type === "text") {
                return (
                  <p key={idx} className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-sans">
                    {block.text}
                  </p>
                );
              }

              if (block.type === "heading") {
                return (
                  <h2 key={idx} className="text-2xl font-bold text-white font-display tracking-tight pt-4 border-t border-white/5">
                    {block.title}
                  </h2>
                );
              }

              if (block.type === "alert") {
                const alertStyle = 
                  block.variant === "danger" ? "bg-red-500/10 border-red-500/30 text-red-200" :
                  block.variant === "warning" ? "bg-amber-500/10 border-amber-500/30 text-amber-200" :
                  block.variant === "success" ? "bg-green-500/10 border-green-500/30 text-green-200" :
                  "bg-blue-500/10 border-blue-500/30 text-blue-200";

                return (
                  <div key={idx} className={`p-4 rounded-xl border ${alertStyle} space-y-1 my-4`}>
                    {block.title && <b className="block text-xs font-mono font-bold uppercase">{block.title}</b>}
                    <p className="text-xs font-sans">{block.text}</p>
                  </div>
                );
              }

              if (block.type === "code") {
                return (
                  <div key={idx} className="my-6 rounded-xl bg-[#080a12] border border-white/10 overflow-hidden font-mono text-xs">
                    {block.filename && (
                      <div className="px-4 py-2 bg-white/5 border-b border-white/5 text-slate-400 text-[11px]">
                        {block.filename}
                      </div>
                    )}
                    <pre className="p-4 text-green-400 overflow-x-auto">
                      {block.code}
                    </pre>
                  </div>
                );
              }

              if (block.type === "steps" && block.steps) {
                return (
                  <div key={idx} className="my-6 space-y-4">
                    {block.steps.map(s => (
                      <div key={s.step} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="h-8 w-8 rounded-full bg-red-600 text-white font-mono font-bold flex items-center justify-center flex-shrink-0 text-xs shadow-md">
                          {s.step}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1">{s.title}</h4>
                          <p className="text-xs text-slate-400">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              if (block.type === "command" && block.command) {
                return <CommandBlock key={idx} command={block.command} />;
              }

              if (block.type === "api" && block.apiEndpoint) {
                return <ApiExplorer key={idx} endpoint={block.apiEndpoint} />;
              }

              if (block.type === "troubleshoot") {
                return <TroubleshootWizard key={idx} />;
              }

              return null;
            })}
          </div>

          {/* Previous / Next Article Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-16 pt-8 border-t border-white/10">
            {prevSlug && articles[prevSlug] ? (
              <button
                onClick={() => handleSelectArticle(prevSlug)}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-500/30 text-left transition-all group"
              >
                <span className="text-[10px] font-mono text-slate-500 block mb-1 flex items-center gap-1">
                  <ArrowLeft className="h-3 w-3" /> PREVIOUS ARTICLE
                </span>
                <span className="text-xs font-bold text-white group-hover:text-red-400 truncate block">
                  {articles[prevSlug].title}
                </span>
              </button>
            ) : <div />}

            {nextSlug && articles[nextSlug] ? (
              <button
                onClick={() => handleSelectArticle(nextSlug)}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-500/30 text-right transition-all group"
              >
                <span className="text-[10px] font-mono text-slate-500 block mb-1 flex items-center justify-end gap-1">
                  NEXT ARTICLE <ArrowRight className="h-3 w-3" />
                </span>
                <span className="text-xs font-bold text-white group-hover:text-red-400 truncate block">
                  {articles[nextSlug].title}
                </span>
              </button>
            ) : <div />}
          </div>
        </main>

        {/* RIGHT SIDEBAR COLUMN */}
        <aside className="hidden xl:block w-72 sticky top-16 h-[calc(100vh-64px)] bg-[#080b13] border-l border-white/10 p-5 overflow-y-auto font-sans text-xs space-y-6 no-scrollbar">
          
          {/* Table of Contents */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
              ON THIS PAGE
            </span>
            <div className="space-y-2 border-l border-white/10 pl-3">
              <a href="#overview" className="block text-red-400 font-bold font-mono">Overview & Architecture</a>
              <a href="#key-features" className="block text-slate-400 hover:text-white">Key Capabilities</a>
              <a href="#configuration" className="block text-slate-400 hover:text-white">Configuration</a>
              <a href="#code-examples" className="block text-slate-400 hover:text-white">Code Snippets</a>
            </div>
          </div>

          {/* Reading Stats */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>Reading Time:</span>
              <b className="text-white">{currentArticle.readTime}</b>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Version Target:</span>
              <b className="text-red-400">{currentArticle.version}</b>
            </div>
          </div>

          {/* Feedback Widget */}
          <div className="p-4 rounded-xl bg-[#101422] border border-white/10 text-center space-y-3">
            <span className="text-xs font-bold text-white block">Was this page helpful?</span>
            <div className="flex justify-center gap-3">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-green-500/20 text-slate-300 hover:text-green-400 font-bold transition-colors flex items-center gap-1 text-xs">
                <ThumbsUp className="h-3.5 w-3.5" /> Yes
              </button>
              <button className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 font-bold transition-colors flex items-center gap-1 text-xs">
                <ThumbsDown className="h-3.5 w-3.5" /> No
              </button>
            </div>
          </div>

          {/* GitHub Edit Button */}
          <div className="pt-2">
            <a
              href="https://github.com/RayExo"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-[11px] transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5 text-red-500" />
              <span>Edit page on GitHub</span>
            </a>
          </div>

        </aside>

      </div>
    </div>
  );
}
