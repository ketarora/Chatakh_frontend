import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { getProductImage } from "../../utils/images";

const ProductShowcase = ({ products }) => {
  const navigate = useNavigate();
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const rafRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [paused, setPaused] = useState(false);

  // Slow auto-scroll marquee that pauses on hover/drag
  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    let speed = 0.6; // px per frame — slow, elegant drift

    const step = () => {
      if (!paused && !isDownRef.current && track.scrollWidth > wrap.clientWidth) {
        wrap.scrollLeft += speed;
        // seamless loop
        if (wrap.scrollLeft >= wrap.scrollWidth - wrap.clientWidth) {
          wrap.scrollLeft = 0;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, products]);

  // drag to scroll (always available)
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    wrap.style.cursor = "grab";

    const onPointerDown = (e) => {
      isDownRef.current = true;
      setDragActive(true);
      setPaused(true);
      wrap.setPointerCapture?.(e.pointerId);
      startXRef.current = e.pageX - wrap.offsetLeft;
      scrollLeftRef.current = wrap.scrollLeft;
      wrap.style.cursor = "grabbing";
    };

    const onPointerMove = (e) => {
      if (!isDownRef.current) return;
      const x = e.pageX - wrap.offsetLeft;
      const walk = x - startXRef.current;
      wrap.scrollLeft = scrollLeftRef.current - walk;
    };

    const onPointerUp = (e) => {
      isDownRef.current = false;
      setDragActive(false);
      setPaused(false);
      wrap.style.cursor = "grab";
      wrap.releasePointerCapture?.(e.pointerId);
    };

    wrap.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      wrap.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return (
    <section className="products-section scene-3d">
      <div className="section-header reveal-block">
        <span className="section-eyebrow">New Arrivals</span>
        <h2 className="section-title">Latest Drops</h2>
      </div>

<div
        ref={wrapRef}
        className={`products-track-wrap ${dragActive ? "dragging" : ""}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div ref={trackRef} className="products-track">
          {products.length > 0 ? (
            products.map((product) => (
              <article
                key={product._id}
                className="product-card card-3d"
                onClick={() => navigate(`/product/${product._id}`)}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${product._id}`)}
                role="button"
                tabIndex={0}
              >
                <div className="product-card-image">
                  <img src={getProductImage(product)} alt={product.name} loading="lazy" />
                </div>
                <div className="p-info">
                  <h3>{product.name}</h3>
                  <div className="p-meta">
                    <span className="p-price">₹{product.price}</span>
                    <span className="p-view">View</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="products-empty">Curating new pieces…</div>
          )}
        </div>
      </div>

      <div className="section-cta reveal-block">
        <Link to="/collections" className="btn-premium btn-navy">
          View All Collections
        </Link>
      </div>
    </section>
  );
};

export default ProductShowcase;
