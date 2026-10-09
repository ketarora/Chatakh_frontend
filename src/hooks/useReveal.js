import { useEffect, useRef, useState } from "react";

// Adds .revealed when element scrolls into view.
// Usage: <div ref={ref} className={`reveal ${visible ? "revealed" : ""}`}>
export const useReveal = (options = {}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const { threshold = 0.12, once = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  return [ref, visible];
};

// Vanilla 3D tilt — no dependency, buttery + light.
export const useTilt = (max = 10) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = null;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateY(-4px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
    };
    el.style.transition = "transform .12s ease-out";
    el.style.willChange = "transform";
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [max]);

  return ref;
};
