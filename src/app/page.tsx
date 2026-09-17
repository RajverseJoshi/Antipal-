"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './landing.css';

export default function LandingPage() {
  const router = useRouter();
  
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Cinematic and 3D Animations
  useEffect(() => {
    const cursor = document.getElementById("cinematic-cursor");
    let mx = window.innerWidth * 0.5, my = window.innerHeight * 0.5, cx = mx, cy = my;
    
    const onPointerMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let animationFrameId: number;
    const tick = () => {
      cx += (mx - cx) * 0.08; 
      cy += (my - cy) * 0.08;
      if (cursor) {
        cursor.style.left = cx + "px";
        cursor.style.top = cy + "px";
      }
      animationFrameId = requestAnimationFrame(tick);
    };
    tick();

    const reveal = [
      ...document.querySelectorAll(".section-label,.section h2,.section-description,.value-card,.mood-copy,.mood-card,.private-copy,.private-visual,.step,.guardian-box,.final-cta h2,.final-cta p,.final-cta button")
    ];
    reveal.forEach((el, i) => {
      el.classList.add("cin-reveal");
      if (i % 3 === 1) el.classList.add("cin-delay-1");
      if (i % 3 === 2) el.classList.add("cin-delay-2");
    });
    
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("cin-visible");
      });
    }, { threshold: 0.16 });
    reveal.forEach(el => io.observe(el));

    const hero = document.querySelector(".hero") as HTMLElement;
    const visual = document.querySelector(".hero-visual") as HTMLElement;
    
    const onScroll = () => {
      if (hero && visual) {
        const y = Math.min(window.scrollY, window.innerHeight);
        visual.style.transform = "translate3d(0," + (y * 0.035) + "px,0)";
        hero.style.backgroundPosition = "center " + (y * 0.16) + "px";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    document.querySelectorAll(".value-card,.step,.mood-card,.guardian-box,.privacy-card").forEach(card => {
      const c = card as HTMLElement;
      const onMove = (e: Event) => {
        const ev = e as PointerEvent;
        const r = c.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - 0.5;
        const y = (ev.clientY - r.top) / r.height - 0.5;
        c.style.transform = `perspective(900px) rotateX(${-y * 3}deg) rotateY(${x * 4}deg) translateY(-5px)`;
      };
      const onLeave = () => { c.style.transform = ""; };
      c.addEventListener("pointermove", onMove);
      c.addEventListener("pointerleave", onLeave);
    });
    
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
      io.disconnect();
    };
  }, []);

  // Visual Chapters Canvas Logic
  useEffect(() => {
    const chapters = [...document.querySelectorAll('.antipal-visual-chapter')] as HTMLElement[];
    if (!chapters.length) return;
    const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
    const ease = (v: number) => { v = clamp(v); return v * v * (3 - 2 * v); };
    const stars = Array.from({ length: 130 }, (_, i) => ({ x: (i * 137.7 + 31) % 100, y: (i * 71.3 + 13) % 78, r: 0.5 + (i % 5) * 0.22, phase: i * 1.731, depth: 0.25 + (i % 7) / 10 }));
    
    // Use an array to keep track of state objects
    const states = new Map<HTMLElement, any>();

    chapters.forEach(ch => {
      const canvas = ch.querySelector('.avc-canvas') as HTMLCanvasElement;
      if(!canvas) return;
      const ctx = canvas.getContext('2d');
      if(!ctx) return;
      const state = { W: window.innerWidth, H: window.innerHeight, D: 1, p: 0, target: 0, time: Math.random() * 1000 };
      states.set(ch, state);
      
      const resize = () => {
        state.W = window.innerWidth;
        state.H = window.innerHeight;
        state.D = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = state.W * state.D;
        canvas.height = state.H * state.D;
        canvas.style.width = state.W + 'px';
        canvas.style.height = state.H + 'px';
        ctx.setTransform(state.D, 0, 0, state.D, 0, 0);
      };
      resize();
      window.addEventListener('resize', resize, { passive: true });
      (ch as any)._ctx = ctx;
      (ch as any)._state = state;
    });

    const progress = (ch: HTMLElement) => {
      const r = ch.getBoundingClientRect();
      const travel = Math.max(1, r.height - window.innerHeight);
      return clamp((-r.top) / travel);
    };

    const base = (ctx: CanvasRenderingContext2D, W: number, H: number, p: number, type: string) => {
      let top = '#061318', bottom = '#071812';
      if (type === 'stars') { top = '#020913'; bottom = '#07151a'; }
      if (type === 'waves') { top = '#061217'; bottom = '#061a19'; }
      if (type === 'guardian') { top = '#061318'; bottom = '#071b16'; }
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, top);
      g.addColorStop(1, bottom);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      const warm = ctx.createRadialGradient(W * 0.72, H * 0.24, 0, W * 0.72, H * 0.24, W * 0.5);
      warm.addColorStop(0, `rgba(255,214,166,${0.20 + 0.10 * (1 - p)})`);
      warm.addColorStop(0.55, `rgba(237,196,139,${0.07 + 0.09 * p})`);
      warm.addColorStop(1, 'transparent');
      ctx.fillStyle = warm;
      ctx.fillRect(0, 0, W, H);
    };

    const drawTree = (ctx: CanvasRenderingContext2D, W: number, H: number, p: number) => {
      const s = ease(p), x = W * 0.5, base_y = H * 0.86, top = base_y - 370 * s;
      ctx.save();
      const rootS = ease(p / 0.45);
      ctx.strokeStyle = `rgba(106,177,123,${0.75 * rootS})`;
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      [[-1, 1, -2.8, 3.2], [-0.55, 1, -1.2, 4], [0.5, 1, 1.2, 3.8], [1, 1, 2.8, 3.2], [-0.2, 1, -0.2, 4.4]].forEach(q => {
        ctx.beginPath();
        ctx.moveTo(x, base_y);
        ctx.bezierCurveTo(x + q[0] * 45 * rootS, base_y + q[1] * 22 * rootS, x + q[2] * 52 * rootS, base_y + q[3] * 20 * rootS, x + q[2] * 80 * rootS, base_y + q[3] * 28 * rootS);
        ctx.stroke();
      });
      ctx.strokeStyle = '#547f60';
      ctx.lineWidth = 16 * s + 1;
      ctx.beginPath();
      ctx.moveTo(x, base_y);
      ctx.lineTo(x, top);
      ctx.stroke();
      ctx.lineWidth = 6 * s;
      [[-1, 0.24], [-0.75, 0.42], [0.75, 0.4], [1, 0.24], [-0.4, 0.64], [0.4, 0.68]].forEach(b => {
        ctx.beginPath();
        ctx.moveTo(x, base_y - (base_y - top) * b[1]);
        ctx.quadraticCurveTo(x + b[0] * 60 * s, base_y - (base_y - top) * (b[1] + 0.06), x + b[0] * 145 * s, base_y - (base_y - top) * (b[1] + 0.01));
        ctx.stroke();
      });
      const n = Math.floor(5 + 95 * s);
      for (let i = 0; i < n; i++) {
        const a = i * 2.399, rx = (35 + 105 * Math.sin(i * 1.17)) * s, ry = (25 + 88 * Math.cos(i * 1.53)) * s;
        ctx.fillStyle = `rgba(${78 + Math.floor(45 * s)},${145 + Math.floor(60 * s)},${100 + Math.floor(35 * s)},${0.35 + 0.58 * s})`;
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * rx, top + Math.sin(a) * ry, 4 + 8 * s, 0, Math.PI * 2);
        ctx.fill();
      }
      const glow = ctx.createRadialGradient(x, top, 2, x, top, 200 * s);
      glow.addColorStop(0, `rgba(155,224,177,${0.12 + 0.12 * s})`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(x - 220, top - 220, 440, 440);
      ctx.restore();
    };

    const drawStars = (ctx: CanvasRenderingContext2D, W: number, H: number, p: number, t: number) => {
      const reveal = ease(p / 0.25);
      const moon = ctx.createRadialGradient(W * 0.73, H * 0.24, 2, W * 0.73, H * 0.24, 90);
      moon.addColorStop(0, 'rgba(235,246,237,.18)');
      moon.addColorStop(1, 'transparent');
      ctx.fillStyle = moon;
      ctx.fillRect(W * 0.73 - 120, H * 0.24 - 120, 240, 240);
      stars.forEach((s, i) => {
        const tw = 0.45 + 0.55 * Math.sin(t * 0.0014 * (0.7 + s.depth) + s.phase);
        const x = s.x / 100 * W + Math.sin(t * 0.00018 + s.phase) * 9 * s.depth, y = s.y / 100 * H;
        ctx.globalAlpha = (0.10 + 0.55 * tw) * reveal;
        ctx.fillStyle = '#e6f6ec';
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2); ctx.fill();
        if (i % 18 === 0) {
          ctx.globalAlpha = 0.16 * tw * reveal;
          ctx.strokeStyle = '#dff3e6';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x + 6, y); ctx.moveTo(x, y - 6); ctx.lineTo(x, y + 6); ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;
    };

    const drawHands = (ctx: CanvasRenderingContext2D, W: number, H: number, p: number, t: number) => {
      const s = ease(p), gap = 65 * (1 - s), y = H * 0.63;
      ctx.save();
      ctx.strokeStyle = '#ddc7b4'; ctx.lineWidth = 17; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(W * 0.28, y + 78); ctx.bezierCurveTo(W * 0.37, y + 22, W * 0.43, y + 5, W * 0.5 - gap * 0.5, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W * 0.72, y + 78); ctx.bezierCurveTo(W * 0.63, y + 22, W * 0.57, y + 5, W * 0.5 + gap * 0.5, y); ctx.stroke();
      ctx.strokeStyle = '#f1dac5'; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(W * 0.5 - gap * 0.5, y); ctx.lineTo(W * 0.5 - gap * 0.18, y - 3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W * 0.5 + gap * 0.5, y); ctx.lineTo(W * 0.5 + gap * 0.18, y - 3); ctx.stroke();
      if (s > 0.72) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.003);
        const g = ctx.createRadialGradient(W * 0.5, y, 1, W * 0.5, y, 75);
        g.addColorStop(0, `rgba(191,237,207,${0.28 + 0.16 * pulse})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(W * 0.5 - 80, y - 80, 160, 160);
      }
      ctx.restore();
    };

    const drawSmallWins = (ctx: CanvasRenderingContext2D, W: number, H: number, p: number, t: number) => {
      const cx = W * 0.67, cy = H * 0.53, R = Math.min(W, H) * 0.24;
      const sparks = [{ a: -1.75, r: 1.00 }, { a: -1.10, r: 0.86 }, { a: -0.42, r: 1.08 }, { a: 0.18, r: 0.92 }, { a: 0.78, r: 1.03 }, { a: 1.38, r: 0.84 }, { a: 2.10, r: 1.00 }];
      ctx.save();
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.00105);
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 2.2);
      glow.addColorStop(0, `rgba(255,218,174,${0.075 + 0.025 * pulse})`);
      glow.addColorStop(0.38, `rgba(255,225,190,${0.028 + 0.015 * pulse})`);
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - R * 2.5, cy - R * 2.5, R * 5, R * 5);
      const first = ease(p / 0.14);
      if (first > 0) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 52);
        g.addColorStop(0, `rgba(255,237,207,${0.65 * first})`);
        g.addColorStop(0.18, `rgba(255,211,161,${0.16 * first})`);
        g.addColorStop(1, "rgba(255,211,161,0)");
        ctx.fillStyle = g;
        ctx.fillRect(cx - 60, cy - 60, 120, 120);
        ctx.fillStyle = `rgba(255,241,216,${0.95 * first})`;
        ctx.beginPath(); ctx.arc(cx, cy, 4.5 + 1.5 * pulse, 0, Math.PI * 2); ctx.fill();
      }
      
      const orbit = ease((p - 0.08) / 0.44);
      const live: any[] = [];
      sparks.forEach((s, i) => {
        const q = ease(clamp((orbit - i * 0.095) / 0.34));
        if (q <= 0) return;
        const angle = s.a + (1 - q) * 0.7 + t * 0.000045 * (i % 2 ? 1 : -1);
        const tx = cx + Math.cos(angle) * R * s.r, ty = cy + Math.sin(angle) * R * s.r * 0.72;
        const x = cx + (tx - cx) * q, y = cy + (ty - cy) * q;
        live.push({ x, y, q });
        const breathe = 0.5 + 0.5 * Math.sin(t * 0.0017 + i * 1.3);
        const rg = ctx.createRadialGradient(x, y, 0, x, y, 38 + 12 * breathe);
        rg.addColorStop(0, `rgba(255,227,189,${0.45 * q})`);
        rg.addColorStop(0.24, `rgba(255,204,151,${0.12 * q})`);
        rg.addColorStop(1, "rgba(255,204,151,0)");
        ctx.fillStyle = rg;
        ctx.fillRect(x - 52, y - 52, 104, 104);
        ctx.fillStyle = `rgba(255,239,214,${0.94 * q})`;
        ctx.beginPath(); ctx.arc(x, y, 4.1 + 1.1 * breathe, 0, Math.PI * 2); ctx.fill();
      });

      const connect = ease((p - 0.46) / 0.20);
      if (connect > 0 && live.length > 1) {
        ctx.lineCap = "round"; ctx.lineWidth = 1;
        for (let i = 0; i < live.length - 1; i++) {
          const a = live[i], b = live[i + 1];
          const q = ease(clamp(connect * 1.3 - i * 0.10));
          if (q <= 0) continue;
          const ex = a.x + (b.x - a.x) * q, ey = a.y + (b.y - a.y) * q;
          ctx.strokeStyle = `rgba(231,205,166,${0.20 * q})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.quadraticCurveTo((a.x + ex) / 2, (a.y + ey) / 2 - 8, ex, ey); ctx.stroke();
        }
      }

      const rise = ease((p - 0.64) / 0.28);
      if (rise > 0) {
        sparks.forEach((s, i) => {
          const q = ease(clamp((rise - i * 0.065) / 0.45));
          if (q <= 0) return;
          const sx = cx + Math.cos(s.a) * R * s.r, sy = cy + Math.sin(s.a) * R * s.r * 0.72;
          const x = sx + Math.sin(t * 0.001 + i) * 8 * q, y = sy - 82 * q;
          ctx.strokeStyle = `rgba(238,207,165,${0.10 * q})`; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + 8 * Math.sin(i), sy - 42 * q, x, y); ctx.stroke();
          ctx.save(); ctx.translate(x, y); ctx.rotate(-0.55 + Math.sin(i * 1.8) * 0.18);
          ctx.fillStyle = `rgba(123,174,127,${0.24 + 0.38 * q})`; ctx.beginPath(); ctx.ellipse(0, 0, 10 * q, 4.2 * q, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        });
      }

      const finale = ease((p - 0.84) / 0.16);
      if (finale > 0) {
        const streamTop = cy - R * 0.95;
        const streamG = ctx.createRadialGradient(cx, streamTop, 0, cx, streamTop, 100);
        streamG.addColorStop(0, `rgba(255,228,192,${0.14 * finale})`); streamG.addColorStop(1, "rgba(255,228,192,0)");
        ctx.fillStyle = streamG; ctx.fillRect(cx - 130, streamTop - 130, 260, 260);
        for (let i = 0; i < 7; i++) {
          const q = clamp(finale - i * 0.08);
          if (q <= 0) continue;
          const x = cx + Math.sin(i * 2.1 + t * 0.0007) * 18 * q, y = cy - R * 0.45 - i * 18 * q;
          ctx.fillStyle = `rgba(255,235,205,${0.38 * q})`; ctx.beginPath(); ctx.arc(x, y, 2.5 + 2 * q, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();
    };

    const drawGuardian = (ctx: CanvasRenderingContext2D, W: number, H: number, p: number, t: number) => {
      const s = ease(p), pulse = 0.5 + 0.5 * Math.sin(t * 0.0017);
      const g = ctx.createRadialGradient(W * 0.5, H * 0.52, 50, W * 0.5, H * 0.52, W * 0.5);
      g.addColorStop(0, `rgba(255,221,174,${0.18 + 0.08 * pulse})`); g.addColorStop(0.6, 'rgba(245,190,125,.06)'); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = `rgba(255,215,166,${0.28 + 0.10 * pulse})`; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.56, W * 0.34 * s, H * 0.42 * s, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = `rgba(200,240,215,${0.08 + 0.04 * pulse})`;
      ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.56, W * 0.29 * s, H * 0.36 * s, 0, 0, Math.PI * 2); ctx.stroke();
    };

    const render = (ch: HTMLElement) => {
      const st = (ch as any)._state;
      const ctx = (ch as any)._ctx as CanvasRenderingContext2D;
      if(!ctx || !st) return;
      const p = st.p, W = st.W, H = st.H, type = ch.dataset.effect;
      ctx.clearRect(0, 0, W, H);
      base(ctx, W, H, p, type || '');
      if (type === 'tree') drawTree(ctx, W, H, p);
      if (type === 'stars') drawStars(ctx, W, H, p, st.time);
      if (type === 'hands') drawHands(ctx, W, H, p, st.time);
      if (type === 'smallwins') drawSmallWins(ctx, W, H, p, st.time);
      if (type === 'guardian') drawGuardian(ctx, W, H, p, st.time);
      
      const pIndicator = ch.querySelector('.avc-progress i') as HTMLElement;
      if (pIndicator) pIndicator.style.height = (p * 100) + '%';
    };

    let rId: number;
    const loop = (now: number) => {
      chapters.forEach(ch => {
        const st = (ch as any)._state;
        if(st) {
          st.time = now;
          st.target = progress(ch);
          st.p = st.target;
          render(ch);
        }
      });
      rId = requestAnimationFrame(loop);
    };
    rId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rId);
  }, []);

  // Set mood initial
  useEffect(() => {
    const savedMood = localStorage.getItem("antipalLandingMood");
    if (savedMood) {
      setSelectedMood(savedMood);
    }
  }, []);

  const selectLandingMood = (mood: string) => {
    setSelectedMood(mood);
    localStorage.setItem("antipalLandingMood", mood);
  };

  const antipalMoodMessages: Record<string, any> = {
    good: { icon: "😊", title: "That's good to hear.", text: "Hold on to whatever is helping you feel this way." },
    okay: { icon: "🙂", title: "Okay is okay.", text: "You don't have to feel amazing every day." },
    meh: { icon: "😐", title: "A little off is still worth noticing.", text: "Let's take one small step instead of fixing everything." },
    low: { icon: "😔", title: "Thank you for being honest.", text: "You don't have to handle a difficult moment by yourself." },
    overwhelmed: { icon: "😣", title: "Let's slow things down.", text: "You don't need to solve everything right now. One moment at a time." }
  };

  const renderMoodResult = () => {
    const data = selectedMood ? antipalMoodMessages[selectedMood] : null;
    if (!data) {
      return (
        <div className="mood-result" id="moodResult">
          <span className="mood-result-icon">🌱</span>
          <div>
            <strong id="moodResultTitle">No right or wrong answer.</strong>
            <span id="moodResultText">Just be honest with yourself.</span>
          </div>
        </div>
      );
    }
    return (
      <div className="mood-result" id="moodResult">
        <span className="mood-result-icon">{data.icon}</span>
        <div>
          <strong id="moodResultTitle">{data.title}</strong>
          <span id="moodResultText">{data.text}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="landing-wrapper">
      <div className="page">
      <div id="cinematic-cursor" />

      {/* NAVBAR */}
      <header className="navbar">
        <a href="#" className="logo">
          <div className="logo-mark">A</div>
          <span>Antipal</span>
        </a>

        <nav className={`nav-links ${isMobileNavOpen ? 'mobile-open' : ''}`}>
          <a href="#why">Why Antipal</a>
          <a href="#how">How it works</a>
          <a href="#guardian">Guardian</a>
        </nav>

        <div className="nav-actions">
          <Link href="/login" className="login-btn">Log in</Link>
          <Link href="/register" className="signup-btn">Get started</Link>
          <button className="menu-btn" onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}>☰</button>
        </div>
      </header>

      {/* HERO */}
      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <i /> A QUIET PLACE TO BE YOURSELF
            </div>

            <h1>
              You don&apos;t have to <em>carry it alone.</em>
            </h1>

            <p className="hero-description">
              Antipal is a private space where you can talk freely,
              understand what you&apos;re feeling, take small steps forward,
              and find support when you need it.
            </p>

            <div className="hero-actions">
              <Link href="/register" className="hero-primary">
                Start your journey →
              </Link>

              <button className="hero-secondary" onClick={() => {
                const el = document.getElementById('how');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>
                See how it works
              </button>
            </div>

            <p className="hero-note">
              No judgment · No pressure · Just a place to start
            </p>
          </div>

          <div className="hero-visual">
            <div className="visual-glow" />

            <div className="float-card float-one">
              <div className="float-icon">🌱</div>
              <strong>Small steps matter</strong>
              <span>Progress doesn&apos;t have to be big.</span>
            </div>

            <div className="chat-card">
              <div className="chat-head">
                <div className="ai-info">
                  <div className="ai-avatar">✦</div>
                  <div className="ai-name">
                    <strong>Antipal</strong>
                    <span>Your AI companion</span>
                  </div>
                </div>
                <span className="online">● Here for you</span>
              </div>

              <div className="chat-body">
                <div className="chat-intro">
                  You can start anywhere.
                </div>
                <div className="message ai">
                  Hey. I&apos;m here with you.
                  You don&apos;t need the perfect words.
                  What&apos;s going on?
                </div>
                <div className="message user">
                  I don&apos;t really know how to explain it.
                </div>
                <div className="message ai">
                  That&apos;s okay. We can take it slowly.
                  You can tell me just one small thing.
                </div>

                <div className="chat-options">
                  <Link href="/register" className="chat-option text-center block">
                    I feel overwhelmed
                  </Link>
                  <Link href="/register" className="chat-option text-center block">
                    I feel lonely
                  </Link>
                  <Link href="/register" className="chat-option text-center block">
                    I just need someone to listen
                  </Link>
                </div>
              </div>

              <div className="chat-footer">
                Your conversations are private and designed around your wellbeing.
              </div>
            </div>

            <div className="float-card float-two">
              <div className="float-icon">🛡️</div>
              <strong>You&apos;re not alone</strong>
              <span>Support is part of the journey.</span>
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="antipal-visual-chapter avc-tree" data-effect="tree" aria-label="Recovery Tree chapter">
          <div className="avc-sticky">
            <canvas className="avc-canvas" />
            <div className="avc-shade" />
            <div className="avc-number">JOURNEY <b>01</b></div>
            <div className="avc-copy">
              <span className="avc-kicker">ANTIPAL · GROW</span>
              <span className="avc-title">Look how far you&apos;ve grown.</span>
              <span className="avc-text">Small things become roots. Roots become strength. Your Recovery Tree grows with you.</span>
            </div>
            <div className="avc-progress"><i /></div>
          </div>
        </section>

        <div className="trust">
          <div className="trust-inner">
            <span>PRIVATE BY DESIGN</span>
            <span>NON-JUDGMENTAL</span>
            <span>SMALL STEPS</span>
            <span>SAFETY-FIRST</span>
          </div>
        </div>

        {/* WHY */}
        <section className="antipal-visual-chapter avc-stars" data-effect="stars" aria-label="Stars chapter">
          <div className="avc-sticky">
            <canvas className="avc-canvas" />
            <div className="avc-shade" />
            <div className="avc-number">JOURNEY <b>02</b></div>
            <div className="avc-copy">
              <span className="avc-kicker">ANTIPAL · PAUSE</span>
              <span className="avc-title">Even quiet moments have light.</span>
              <span className="avc-text">Slow down. Look up. Some progress is quiet enough to feel like a single star in a wide sky.</span>
            </div>
            <div className="avc-progress"><i /></div>
          </div>
        </section>

        <section className="section" id="why">
          <div className="section-label">WHY ANTIPAL</div>
          <h2>A space built for the things<br />you don&apos;t always say out loud.</h2>
          <p className="section-description">
            Sometimes talking to another person feels difficult.
            Antipal gives you a simple first place to put your thoughts,
            without pressure to explain everything at once.
          </p>

          <div className="values">
            <div className="value-card">
              <div className="value-icon">💬</div>
              <h3>Talk freely</h3>
              <p>
                Start a conversation whenever you need to let something out.
                You can begin with just a few words.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Small wins</h3>
              <p>
                Instead of constantly measuring yourself, focus on one
                small, manageable thing you can do today.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🛡️</div>
              <h3>Guardian matters</h3>
              <p>
                When someone may need additional support, Antipal is designed
                to help connect them with a trusted person.
              </p>
            </div>
          </div>
        </section>

        {/* MOOD CHECK */}
        <section className="mood-section" id="mood-check">
          <div className="mood-inner">
            <div className="mood-copy">
              <div className="section-label">A SMALL CHECK-IN</div>
              <h2>How are you feeling<br />right now?</h2>
              <p>
                You don&apos;t need to explain everything. Just choose what feels
                closest, and we&apos;ll take the next step from there.
              </p>
              {renderMoodResult()}
            </div>

            <div className="mood-card">
              <div className="mood-card-top">
                <span>RIGHT NOW</span>
                <span id="moodDate">{new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }).toUpperCase()}</span>
              </div>
              <div className="mood-question">What feels closest to you?</div>
              <div className="mood-options">
                {[
                  { id: 'good', icon: '😊', label: 'Good', sub: "I'm doing okay" },
                  { id: 'okay', icon: '🙂', label: 'Okay', sub: "Could be better" },
                  { id: 'meh', icon: '😐', label: 'Meh', sub: "Feeling a little off" },
                  { id: 'low', icon: '😔', label: 'Low', sub: "It's been difficult" },
                  { id: 'overwhelmed', icon: '😣', label: 'Overwhelmed', sub: "Everything feels heavy" },
                ].map(m => (
                  <button 
                    key={m.id}
                    className={`mood-option ${selectedMood === m.id ? 'selected' : ''}`}
                    onClick={() => selectLandingMood(m.id)}
                  >
                    <span>{m.icon}</span>
                    <strong>{m.label}</strong>
                    <small>{m.sub}</small>
                  </button>
                ))}
              </div>
              <button className="mood-talk-btn" onClick={() => {
                if (!selectedMood) {
                  const el = document.getElementById("moodResult");
                  if (el) el.animate([
                    {transform:"translateX(0)"},
                    {transform:"translateX(-5px)"},
                    {transform:"translateX(5px)"},
                    {transform:"translateX(0)"}
                  ], {duration:260});
                } else {
                  router.push('/register');
                }
              }}>
                Want to talk about it? →
              </button>
              <div className="mood-private-note">
                Your check-in stays on this device in this prototype.
              </div>
            </div>
          </div>
        </section>

        {/* PRIVATE SPACE */}
        <section className="private-section" id="private-space">
          <div className="private-inner">
            <div className="private-visual">
              <div className="privacy-orbit orbit-one" />
              <div className="privacy-orbit orbit-two" />
              <div className="privacy-card">
                <div className="privacy-lock">🔒</div>
                <span>YOUR SPACE</span>
                <strong>You can be honest here.</strong>
                <p>No need to pretend you&apos;re okay. No pressure to have the right words.</p>
                <div className="privacy-status">
                  <i /> Your space is ready
                </div>
              </div>
            </div>

            <div className="private-copy">
              <div className="section-label">YOUR PRIVATE SPACE</div>
              <h2>A place where you<br />can be honest.</h2>
              <p>
                Sometimes the hardest part is telling someone how you really
                feel. Antipal gives you a quiet place to start without
                judgment or pressure.
              </p>
              <div className="privacy-points">
                <div className="privacy-point">
                  <div className="privacy-point-icon">🔐</div>
                  <div>
                    <strong>Private by design</strong>
                    <span>Your personal space is built around privacy.</span>
                  </div>
                </div>
                <div className="privacy-point">
                  <div className="privacy-point-icon">🤝</div>
                  <div>
                    <strong>You choose your support</strong>
                    <span>You decide who you trust before trusted-person support is used.</span>
                  </div>
                </div>
                <div className="privacy-point">
                  <div className="privacy-point-icon">🌿</div>
                  <div>
                    <strong>No pressure</strong>
                    <span>Take your time. Antipal is there when you need it.</span>
                  </div>
                </div>
              </div>
              <Link href="/register" className="private-cta block text-center">
                Create your private space →
              </Link>
            </div>
          </div>
        </section>

        {/* HOW */}
        <section className="antipal-visual-chapter avc-hands" data-effect="hands" aria-label="Connection chapter">
          <div className="avc-sticky">
            <canvas className="avc-canvas" />
            <div className="avc-shade" />
            <div className="avc-number">JOURNEY <b>05</b></div>
            <div className="avc-copy">
              <span className="avc-kicker">ANTIPAL · SUPPORT</span>
              <span className="avc-title">You don&apos;t have to reach alone.</span>
              <span className="avc-text">Support gets closer. Two hands move toward each other until connection becomes a small light.</span>
            </div>
            <div className="avc-progress"><i /></div>
          </div>
        </section>

        <section className="how" id="how">
          <div className="how-inner section">
            <div className="section-label">HOW IT WORKS</div>
            <h2>Start wherever you are.</h2>
            <p className="section-description">
              There is no complicated process. Antipal is designed to make
              the first step feel easy.
            </p>
            <div className="steps">
              <div className="step">
                <div className="step-number">01 — TALK</div>
                <h3>Tell Antipal what&apos;s going on</h3>
                <p>Write naturally. You don&apos;t need to organize your thoughts before starting.</p>
              </div>
              <div className="step">
                <div className="step-number">02 — RESET</div>
                <h3>Find something that helps</h3>
                <p>Use calming exercises, music, reflection, or a small daily step when talking isn&apos;t what you need.</p>
              </div>
              <div className="step">
                <div className="step-number">03 — GROW</div>
                <h3>Build your recovery journey</h3>
                <p>Your small wins become progress, represented through your personal Recovery Tree.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SAFETY */}
        <section className="antipal-visual-chapter avc-smallwins" data-effect="smallwins" aria-label="Small Wins chapter">
          <div className="avc-sticky">
            <canvas className="avc-canvas" />
            <div className="avc-shade" />
            <div className="avc-number">JOURNEY <b>06</b></div>
            <div className="avc-copy">
              <span className="avc-kicker">ANTIPAL · SMALL WINS</span>
              <span className="avc-title">Small things become momentum.</span>
              <span className="avc-text">Seven small actions. Seven little signs of progress. One day at a time.</span>
            </div>
            <div className="avc-progress"><i /></div>
          </div>
        </section>

        <section className="section" id="guardian">
          <div className="section-label">SAFETY</div>
          <h2>Support should never<br />feel too far away.</h2>
          <p className="section-description">
            Antipal is designed with a guardian layer for moments when
            someone may need more than an AI conversation.
          </p>
          <div className="guardian-box">
            <div className="guardian-icon">🛡️</div>
            <div>
              <h3>Trusted-person support</h3>
              <p>
                With the user&apos;s permission, a trusted person can be part
                of their guardian network. The future guardian system can
                identify situations that may require additional support
                and help connect the person to someone they trust.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="antipal-visual-chapter avc-guardian" data-effect="guardian" aria-label="Guardian chapter">
          <div className="avc-sticky">
            <canvas className="avc-canvas" />
            <div className="avc-shade" />
            <div className="avc-number">JOURNEY <b>07</b></div>
            <div className="avc-copy">
              <span className="avc-kicker">ANTIPAL · GUARDIAN</span>
              <span className="avc-title">Keep someone close.</span>
              <span className="avc-text">When you need more than an AI conversation, Guardian helps keep trusted human support within reach.</span>
            </div>
            <div className="avc-progress"><i /></div>
          </div>
        </section>

        <section className="final-cta">
          <h2>You can start with one sentence.</h2>
          <p>
            You don&apos;t have to know exactly what you need.
            Just start somewhere, and take the next small step from there.
          </p>
          <Link href="/register" className="hero-primary">
            Create your space →
          </Link>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-simple-grid">
            <div className="footer-simple-brand">
              <a href="#top" className="footer-logo">
                <span className="footer-mark">A</span>
                <span>Antipal</span>
              </a>
              <p className="footer-tagline">“Surrounding presence in your loneliness.”</p>
              <button className="footer-about-btn" onClick={() => setIsAboutOpen(true)}>About Us <span>→</span></button>
            </div>
            <div className="footer-vision">
              <div className="footer-heading">OUR VISION</div>
              <p>We believe nobody should feel like they have to carry everything alone.</p>
              <p>Antipal is being built as a quiet, private space where people can talk freely, take small steps forward, and find support when they need it.</p>
            </div>
            <div className="footer-social">
              <div className="footer-heading">CONNECT WITH US</div>
              <a href="#">Instagram <span>@antipal</span> ↗</a>
              <a href="#">LinkedIn <span>Antipal</span> ↗</a>
              <a href="#">X <span>@antipal</span> ↗</a>
            </div>
          </div>
          <div className="footer-bottom-simple">
            <span>© {new Date().getFullYear()} Antipal</span>
            <span>Made with care by Tanmay &amp; Daksh</span>
          </div>
        </div>
      </footer>

      {/* ABOUT MODAL */}
      <div className={`about-overlay ${isAboutOpen ? 'show' : ''}`} id="aboutModal" onClick={(e) => {
        if ((e.target as HTMLElement).id === "aboutModal") setIsAboutOpen(false);
      }}>
        <div className="about-modal" role="dialog" aria-modal="true" aria-labelledby="aboutTitle">
          <button className="about-close" onClick={() => setIsAboutOpen(false)} aria-label="Close">×</button>
          <div className="about-label">ABOUT ANTIPAL</div>
          <h2 className="about-title" id="aboutTitle">Built because nobody should feel alone.</h2>
          <p className="about-intro">Antipal is our attempt to create a quiet, private space where people can talk about what they are going through, take small steps forward, and feel a little less alone.</p>
          <div className="about-tagline">“Surrounding presence in your loneliness.”</div>
          <div className="about-story">
            <h3>Why we started Antipal</h3>
            <p>We believe that sometimes people find it easier to open up when there is no fear of judgment. Antipal was created to provide a supportive first place to talk, reflect, and find a path toward human connection when it is needed.</p>
          </div>
          <div className="founders">
            <div className="founder">
              <div className="founder-avatar">T</div>
              <div className="founder-role">FOUNDER</div>
              <h3>Tanmay</h3>
              <p>Tanmay is the Founder of Antipal, helping shape the vision, direction, and purpose behind the project.</p>
            </div>
            <div className="founder">
              <div className="founder-avatar">D</div>
              <div className="founder-role">CO-FOUNDER</div>
              <h3>Daksh</h3>
              <p>Daksh is the Co-Founder of Antipal, working alongside Tanmay to build the product and turn the idea into a real experience.</p>
            </div>
          </div>
          <div className="about-bottom">We are building Antipal with one simple belief:<br /><strong>sometimes, having a place to talk is the first small step.</strong></div>
        </div>
      </div>
      </div>
    </div>
  );
}
