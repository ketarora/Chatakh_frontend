import { useEffect, useRef } from "react";

const ThreadCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let threads = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initThreads = () => {
      const count = Math.min(48, Math.floor(window.innerWidth / 28));
      threads = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: 18 + Math.random() * 40,
        speed: 0.15 + Math.random() * 0.35,
        angle: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.008,
        opacity: 0.08 + Math.random() * 0.18,
        hue: Math.random() > 0.5 ? "#C45D3E" : "#D4A574",
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      threads.forEach((t) => {
        t.x += Math.cos(t.angle) * t.speed;
        t.y += Math.sin(t.angle) * t.speed;
        t.angle += t.drift;

        if (t.x < -60) t.x = canvas.width + 60;
        if (t.x > canvas.width + 60) t.x = -60;
        if (t.y < -60) t.y = canvas.height + 60;
        if (t.y > canvas.height + 60) t.y = -60;

        ctx.save();
        ctx.globalAlpha = t.opacity;
        ctx.strokeStyle = t.hue;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(
          t.x + Math.cos(t.angle) * t.length,
          t.y + Math.sin(t.angle) * t.length
        );
        ctx.stroke();
        ctx.restore();
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    initThreads();
    draw();

    window.addEventListener("resize", () => {
      resize();
      initThreads();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="thread-canvas" aria-hidden="true" />;
};

export default ThreadCanvas;
