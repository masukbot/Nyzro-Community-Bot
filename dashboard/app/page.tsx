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

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { EnterprisePricingSection } from "@/components/landing/enterprise-pricing";

export default function LandingPage() {
  const [dashTab, setDashTab] = useState<"overview" | "automod" | "classifier" | "security">("overview");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 20 });
  const [liveServers, setLiveServers] = useState(58412);
  const [sensitivity, setSensitivity] = useState(85);

  // Dynamic Toggles State
  const [toggles, setToggles] = useState({
    antiSpam: true,
    antiRaid: true,
    aiClassifier: true,
    scamScanner: true,
    ocrVision: true,
  });

  // Dynamic Console Terminal Logs for Raid / AI Classifier
  const [termLogs, setTermLogs] = useState([
    { text: "[03:49:12] SYS_INIT :: Shard #07 online. Latency 14.2ms", type: "dim" },
    { text: "[03:49:14] AI_CLASSIFIER :: Pattern matched in #general -> 99.4% confidence match", type: "ok" },
    { text: "[03:49:18] RADAR :: Raid cluster detected from IP subnet 185.220.x.x", type: "warn" },
    { text: "[03:49:19] SECURITY :: Quarantined 42 bot accounts in 0.14 seconds", type: "ok" },
    { text: "[03:49:22] AUDIT :: Server state restored cleanly. Zero member impact.", type: "ok" },
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mouse move handler for hero spotlight
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlightPos({ x, y });
  };

  // Canvas particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 51, 85, ${p.alpha})`;
        ctx.fill();

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 51, 85, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Periodic Live Feed Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveServers(prev => prev + (Math.random() > 0.4 ? 1 : 0));
      
      const newLogs = [
        { text: `[${new Date().toTimeString().split(" ")[0]}] AI_MOD :: Context evaluated in #${["general", "lounge", "dev"][Math.floor(Math.random() * 3)]} -> Passed`, type: "ok" },
        { text: `[${new Date().toTimeString().split(" ")[0]}] SCANNER :: Scanned image attachment -> No threats found`, type: "ok" },
        { text: `[${new Date().toTimeString().split(" ")[0]}] SHIELD :: Suspicious link blocked in #trade`, type: "warn" },
      ];
      const randomLog = newLogs[Math.floor(Math.random() * newLogs.length)];
      setTermLogs(prev => [...prev.slice(1), randomLog]);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="nyzro-landing-root">
      {/* Complete Exact CSS Styling matching the HTML source */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .nyzro-landing-root {
          --void: #05060a;
          --panel: #0b0e18;
          --panel-2: #10141f;
          --panel-3: #141927;
          --line: rgba(255,255,255,0.07);
          --line-strong: rgba(255,255,255,0.14);
          --text-1: #f4f5f9;
          --text-2: #9599ac;
          --text-3: #5a5f74;
          --red: #ff3355;
          --red-2: #e11d3c;
          --red-soft: rgba(255,51,85,0.14);
          --red-glow: rgba(255,51,85,0.35);
          --green: #34d17c;
          --font-display: 'Space Grotesk', sans-serif;
          --font-body: 'Inter', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
          --container: 1200px;
          --section-pad: 104px;
          background: var(--void);
          color: var(--text-2);
          font-family: var(--font-body);
          line-height: 1.6;
          font-size: 16px;
          overflow-x: hidden;
          min-height: 100vh;
        }

        .nyzro-landing-root *, .nyzro-landing-root *::before, .nyzro-landing-root *::after {
          box-sizing: border-box;
        }

        .nyzro-landing-root h1, .nyzro-landing-root h2, .nyzro-landing-root h3, .nyzro-landing-root h4 {
          font-family: var(--font-display);
          color: var(--text-1);
          font-weight: 600;
          letter-spacing: -0.01em;
          line-height: 1.12;
        }

        .nyzro-container { max-width: var(--container); margin: 0 auto; padding: 0 32px; }
        .nyzro-section { padding: var(--section-pad) 0; position: relative; }
        .nyzro-section-head { max-width: 640px; margin-bottom: 56px; }
        .nyzro-section-head.center { margin-left: auto; margin-right: auto; text-align: center; }

        .nyzro-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-mono); font-size: 12.5px; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--red);
          margin-bottom: 18px;
        }
        .nyzro-eyebrow::before { content: ''; width: 14px; height: 1px; background: var(--red); display: inline-block; }

        .nyzro-title { font-size: clamp(1.9rem, 3.1vw, 2.6rem); margin-bottom: 16px; }
        .nyzro-desc { font-size: 16.5px; color: var(--text-2); max-width: 560px; }
        .nyzro-section-head.center .nyzro-desc { margin: 0 auto; }

        /* Buttons */
        .nyzro-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          font-family: var(--font-body); font-weight: 600; font-size: 14.5px;
          padding: 14px 26px; border-radius: 10px; border: 1px solid transparent;
          white-space: nowrap; cursor: pointer; text-decoration: none;
          transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease, background .3s ease, border-color .3s ease;
        }
        .nyzro-btn-primary {
          background: linear-gradient(180deg, #ff4767, var(--red-2));
          color: #fff;
          box-shadow: 0 1px 0 rgba(255,255,255,0.25) inset, 0 10px 30px -8px var(--red-glow);
        }
        .nyzro-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 1px 0 rgba(255,255,255,0.3) inset, 0 16px 36px -6px rgba(255,51,85,0.55); }
        .nyzro-btn-ghost {
          background: rgba(255,255,255,0.02);
          border-color: var(--line-strong);
          color: var(--text-1);
        }
        .nyzro-btn-ghost:hover { background: rgba(255,255,255,0.055); border-color: rgba(255,255,255,0.24); transform: translateY(-2px); }

        /* Noise Overlay */
        .nyzro-noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 2;
          opacity: 0.035; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* Nav */
        .nyzro-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(5,6,10,0.6);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--line);
        }
        .nyzro-nav-inner {
          max-width: var(--container); margin: 0 auto; padding: 0 32px;
          height: 72px; display: flex; align-items: center; justify-content: space-between;
        }
        .nyzro-nav-logo { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 700; font-size: 19px; color: var(--text-1); text-decoration: none; }
        .nyzro-nav-links { display: flex; align-items: center; gap: 34px; }
        .nyzro-nav-link { font-size: 14.5px; font-weight: 500; color: var(--text-2); transition: color .2s ease; text-decoration: none; }
        .nyzro-nav-link:hover { color: var(--text-1); }
        .nyzro-nav-actions { display: flex; align-items: center; gap: 14px; }

        /* Hero */
        .nyzro-hero {
          position: relative; overflow: hidden; padding: 190px 0 120px;
          min-height: 92vh; display: flex; align-items: center;
        }
        .nyzro-hero-bg { position: absolute; inset: 0; z-index: 0; }
        .nyzro-hero-grid {
          position: absolute; inset: -10% -10%;
          background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 64px 64px;
          -webkit-mask-image: radial-gradient(ellipse 60% 55% at 50% 35%, black 10%, transparent 75%);
          animation: nyzro-grid-pan 22s linear infinite;
        }
        @keyframes nyzro-grid-pan { 0% { background-position: 0 0, 0 0; } 100% { background-position: 64px 64px, 64px 64px; } }

        .nyzro-hero-beam {
          position: absolute; top: -40%; left: -20%; width: 46%; height: 220%;
          background: linear-gradient(90deg, transparent, rgba(255,51,85,0.10), transparent);
          transform: rotate(18deg);
          animation: nyzro-beam-sweep 9s ease-in-out infinite;
          filter: blur(6px);
        }
        @keyframes nyzro-beam-sweep {
          0% { transform: translateX(0) rotate(18deg); opacity: 0; }
          15% { opacity: 1; }
          50% { transform: translateX(220%) rotate(18deg); opacity: 1; }
          65% { opacity: 0; }
          100% { transform: translateX(220%) rotate(18deg); opacity: 0; }
        }

        .nyzro-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: nyzro-pulse 2s infinite; flex-shrink: 0; }
        @keyframes nyzro-pulse {
          0% { box-shadow: 0 0 0 0 rgba(52,209,124,0.55); }
          70% { box-shadow: 0 0 0 7px rgba(52,209,124,0); }
          100% { box-shadow: 0 0 0 0 rgba(52,209,124,0); }
        }

        .nyzro-hero-badge {
          display: inline-flex; align-items: center; gap: 9px;
          font-family: var(--font-mono); font-size: 12.5px; letter-spacing: 0.03em;
          color: var(--text-2); background: rgba(255,255,255,0.03);
          border: 1px solid var(--line-strong); padding: 8px 16px 8px 12px; border-radius: 99px;
          margin-bottom: 28px;
        }

        .nyzro-hero-title { font-size: clamp(2.6rem, 5.6vw, 4.4rem); line-height: 1.06; margin-bottom: 24px; }
        .nyzro-hero-title .accent { color: var(--red); font-style: normal; }

        /* HUD Floating Cards */
        .nyzro-hud-card {
          position: absolute; pointer-events: auto;
          background: rgba(14,17,27,0.72);
          border: 1px solid var(--line-strong);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          border-radius: 12px; padding: 13px 16px;
          box-shadow: 0 20px 40px -18px rgba(0,0,0,0.6);
          animation: nyzro-float 6s ease-in-out infinite;
        }
        @keyframes nyzro-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

        .nyzro-hud-1 { top: 6%; left: 1%; animation-delay: 0s; }
        .nyzro-hud-2 { top: 12%; right: 0%; animation-delay: 1.2s; }
        .nyzro-hud-3 { bottom: 12%; left: 4%; animation-delay: 2.1s; }
        .nyzro-hud-4 { bottom: 6%; right: 6%; animation-delay: 0.7s; }

        .nyzro-hud-wave { display: flex; align-items: flex-end; gap: 3px; height: 16px; margin-top: 4px; }
        .nyzro-hud-wave span { width: 3px; background: var(--red); border-radius: 2px; animation: nyzro-wave 1.1s ease-in-out infinite; }
        .nyzro-hud-wave span:nth-child(1) { height: 40%; animation-delay: 0s; }
        .nyzro-hud-wave span:nth-child(2) { height: 80%; animation-delay: 0.15s; }
        .nyzro-hud-wave span:nth-child(3) { height: 55%; animation-delay: 0.3s; }
        .nyzro-hud-wave span:nth-child(4) { height: 95%; animation-delay: 0.45s; }
        .nyzro-hud-wave span:nth-child(5) { height: 35%; animation-delay: 0.6s; }
        @keyframes nyzro-wave { 0%, 100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }

        /* Stats Strip */
        .nyzro-stats { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: linear-gradient(180deg, rgba(255,255,255,0.015), transparent); position: relative; z-index: 2; }
        .nyzro-stats-grid { display: grid; grid-template-columns: repeat(4,1fr); }
        .nyzro-stat { padding: 40px 36px; border-left: 1px solid var(--line); }
        .nyzro-stat:first-child { border-left: none; }
        .nyzro-stat-value { font-family: var(--font-mono); font-size: clamp(1.7rem,2.6vw,2.3rem); font-weight: 600; color: var(--text-1); display: flex; align-items: baseline; gap: 3px; }
        .nyzro-stat-unit { font-size: 0.55em; color: var(--red); font-weight: 600; }
        .nyzro-stat-label { margin-top: 9px; font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-3); }

        /* Dashboard Preview Window */
        .nyzro-dash-window {
          background: var(--panel); border: 1px solid var(--line-strong); border-radius: 16px; overflow: hidden;
          box-shadow: 0 50px 100px -35px rgba(0,0,0,0.7);
        }
        .nyzro-dash-chrome { display: flex; align-items: center; gap: 16px; padding: 14px 18px; border-bottom: 1px solid var(--line); background: var(--panel-2); }
        .nyzro-dash-dots { display: flex; gap: 6px; }
        .nyzro-dash-dots span { width: 10px; height: 10px; border-radius: 50%; background: #252a39; }
        .nyzro-dash-url { flex: 1; max-width: 320px; margin: 0 auto; background: rgba(255,255,255,0.03); border: 1px solid var(--line); border-radius: 7px; padding: 6px 14px; font-family: var(--font-mono); font-size: 12px; color: var(--text-3); text-align: center; }
        .nyzro-dash-body { display: flex; min-height: 480px; }
        .nyzro-dash-sidebar { width: 64px; border-right: 1px solid var(--line); display: flex; flex-direction: column; align-items: center; padding: 20px 0; gap: 10px; background: rgba(255,255,255,0.012); flex-shrink: 0; }
        .nyzro-dash-side-icon { width: 38px; height: 38px; border-radius: 9px; display: flex; align-items: center; justify-content: center; color: var(--text-3); cursor: pointer; }
        .nyzro-dash-side-icon.active { background: var(--red-soft); color: var(--red); }
        .nyzro-dash-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .nyzro-dash-tabs { display: flex; gap: 4px; padding: 14px 24px 0; border-bottom: 1px solid var(--line); overflow-x: auto; }
        .nyzro-dash-tab { background: none; border: none; color: var(--text-3); font-family: var(--font-body); font-weight: 600; font-size: 13.5px; padding: 10px 16px; border-bottom: 2px solid transparent; cursor: pointer; transition: all .2s ease; white-space: nowrap; }
        .nyzro-dash-tab.active { color: var(--text-1); border-color: var(--red); }
        .nyzro-dash-panel { padding: 26px; flex: 1; min-width: 0; }

        .nyzro-dash-grid-2 { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; }
        .nyzro-dash-box { background: var(--panel-2); border: 1px solid var(--line); border-radius: 12px; padding: 18px; }
        .nyzro-dash-box-title { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-3); margin-bottom: 16px; display: flex; justify-content: space-between; }
        .nyzro-dash-mini-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 18px; }
        .nyzro-mini-stat { background: var(--panel-2); border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px; }
        .nyzro-mini-stat-value { font-family: var(--font-mono); font-size: 19px; font-weight: 600; color: var(--text-1); }
        .nyzro-mini-stat-label { font-size: 11px; color: var(--text-3); margin-top: 4px; font-family: var(--font-mono); }

        .nyzro-dash-feed { display: flex; flex-direction: column; gap: 9px; max-height: 230px; overflow: hidden; }
        .nyzro-feed-line { display: flex; align-items: center; gap: 10px; font-size: 12.5px; color: var(--text-2); padding: 9px 11px; border-radius: 8px; background: rgba(255,255,255,0.018); }
        .nyzro-feed-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
        .nyzro-feed-dot.warn { background: var(--red); }
        .nyzro-feed-time { font-family: var(--font-mono); font-size: 10.5px; color: var(--text-3); margin-left: auto; flex-shrink: 0; }

        .nyzro-log-console { background: #07080d; border: 1px solid var(--line); border-radius: 10px; padding: 16px 18px; font-family: var(--font-mono); font-size: 12px; height: 230px; overflow: hidden; display: flex; flex-direction: column; gap: 8px; }
        .nyzro-term-line { color: var(--text-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .nyzro-term-line .t-ok { color: var(--green); }
        .nyzro-term-line .t-warn { color: var(--red); }
        .nyzro-term-line .t-dim { color: var(--text-3); }

        .nyzro-toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid var(--line); }
        .nyzro-toggle-row:last-child { border-bottom: none; }
        .nyzro-toggle-row span { font-size: 13px; color: var(--text-2); }
        .nyzro-toggle { width: 36px; height: 21px; border-radius: 99px; background: #252a39; position: relative; flex-shrink: 0; transition: background .25s ease; border: none; cursor: pointer; }
        .nyzro-toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 15px; height: 15px; border-radius: 50%; background: #fff; transition: transform .25s ease; }
        .nyzro-toggle.on { background: var(--red); }
        .nyzro-toggle.on::after { transform: translateX(15px); }

        /* Bento Grid */
        .nyzro-bento-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: minmax(210px, auto); gap: 20px; }
        .nyzro-bento-card {
          position: relative; grid-column: span 2;
          background: var(--panel); border: 1px solid var(--line); border-radius: 16px; padding: 30px;
          overflow: hidden; transition: border-color .3s ease, transform .35s ease;
          display: flex; flex-direction: column;
        }
        .nyzro-bento-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.16); }
        .nyzro-bento-card.small { grid-column: span 1; }
        .nyzro-bento-card.tall { grid-row: span 2; }
        .nyzro-card-icon { width: 44px; height: 44px; border-radius: 11px; background: var(--red-soft); display: flex; align-items: center; justify-content: center; margin-bottom: 18px; flex-shrink: 0; }
        .nyzro-card-title { font-size: 19px; margin-bottom: 8px; color: var(--text-1); }
        .nyzro-card-text { font-size: 14px; color: var(--text-2); line-height: 1.55; margin-bottom: 14px; }
        .nyzro-card-list { display: flex; flex-direction: column; gap: 9px; margin-top: auto; list-style: none; }
        .nyzro-card-list li { display: flex; align-items: center; gap: 9px; font-size: 13.5px; color: var(--text-2); }

        /* Comparison Table */
        .nyzro-compare-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 16px; }
        .nyzro-compare-table { width: 100%; border-collapse: collapse; min-width: 640px; background: var(--panel); }
        .nyzro-compare-table th, .nyzro-compare-table td { padding: 18px 22px; border-bottom: 1px solid var(--line); font-size: 14px; text-align: center; }
        .nyzro-compare-table th:first-child, .nyzro-compare-table td:first-child { text-align: left; color: var(--text-2); font-weight: 500; }
        .nyzro-compare-table thead th { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: var(--text-3); font-weight: 500; background: var(--panel-2); }
        .nyzro-compare-highlight { background: var(--red-soft) !important; color: var(--red) !important; }

        /* Testimonials Marquee */
        .nyzro-marquee { overflow: hidden; position: relative; -webkit-mask: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); }
        .nyzro-marquee-track { display: flex; gap: 22px; width: max-content; animation: nyzro-marquee-scroll 42s linear infinite; }
        .nyzro-marquee:hover .nyzro-marquee-track { animation-play-state: paused; }
        @keyframes nyzro-marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .nyzro-quote-card { width: 340px; flex-shrink: 0; background: var(--panel); border: 1px solid var(--line); border-radius: 16px; padding: 28px; }
        .nyzro-quote-text { font-size: 14.5px; color: var(--text-2); line-height: 1.62; margin-bottom: 22px; }

        /* Pricing Cards */
        .nyzro-price-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .nyzro-price-card { background: var(--panel); border: 1px solid var(--line); border-radius: 18px; padding: 34px; display: flex; flex-direction: column; position: relative; transition: transform .3s ease; }
        .nyzro-price-card:hover { transform: translateY(-5px); }
        .nyzro-price-card.popular { border-color: var(--red); box-shadow: 0 0 0 1px var(--red), 0 40px 70px -35px var(--red-glow); }
        .nyzro-price-badge { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--red); color: #fff; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .05em; text-transform: uppercase; padding: 5px 14px; border-radius: 99px; font-weight: 600; }

        /* FAQ */
        .nyzro-faq-list { max-width: 760px; margin: 0 auto; }
        .nyzro-faq-item { border-bottom: 1px solid var(--line); }
        .nyzro-faq-q { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 24px 2px; background: none; border: none; text-align: left; font-family: var(--font-display); font-size: 16.5px; color: var(--text-1); font-weight: 500; cursor: pointer; }
        .nyzro-faq-icon { width: 28px; height: 28px; border-radius: 8px; border: 1px solid var(--line-strong); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform .3s ease, background .3s ease; }
        .nyzro-faq-item.open .nyzro-faq-icon { transform: rotate(45deg); background: var(--red-soft); border-color: var(--red); }

        /* CTA & Footer */
        .nyzro-cta-final { position: relative; text-align: center; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 24px; padding: 88px 40px; overflow: hidden; }
        .nyzro-cta-glow { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 90% at 50% 0%, rgba(255,51,85,0.20), transparent 70%); pointer-events: none; }
        .nyzro-footer { border-top: 1px solid var(--line); padding: 76px 0 32px; }
        .nyzro-footer-grid { display: grid; grid-template-columns: 1.6fr repeat(3,1fr); gap: 40px; margin-bottom: 56px; }

        @media (max-width: 900px) {
          .nyzro-nav-links { display: none; }
          .nyzro-stats-grid { grid-template-columns: repeat(2,1fr); }
          .nyzro-dash-grid-2 { grid-template-columns: 1fr; }
          .nyzro-bento-grid { grid-template-columns: repeat(2,1fr); }
          .nyzro-bento-card { grid-column: span 2 !important; grid-row: auto !important; }
          .nyzro-price-grid { grid-template-columns: 1fr; }
          .nyzro-footer-grid { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      {/* SVG Icon Definitions */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <g id="ic-shield" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.5 4 5.5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10v-6L12 2.5Z"/>
            <path d="m9 12 2 2 4-4.2"/>
          </g>
          <g id="ic-bolt" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.5 2 4 13.5h6l-1 8.5L20 10.5h-6l-1.5-8.5Z"/>
          </g>
          <g id="ic-cpu" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="6" width="12" height="12" rx="2"/>
            <rect x="9.5" y="9.5" width="5" height="5" rx="1"/>
            <path d="M9 2v2.5M15 2v2.5M9 19.5V22M15 19.5V22M2 9h2.5M2 15h2.5M19.5 9H22M19.5 15H22"/>
          </g>
          <g id="ic-chart" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20V10M12 20V4M20 20v-7"/>
            <path d="M2.5 20h19"/>
          </g>
          <g id="ic-users" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="8" r="3.2"/>
            <path d="M2.7 20c.9-3.8 3.4-6 6.3-6s5.4 2.2 6.3 6"/>
            <circle cx="17" cy="8.5" r="2.6"/>
            <path d="M16 5.2c1.4-.5 3 .3 3.5 1.7"/>
            <path d="M16.5 14.3c2.4.5 4.1 2.6 4.8 5.7"/>
          </g>
          <g id="ic-lock" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="10.5" width="14" height="10" rx="2"/>
            <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>
            <path d="M12 14.5v2.5"/>
          </g>
          <g id="ic-radar" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"/>
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 12 18 7"/>
            <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>
          </g>
          <g id="ic-terminal" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4.5" width="18" height="15" rx="2"/>
            <path d="m7 9.5 3 2.8-3 2.8M13 15.3h4"/>
          </g>
          <g id="ic-ticket" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-6Z"/>
            <path d="M14 5v14" strokeDasharray="2 3"/>
          </g>
          <g id="ic-check" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12.5 9 17.5 20 6.5"/>
          </g>
          <g id="ic-x" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 5 19 19M19 5 5 19"/>
          </g>
          <g id="ic-arrow" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 12h15M13 5.5l6.5 6.5-6.5 6.5"/>
          </g>
          <g id="ic-plus" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4.5v15M4.5 12h15"/>
          </g>
          <g id="ic-star" fill="currentColor" stroke="none">
            <path d="M10 1.3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3-5.4 3 1.3-6-4.6-4.1 6.1-.6L10 1.3Z"/>
          </g>
        </defs>
      </svg>

      <div className="nyzro-noise"></div>

      {/* NAVIGATION */}
      <nav className="nyzro-nav">
        <div className="nyzro-nav-inner">
          <Link href="/" className="nyzro-nav-logo">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path d="M15 2 27 8v14L15 28 3 22V8L15 2Z" stroke="#ff3355" strokeWidth="1.6"/>
              <path d="M10 14.5 15 20l6-9" stroke="#ff3355" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            NYZRO
          </Link>

          <div className="nyzro-nav-links">
            <a href="#product" className="nyzro-nav-link">Product</a>
            <a href="#security" className="nyzro-nav-link">Security</a>
            <a href="#modules" className="nyzro-nav-link">Modules</a>
            <a href="#pricing" className="nyzro-nav-link">Pricing</a>
            <a href="#faq" className="nyzro-nav-link">FAQ</a>
          </div>

          <div className="nyzro-nav-actions">
            <Link href="/docs" className="nyzro-btn nyzro-btn-ghost">Docs</Link>
            <button onClick={() => signIn("discord", { callbackUrl: "/dashboard" })} className="nyzro-btn nyzro-btn-primary">
              Log in to Console
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="nyzro-hero" onMouseMove={handleHeroMouseMove}>
        <div className="nyzro-hero-bg">
          <div className="nyzro-hero-grid"></div>
          <div
            className="nyzro-hero-spotlight"
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(560px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255,51,85,0.16), transparent 60%)`,
            }}
          />
          <div className="nyzro-hero-beam"></div>
          <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
        </div>

        <div className="nyzro-container" style={{ position: "relative", zIndex: 3 }}>
          <div style={{ maxWidth: "760px" }}>
            <div className="nyzro-hero-badge">
              <span className="nyzro-badge-dot"></span>
              LIVE — <span>{liveServers.toLocaleString()}</span> servers protected right now
            </div>

            <h1 className="nyzro-hero-title">
              Discord moderation<br />
              that thinks in <span className="accent">milliseconds.</span>
            </h1>

            <p style={{ fontSize: "18px", color: "var(--text-2)", maxWidth: "540px", marginBottom: "36px" }}>
              Nyzro reads every message, join and command as it happens — catching raids, spam and rule-breakers before your community ever sees them.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "64px" }}>
              <button onClick={() => signIn("discord", { callbackUrl: "/dashboard" })} className="nyzro-btn nyzro-btn-primary" style={{ padding: "16px 28px", fontSize: "15px" }}>
                <svg width="16" height="16" style={{ color: "#fff" }}><use href="#ic-bolt"/></svg>
                Open Dashboard Console
              </button>
              <a href="#security" className="nyzro-btn nyzro-btn-ghost" style={{ padding: "16px 26px", fontSize: "15px" }}>
                Watch it catch a raid
                <svg width="16" height="16"><use href="#ic-arrow"/></svg>
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ display: "flex" }}>
                <span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#2a3040", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" style={{ color: "#6b7186" }}><use href="#ic-users"/></svg>
                </span>
                <span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#161a26", marginLeft: "-9px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" style={{ color: "#6b7186" }}><use href="#ic-users"/></svg>
                </span>
              </div>
              <small style={{ fontFamily: "var(--font-mono)", fontSize: "12.5px", color: "var(--text-3)" }}>
                Trusted by communities with <b style={{ color: "var(--text-1)" }}>2,400,000+</b> members combined
              </small>
            </div>
          </div>
        </div>

        {/* HUD Widgets */}
        <div className="nyzro-hud-card nyzro-hud-1">
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", color: "var(--text-3)", marginBottom: "3px" }}>AI ENGINE</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "15px", color: "var(--text-1)", fontWeight: 600 }}>Scanning active...</div>
        </div>

        <div className="nyzro-hud-card nyzro-hud-2">
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", color: "var(--text-3)", marginBottom: "3px" }}>RESPONSE TIME</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "17px", color: "var(--green)", fontWeight: 600 }}>14.2 ms</div>
        </div>

        <div className="nyzro-hud-card nyzro-hud-3">
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", color: "var(--text-3)", marginBottom: "3px" }}>RAID STATUS</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "15px", color: "var(--red)", fontWeight: 600 }}>Raid Defeated</div>
        </div>

        <div className="nyzro-hud-card nyzro-hud-4">
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", color: "var(--text-3)", marginBottom: "3px" }}>THREAT STREAM</div>
          <div className="nyzro-hud-wave">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="nyzro-stats">
        <div className="nyzro-container">
          <div className="nyzro-stats-grid">
            <div className="nyzro-stat">
              <div className="nyzro-stat-value">4.8M+ <span className="nyzro-stat-unit">/day</span></div>
              <div className="nyzro-stat-label">Messages Scanned</div>
            </div>
            <div className="nyzro-stat">
              <div className="nyzro-stat-value">14ms <span className="nyzro-stat-unit">AVG</span></div>
              <div className="nyzro-stat-label">Reaction Time</div>
            </div>
            <div className="nyzro-stat">
              <div className="nyzro-stat-value">99.98%</div>
              <div className="nyzro-stat-label">Raid Catch Rate</div>
            </div>
            <div className="nyzro-stat">
              <div className="nyzro-stat-value">58,400+</div>
              <div className="nyzro-stat-label">Active Discord Servers</div>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD PREVIEW CONTROL CENTER */}
      <section id="product" className="nyzro-section">
        <div className="nyzro-container">
          <div className="nyzro-section-head center">
            <div className="nyzro-eyebrow">Enterprise Control Center</div>
            <h2 className="nyzro-title">Configured in seconds. Runs on autopilot.</h2>
            <p className="nyzro-desc">A unified real-time dashboard for your entire moderation stack.</p>
          </div>

          <div className="nyzro-dash-window">
            <div className="nyzro-dash-chrome">
              <div className="nyzro-dash-dots"><span></span><span></span><span></span></div>
              <div className="nyzro-dash-url">dashboard.nyzro.ai/guild/850129</div>
            </div>

            <div className="nyzro-dash-body">
              <div className="nyzro-dash-sidebar">
                <div onClick={() => setDashTab("overview")} className={`nyzro-dash-side-icon ${dashTab === "overview" ? "active" : ""}`}><svg width="18" height="18"><use href="#ic-shield"/></svg></div>
                <div onClick={() => setDashTab("automod")} className={`nyzro-dash-side-icon ${dashTab === "automod" ? "active" : ""}`}><svg width="18" height="18"><use href="#ic-cpu"/></svg></div>
                <div onClick={() => setDashTab("classifier")} className={`nyzro-dash-side-icon ${dashTab === "classifier" ? "active" : ""}`}><svg width="18" height="18"><use href="#ic-ticket"/></svg></div>
                <div onClick={() => setDashTab("security")} className={`nyzro-dash-side-icon ${dashTab === "security" ? "active" : ""}`}><svg width="18" height="18"><use href="#ic-chart"/></svg></div>
              </div>

              <div className="nyzro-dash-main">
                <div className="nyzro-dash-tabs">
                  <button onClick={() => setDashTab("overview")} className={`nyzro-dash-tab ${dashTab === "overview" ? "active" : ""}`}>Overview</button>
                  <button onClick={() => setDashTab("automod")} className={`nyzro-dash-tab ${dashTab === "automod" ? "active" : ""}`}>AutoMod Engine</button>
                  <button onClick={() => setDashTab("classifier")} className={`nyzro-dash-tab ${dashTab === "classifier" ? "active" : ""}`}>AI Classifier</button>
                  <button onClick={() => setDashTab("security")} className={`nyzro-dash-tab ${dashTab === "security" ? "active" : ""}`}>Security Console</button>
                </div>

                <div className="nyzro-dash-panel">
                  {dashTab === "overview" && (
                    <div className="nyzro-dash-grid-2">
                      <div>
                        <div className="nyzro-dash-mini-stats">
                          <div className="nyzro-mini-stat">
                            <div className="nyzro-mini-stat-value">1,428</div>
                            <div className="nyzro-mini-stat-label">Actions Today</div>
                          </div>
                          <div className="nyzro-mini-stat">
                            <div className="nyzro-mini-stat-value" style={{ color: "var(--green)" }}>0.14s</div>
                            <div className="nyzro-mini-stat-label">Avg Response</div>
                          </div>
                          <div className="nyzro-mini-stat">
                            <div className="nyzro-mini-stat-value">99.98%</div>
                            <div className="nyzro-mini-stat-label">Accuracy</div>
                          </div>
                        </div>

                        <div className="nyzro-dash-box">
                          <div className="nyzro-dash-box-title">Live Protection Feed <span style={{ color: "var(--green)" }}>REALTIME</span></div>
                          <div className="nyzro-dash-feed">
                            <div className="nyzro-feed-line">
                              <span className="nyzro-feed-dot warn"></span>
                              <span>Scam QR Image deleted in #general</span>
                              <span className="nyzro-feed-time">Just now</span>
                            </div>
                            <div className="nyzro-feed-line">
                              <span className="nyzro-feed-dot"></span>
                              <span>Auto-assigned &apos;Member&apos; role to 12 new users</span>
                              <span className="nyzro-feed-time">1m ago</span>
                            </div>
                            <div className="nyzro-feed-line">
                              <span className="nyzro-feed-dot"></span>
                              <span>AI Classifier approved support inquiry</span>
                              <span className="nyzro-feed-time">3m ago</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="nyzro-dash-box">
                        <div className="nyzro-dash-box-title">Security Modules</div>
                        <div className="nyzro-toggle-row">
                          <span>Anti-Raid Auto Shield</span>
                          <button onClick={() => setToggles(t => ({ ...t, antiRaid: !t.antiRaid }))} className={`nyzro-toggle ${toggles.antiRaid ? "on" : ""}`}></button>
                        </div>
                        <div className="nyzro-toggle-row">
                          <span>Multi-Model AI Router</span>
                          <button onClick={() => setToggles(t => ({ ...t, aiClassifier: !t.aiClassifier }))} className={`nyzro-toggle ${toggles.aiClassifier ? "on" : ""}`}></button>
                        </div>
                        <div className="nyzro-toggle-row">
                          <span>Vision QR & Phishing Filter</span>
                          <button onClick={() => setToggles(t => ({ ...t, scamScanner: !t.scamScanner }))} className={`nyzro-toggle ${toggles.scamScanner ? "on" : ""}`}></button>
                        </div>
                        <div className="nyzro-toggle-row">
                          <span>OCR Attachment Scanner</span>
                          <button onClick={() => setToggles(t => ({ ...t, ocrVision: !t.ocrVision }))} className={`nyzro-toggle ${toggles.ocrVision ? "on" : ""}`}></button>
                        </div>
                      </div>
                    </div>
                  )}

                  {dashTab === "automod" && (
                    <div className="nyzro-dash-box">
                      <div className="nyzro-dash-box-title">Sub-Second AutoMod Matrix</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "14px" }}>
                        <div style={{ padding: "16px", background: "var(--panel-3)", borderRadius: "10px" }}>
                          <b style={{ color: "#fff", display: "block", fontSize: "14px" }}>Anti-Spam Filter</b>
                          <span style={{ fontSize: "12px", color: "var(--text-3)" }}>Deletes 5+ repetitive messages in 2s</span>
                        </div>
                        <div style={{ padding: "16px", background: "var(--panel-3)", borderRadius: "10px" }}>
                          <b style={{ color: "#fff", display: "block", fontSize: "14px" }}>Anti-Phishing Filter</b>
                          <span style={{ fontSize: "12px", color: "var(--text-3)" }}>Blocks fake Steam/Discord Nitro links</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {dashTab === "classifier" && (
                    <div className="nyzro-dash-box">
                      <div className="nyzro-dash-box-title">AI Multi-Provider Model Classifier</div>
                      <p style={{ fontSize: "13px", color: "var(--text-2)", marginBottom: "16px" }}>
                        Routing tasks across Gemini 2.5 Flash, Claude 3.5 Sonnet, GPT-4o, and Groq.
                      </p>
                      <div className="nyzro-log-console">
                        {termLogs.map((l, i) => (
                          <div key={i} className="nyzro-term-line">
                            <span className={l.type === "ok" ? "t-ok" : l.type === "warn" ? "t-warn" : "t-dim"}>{l.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {dashTab === "security" && (
                    <div className="nyzro-dash-box">
                      <div className="nyzro-dash-box-title">Security Console & Audit Logs</div>
                      <p style={{ fontSize: "13px", color: "var(--text-2)" }}>All server events are cryptographically audited and stored with 100% recovery capabilities.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE BENTO GRID */}
      <section className="nyzro-section" style={{ background: "rgba(255,255,255,0.005)" }}>
        <div className="nyzro-container">
          <div className="nyzro-section-head center">
            <div className="nyzro-eyebrow">Enterprise Suite</div>
            <h2 className="nyzro-title">Built for servers with millions of members.</h2>
          </div>

          <div className="nyzro-bento-grid">
            <div className="nyzro-bento-card">
              <div className="nyzro-card-icon"><svg width="22" height="22"><use href="#ic-shield"/></svg></div>
              <h3 className="nyzro-card-title">Real-Time Anti-Raid System</h3>
              <p className="nyzro-card-text">Stops mass token joins, raid attacks, and rogue admin destructions in 0.14s.</p>
              <ul className="nyzro-card-list">
                <li><svg width="14" height="14" style={{ color: "var(--red)" }}><use href="#ic-check"/></svg> Auto-quarantine joining raid bot clusters</li>
                <li><svg width="14" height="14" style={{ color: "var(--red)" }}><use href="#ic-check"/></svg> Sub-second channel & role state restoration</li>
              </ul>
            </div>

            <div className="nyzro-bento-card">
              <div className="nyzro-card-icon"><svg width="22" height="22"><use href="#ic-cpu"/></svg></div>
              <h3 className="nyzro-card-title">Multi-Provider AI Classifier</h3>
              <p className="nyzro-card-text">Routes text & image analysis across Gemini, Claude, GPT-4o, and Groq.</p>
              <ul className="nyzro-card-list">
                <li><svg width="14" height="14" style={{ color: "var(--red)" }}><use href="#ic-check"/></svg> Contextual toxic language & hate speech detection</li>
                <li><svg width="14" height="14" style={{ color: "var(--red)" }}><use href="#ic-check"/></svg> Automatic cost optimization and zero-cost Ollama fallback</li>
              </ul>
            </div>

            <div className="nyzro-bento-card small">
              <div className="nyzro-card-icon"><svg width="22" height="22"><use href="#ic-ticket"/></svg></div>
              <h3 className="nyzro-card-title">Smart Tickets</h3>
              <p className="nyzro-card-text">AI ticket summaries and automated sentiment escalation.</p>
            </div>

            <div className="nyzro-bento-card small">
              <div className="nyzro-card-icon"><svg width="22" height="22"><use href="#ic-radar"/></svg></div>
              <h3 className="nyzro-card-title">Vision & OCR</h3>
              <p className="nyzro-card-text">Scans screenshots, PDF, and executables for QR scams.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MODULE SHOWCASE WITH INTERACTIVE SENSITIVITY */}
      <section id="modules" className="nyzro-section">
        <div className="nyzro-container">
          <div className="nyzro-section-head center">
            <div className="nyzro-eyebrow">Interactive Sensitivity</div>
            <h2 className="nyzro-title">Fine-tune AI thresholds in real-time.</h2>
          </div>

          <div style={{ maxWidth: "640px", margin: "0 auto", background: "var(--panel)", padding: "32px", borderRadius: "16px", border: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>AI Detection Sensitivity</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--red)", fontWeight: 600 }}>{sensitivity}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "var(--red)" }}
            />
            <div style={{ marginTop: "20px", padding: "16px", background: "var(--panel-2)", borderRadius: "10px", fontSize: "13px" }}>
              Confidence Threshold: <b>{sensitivity}%</b> — {sensitivity > 85 ? "Strict Policy Enforcement Mode" : "Balanced Community Mode"}
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY DEEP DIVE / RAID DEFENSE */}
      <section id="security" className="nyzro-section" style={{ background: "var(--panel-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="nyzro-container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "72px", alignItems: "center" }}>
            <div>
              <div className="nyzro-eyebrow">Sub-Second Defense</div>
              <h2 className="nyzro-title">Raid protection that acts before you notice.</h2>
              <p className="nyzro-desc" style={{ marginBottom: "26px" }}>
                When raid clusters join simultaneously, Nyzro identifies pattern anomalies, quarantines malicious accounts, and restores server state automatically.
              </p>
              <div style={{ display: "flex", gap: "28px" }}>
                <div>
                  <b style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "22px", color: "var(--text-1)" }}>0.14s</b>
                  <span style={{ fontSize: "12px", color: "var(--text-3)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Reaction Time</span>
                </div>
                <div>
                  <b style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "22px", color: "var(--text-1)" }}>100%</b>
                  <span style={{ fontSize: "12px", color: "var(--text-3)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Auto Recovery</span>
                </div>
              </div>
            </div>

            <div className="nyzro-log-console" style={{ height: "280px" }}>
              <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px", marginBottom: "8px", color: "var(--text-3)" }}>
                [SECURITY_TERMINAL] :: REAL-TIME TELEMETRY AUDIT
              </div>
              {termLogs.map((l, i) => (
                <div key={i} className="nyzro-term-line">
                  <span className={l.type === "ok" ? "t-ok" : l.type === "warn" ? "t-warn" : "t-dim"}>{l.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON MATRIX */}
      <section className="nyzro-section">
        <div className="nyzro-container">
          <div className="nyzro-section-head center">
            <div className="nyzro-eyebrow">Comparison Matrix</div>
            <h2 className="nyzro-title">How Nyzro compares to legacy bots.</h2>
          </div>

          <div className="nyzro-compare-wrap">
            <table className="nyzro-compare-table">
              <thead>
                <tr>
                  <th>Capability</th>
                  <th className="nyzro-compare-highlight">Nyzro Enterprise</th>
                  <th>Legacy Discord Bots</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Multi-Provider AI (Gemini, Claude, GPT, Groq)</td>
                  <td className="nyzro-compare-highlight">✓ Supported</td>
                  <td>✗ Unsupported</td>
                </tr>
                <tr>
                  <td>Vision QR & Phishing Attachment Scanner</td>
                  <td className="nyzro-compare-highlight">✓ Supported</td>
                  <td>✗ Unsupported</td>
                </tr>
                <tr>
                  <td>Sub-Second Anti-Nuke Recovery</td>
                  <td className="nyzro-compare-highlight">✓ Supported</td>
                  <td>Partial</td>
                </tr>
                <tr>
                  <td>Automated Failover & Budget Router</td>
                  <td className="nyzro-compare-highlight">✓ Supported</td>
                  <td>✗ Unsupported</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS MARQUEE */}
      <section className="nyzro-section" style={{ background: "rgba(255,255,255,0.003)", overflow: "hidden" }}>
        <div className="nyzro-container">
          <div className="nyzro-section-head center">
            <div className="nyzro-eyebrow">Community Reviews</div>
            <h2 className="nyzro-title">Trusted by top Discord owners.</h2>
          </div>
        </div>

        <div className="nyzro-marquee">
          <div className="nyzro-marquee-track">
            {[
              { name: "Alex R.", role: "Owner, TechLounge (120k)", text: "Nyzro stopped a 500-token bot raid in under 1 second. Absolute lifesaver." },
              { name: "Sarah M.", role: "Admin, GamingCentral (450k)", text: "The multi-provider AI vision filter catches fake Nitro QR scams before mods even see them." },
              { name: "DevKev", role: "Founder, CodeX Community", text: "Zero latency issues and the dashboard routing across Gemini & Claude is insanely smooth." },
              { name: "Alex R.", role: "Owner, TechLounge (120k)", text: "Nyzro stopped a 500-token bot raid in under 1 second. Absolute lifesaver." },
              { name: "Sarah M.", role: "Admin, GamingCentral (450k)", text: "The multi-provider AI vision filter catches fake Nitro QR scams before mods even see them." },
            ].map((q, idx) => (
              <div key={idx} className="nyzro-quote-card">
                <div style={{ display: "flex", gap: "3px", color: "var(--red)", marginBottom: "12px" }}>
                  <svg width="14" height="14"><use href="#ic-star"/></svg>
                  <svg width="14" height="14"><use href="#ic-star"/></svg>
                  <svg width="14" height="14"><use href="#ic-star"/></svg>
                  <svg width="14" height="14"><use href="#ic-star"/></svg>
                  <svg width="14" height="14"><use href="#ic-star"/></svg>
                </div>
                <p className="nyzro-quote-text">&ldquo;{q.text}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#2a3040", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>
                    {q.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#fff", fontWeight: 600 }}>{q.name}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-3)" }}>{q.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENTERPRISE PRICING, FAQ & CTA SUITE */}
      <EnterprisePricingSection />

      {/* FOOTER */}
      <footer className="nyzro-footer">
        <div className="nyzro-container">
          <div className="nyzro-footer-grid">
            <div>
              <Link href="/" className="nyzro-nav-logo">
                <svg width="24" height="24" viewBox="0 0 30 30" fill="none">
                  <path d="M15 2 27 8v14L15 28 3 22V8L15 2Z" stroke="#ff3355" strokeWidth="1.6"/>
                  <path d="M10 14.5 15 20l6-9" stroke="#ff3355" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                NYZRO
              </Link>
              <p style={{ fontSize: "13.5px", color: "var(--text-3)", maxWidth: "240px", marginTop: "14px" }}>
                Enterprise AI security & automation platform for Discord communities.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: "11.5px", textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text-3)", fontFamily: "var(--font-mono)", marginBottom: "18px" }}>Product</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <a href="#product" style={{ fontSize: "14px", color: "var(--text-2)", textDecoration: "none" }}>Overview</a>
                <a href="#security" style={{ fontSize: "14px", color: "var(--text-2)", textDecoration: "none" }}>Anti-Raid</a>
                <a href="#modules" style={{ fontSize: "14px", color: "var(--text-2)", textDecoration: "none" }}>AI Router</a>
                <a href="#pricing" style={{ fontSize: "14px", color: "var(--text-2)", textDecoration: "none" }}>Pricing</a>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "11.5px", textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text-3)", fontFamily: "var(--font-mono)", marginBottom: "18px" }}>Resources</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link href="/docs" style={{ fontSize: "14px", color: "var(--text-2)", textDecoration: "none" }}>Documentation</Link>
                <Link href="/privacy" style={{ fontSize: "14px", color: "var(--text-2)", textDecoration: "none" }}>Privacy Policy</Link>
                <Link href="/terms" style={{ fontSize: "14px", color: "var(--text-2)", textDecoration: "none" }}>Terms of Service</Link>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "11.5px", textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text-3)", fontFamily: "var(--font-mono)", marginBottom: "18px" }}>Community</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <a href="https://discord.gg/codexdev" target="_blank" rel="noreferrer" style={{ fontSize: "14px", color: "var(--text-2)", textDecoration: "none" }}>Discord Community</a>
                <a href="https://github.com/RayExo" target="_blank" rel="noreferrer" style={{ fontSize: "14px", color: "var(--text-2)", textDecoration: "none" }}>GitHub</a>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "28px", borderTop: "1px solid var(--line)", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ fontSize: "13px", color: "var(--text-3)" }}>© 2026 CodeX Devs — All Rights Reserved.</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--green)", fontSize: "13px", fontFamily: "var(--font-mono)" }}>
              <span className="nyzro-badge-dot"></span> All Shards Operational (14.2ms)
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
