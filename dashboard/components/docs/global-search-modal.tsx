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
import { Search, X, BookOpen, Terminal, ShieldCheck, Zap, ArrowRight, CornerDownLeft } from "lucide-react";
import { INITIAL_ARTICLES, INITIAL_CATEGORIES } from "@/lib/docs-data";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (slug: string) => void;
}

export function GlobalSearchModal({ isOpen, onClose, onSelectArticle }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const articlesList = Object.values(INITIAL_ARTICLES);
  const filteredArticles = query.trim() === "" 
    ? articlesList 
    : articlesList.filter(a => 
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase()) ||
        a.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0b0e18] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-white/10 bg-[#10141f]">
          <Search className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation, commands, API, guides... (Cmd + K)"
            className="w-full bg-transparent text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2 no-scrollbar">
          {filteredArticles.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No documentation articles found matching &quot;<span className="text-white">{query}</span>&quot;
            </div>
          ) : (
            filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => {
                  onSelectArticle(art.slug);
                  onClose();
                }}
                className="group flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 cursor-pointer transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-500 mt-0.5">
                    {art.category.includes("Security") ? <ShieldCheck className="h-4 w-4" /> : art.category.includes("API") ? <Terminal className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">{art.category}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">{art.readTime}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors mt-0.5">
                      {art.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">{art.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500 group-hover:text-red-400 font-mono text-xs">
                  <span>Open</span>
                  <CornerDownLeft className="h-3.5 w-3.5" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-[#080a12] border-t border-white/5 text-[11px] text-slate-500 font-mono">
          <span>Search index status: <b>100% Operational</b></span>
          <span>Press <b>ESC</b> to exit</span>
        </div>
      </div>
    </div>
  );
}
