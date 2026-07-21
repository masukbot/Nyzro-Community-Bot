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
import { Edit3, Save, X, CheckCircle } from "lucide-react";
import { DocArticle } from "@/lib/docs-data";

interface CmsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: DocArticle;
  onSaveArticle: (updated: DocArticle) => void;
}

export function CmsEditorModal({ isOpen, onClose, article, onSaveArticle }: CmsEditorModalProps) {
  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [category, setCategory] = useState(article.category);
  const [description, setDescription] = useState(article.description);
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced" | "Developer">(article.difficulty || "Beginner");
  const [tags, setTags] = useState(article.tags.join(", "));
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updatedArticle: DocArticle = {
      ...article,
      title,
      slug,
      category,
      description,
      difficulty,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      updatedAt: "Just now (CMS Edit)"
    };
    onSaveArticle(updatedArticle);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans text-xs">
      <div className="w-full max-w-2xl bg-[#0b0e18] border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#111522]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Nyzro Dynamic Documentation CMS Editor</h3>
              <p className="text-xs text-slate-400">Editing Slug: <span className="font-mono text-red-400">{article.slug}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 no-scrollbar">
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">ARTICLE TITLE</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">URL SLUG</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-300 focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">CATEGORY</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-red-500/50"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">DESCRIPTION</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-red-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">DIFFICULTY LEVEL</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-[#111522] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Developer">Developer</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">TAGS (Comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-red-500/50"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#080a12] border-t border-white/10">
          <span className="text-[11px] text-slate-500 font-mono">
            {savedSuccess ? <span className="text-green-400 font-bold flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Published Revisions to Edge CMS</span> : "Changes will take effect instantly."}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-2 transition-colors"
            >
              <Save className="h-4 w-4" /> Save & Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
