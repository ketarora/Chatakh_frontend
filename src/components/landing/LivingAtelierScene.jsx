import { useEffect, useRef } from "react";

/**
 * CHATAKH CREATIONS — "Woven for the Unhurried"
 * A living atelier scene rendered on canvas, on-brand:
 * - A flowing fabric river (khadi drape) shimmering with thread light
 * - Weaving warp threads that drift like a loom in motion
 * - Running stitches that periodically "stitch" across the scene
 * - Threads / spool dust motes floating in the air
 * - A scattered patchwork of fabric patches in brand colors
 * Pure canvas (no deps). Brand palette: navy, rust, ivory, gold.
 */

const LivingAtelierScene = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = 0;
    let H = 0;
    let raf = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const COLORS = {
      navy: "#0F1621",
      rust: "#C45D3E",
      ivory: "#FAF7F2",
      cream: "#F0EBE3",
      gold: "#D4A574",
    };

    // ---------- resize ----------
    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      initWarp();
      initFabric();
      initPatches();
    };

    // ---------- warp threads (vertical loom threads) ----------
    let warp = [];
    const initWarp = () => {
      warp = Array.from({ length: 120 }, (_, i) => ({
        x: (W / 120) * i + (Math.random() - 0.5) * 6,
        sway: 4 + Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0004 + Math.random() * 0.0008,
        alpha: 0.1 + Math.random() * 0.2,
        hue: Math.random() > 0.5 ? "196, 93, 62" : "212, 165, 116",
      }));
    };

    // ---------- fabric river (horizontal flowing bands) ----------
    let fabric = [];
    const initFabric = () => {
      fabric = Array.from({ length: 70 }, () => ({
        y: H * (0.6 + Math.random() * 0.38),
        len: 60 + Math.random() * 220,
        speed: 0.6 + Math.random() * 1.8,
        x: Math.random() * W,
        alpha: 0.06 + Math.random() * 0.16,
        wave: 6 + Math.random() * 14,
        hue: [0.55, 0.7, 0.85, 1][Math.floor(Math.random() * 4)],
      }));
    };

    // ---------- patchwork fabric patches ----------
    let patches = [];
    const initPatches = () => {
      const palette = [COLORS.rust, COLORS.gold, COLORS.ivory, COLORS.cream];
      patches = Array.from({ length: 26 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H * 0.7,
        w: 30 + Math.random() * 70,
        h: 30 + Math.random() * 70,
        rot: (Math.random() - 0.5) * 0.5,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 0.05 + Math.random() * 0.1,
        drift: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    // ---------- stitches (dashed running stitches) ----------
    let stitches = [];
    const initStitches = () => {
      stitches = Array.from({ length: 12 }, () => ({
        y: Math.random() * H,
        x: Math.random() * W,
        len: 100 + Math.random() * 200,
        speed: 0.4 + Math.random() * 0.8,
        dash: 6 + Math.random() * 6,
      }));
    };

    // ---------- thread motes (floating dust/threads) ----------
    let motes = [];
    const initMotes = () => {
      motes = Array.from({ length: 50 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.6 + Math.random() * 1.8,
        speed: 0.12 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        drift: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.5 ? "212, 165, 116" : "250, 247, 242",
      }));
    };

    // ---------- draw background ----------
    const drawBackground = () => {
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#151e2b");
      bg.addColorStop(0.6, "#0f1621");
      bg.addColorStop(1, "#0b1019");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // subtle fabric grain
      ctx.globalAlpha = 0.04;
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i % 2 ? COLORS.ivory : COLORS.rust;
        for (let y = 0; y < H; y += 4) {
          ctx.fillRect((i * 17) % 40, y, 1, 2);
        }
      }
      ctx.globalAlpha = 1;
    };

    // ---------- weave patches ----------
    const drawPatches = (t) => {
      patches.forEach((p) => {
        p.phase += p.drift * 0.001;
        const ox = Math.sin(p.phase) * 6;
        const oy = Math.cos(p.phase * 0.8) * 4;
        ctx.save();
        ctx.translate(p.x + ox, p.y + oy);
        ctx.rotate(p.rot + Math.sin(p.phase) * 0.05);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        // stitch border
        ctx.globalAlpha = p.alpha * 1.6;
        ctx.strokeStyle = COLORS.navy;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
    };

    // ---------- warp threads ----------
    const drawWarp = (t) => {
      warp.forEach((w) => {
        const sway = Math.sin(t * w.speed + w.phase) * w.sway;
        ctx.globalAlpha = w.alpha;
        ctx.strokeStyle = `rgba(${w.hue}, 0.6)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w.x + sway, 0);
        ctx.quadraticCurveTo(w.x + sway * 1.5, H * 0.5, w.x + sway, H);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    };

    // ---------- fabric river ----------
    const drawFabric = (t) => {
      fabric.forEach((f, i) => {
        const x = (f.x + t * 0.01 * f.speed) % (W + f.len) - f.len;
        const wave = Math.sin(i + t * 0.002) * f.wave;
        ctx.globalAlpha = f.alpha;
        ctx.strokeStyle = `rgba(212, 165, 116, 0.6)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, f.y);
        ctx.quadraticCurveTo(x + f.len * 0.5, f.y + wave, x + f.len, f.y);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    };

    // ---------- running stitches ----------
    const drawStitches = (t) => {
      stitches.forEach((s) => {
        const progress = (t * s.speed + s.x) % s.len;
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = COLORS.rust;
        ctx.setLineDash([s.dash, s.dash]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x - s.len / 2 + progress, s.y);
        ctx.lineTo(s.x - s.len / 2 + progress + s.len, s.y + Math.sin(t * 0.001 + s.y) * 4);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
    };

    // ---------- motes ----------
    const drawMotes = (t) => {
      motes.forEach((m, i) => {
        const mx = m.x + Math.sin(m.phase + t * 0.0004) * 22;
        const my = m.y + Math.cos(m.drift + t * 0.0003) * 16;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(m.phase * 2 + t * 0.002));
        ctx.globalAlpha = tw * 0.6;
        ctx.fillStyle = i % 3 === 0 ? "rgba(212, 165, 116, 1)" : "rgba(250, 247, 242, 0.8)";
        ctx.beginPath();
        ctx.arc(mx, my, m.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    // ---------- main draw ----------
    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      drawBackground();
      drawPatches(t);
      drawWarp(t);
      drawFabric(t);
      drawStitches(t);
      drawMotes(t);
      raf = requestAnimationFrame(draw);
    };

    resize();
    initStitches();
    initMotes();
    initPatches();
    initWarp();
    initFabric();

    raf = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="living-scene-canvas" aria-hidden="true" />;
};

export default LivingAtelierScene;
