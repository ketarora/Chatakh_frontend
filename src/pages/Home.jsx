import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../api/axios';
import Scene3D from '../components/Scene3D';
import { BRAND_STORY } from '../constants/brand';
import './Landing.css';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════
   PREMIUM LOADER (Kept from original)
   ═══════════════════════════════════════ */
function PremiumLoader({ onComplete }) {
  const loaderRef = useRef(null);
  const logoRef = useRef(null);
  const progRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(logoRef.current, 
      { opacity: 0, scale: 0.8, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        gsap.to(lineRef.current, { scaleX: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(loaderRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: 'power4.inOut',
          delay: 0.6,
          onComplete
        });
      }
      if (progRef.current) {
        progRef.current.innerText = progress + '%';
      }
      if (lineRef.current) {
        gsap.to(lineRef.current, { scaleX: progress / 100, duration: 0.3, ease: 'power2.out' });
      }
    }, 120);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="fixed inset-0 bg-[#FAF7F2] flex flex-col items-center justify-center z-[99999]">
      <div className="relative flex flex-col items-center">
        <div ref={logoRef} className="mb-8">
          <img src="/logofinn.png" alt="Chatakh" className="h-20 md:h-24 w-auto" />
        </div>
        <p className="text-[#0A0E17] text-xs md:text-sm tracking-[0.4em] uppercase mb-8 font-light">
          Where Heritage Meets Edge
        </p>
        <div className="flex flex-col items-center gap-3 w-56">
          <div className="h-[2px] w-full bg-[#F5F0EB] overflow-hidden relative rounded-full">
            <div 
              ref={lineRef} 
              className="absolute top-0 left-0 h-full w-full bg-[#c4416f] origin-left" 
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
          <p ref={progRef} className="text-[#0A0E17] font-mono text-xs tracking-[0.3em] font-medium">0%</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   1. HERO SECTION (Split Pink BG)
   ═══════════════════════════════════════ */
function HeroSection() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.5 });
      tl.from('.hero-text-anim', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
      });
      tl.from('.hero-img-anim', {
        x: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out'
      }, "-=0.8");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen pt-32 pb-16 md:py-0 w-full bg-[#c4416f] overflow-hidden flex items-center">
      <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left: Text */}
        <div className="text-white pt-10 md:pt-0">
          <h1 className="hero-text-anim font-serif text-[4rem] sm:text-[5rem] md:text-[6rem] lg:text-[7.5rem] leading-[0.9] tracking-tighter mb-4">
            Chatakh<br />Creations
          </h1>
          <p className="hero-text-anim text-lg md:text-xl font-medium tracking-wide mb-10 max-w-sm text-white/90">
            Fashion that reflects your spirit. Where heritage meets modern edge.
          </p>
          <div className="hero-text-anim">
            <Link to="/collections" className="inline-block bg-[#ffffff] hover:bg-[#0A0E17] hover:text-[#FAF7F2] transition-colors duration-300 px-8 py-3.5 rounded-full text-sm font-bold tracking-wider shadow-lg" style={{ color: '#c4416f' }}>
              Shop the Collection
            </Link>
          </div>
        </div>

        {/* Right: Images (Full Showcase) */}
        <div className="relative w-full flex items-center justify-center pt-8 md:pt-0">
          <img 
            src="/IMG_8301.png" 
            alt="Founders of Chatakh Creations" 
            className="hero-img-anim w-full h-auto max-h-[75vh] object-contain rounded-3xl shadow-2xl hover:scale-[1.02] transition-transform duration-700" 
          />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   2. BEST SELLERS
   ═══════════════════════════════════════ */
function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.png';
    if (imagePath.startsWith('http')) return imagePath;
    const apiUrl = import.meta.env.VITE_API_URL || 'https://chatakh-creations.onrender.com';
    return `${apiUrl.replace(/\/+$/, '')}/${imagePath.replace(/^\/+/, '')}`;
  };

  useEffect(() => {
    // Normal api interceptor request
    api.get('/api/products?limit=8')
      .then(res => {
        const data = res.data?.products || res.data || [];
        // Strictly slice to max 8 items just in case the backend ignores the limit param
        setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Backend failed to load products:", err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!products.length) return;
    
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Enforce extreme 3D perspective directly on the container bounds
        gsap.set(sectionRef.current, { perspective: 2000 });
        
        const tl = gsap.timeline({
          scrollTrigger: { 
            trigger: sectionRef.current, 
            start: 'top 80%',
          }
        });

        // The ultimate dramatic Gen-Z aesthetic 3D pop
        tl.fromTo('.bs-card', 
          { 
            y: 350, 
            z: -800, 
            rotationX: 180, 
            rotationY: -50, 
            rotationZ: -10,
            scale: 0.1, 
            opacity: 0, 
            transformOrigin: "center center -500px" 
          },
          { 
            y: 0, 
            z: 0, 
            rotationX: 0, 
            rotationY: 0, 
            rotationZ: 0,
            scale: 1, 
            opacity: 1, 
            duration: 2.4, 
            stagger: 0.1, 
            ease: 'expo.out' 
          }
        );
      }, sectionRef);
      return () => ctx.revert();
    }, 200);

    return () => clearTimeout(timer);
  }, [products]);

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-[#0A0E17]/10 pb-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-[#0A0E17]">Best Sellers</h2>
            <p className="text-[#0A0E17]/60 mt-2 font-medium">Our most loved pieces</p>
          </div>
          <Link to="/collections" className="text-sm font-semibold tracking-wide hover:text-[#c4416f] transition-colors pb-1">
            View More →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative min-h-[300px]">
          {(loading || !products.length) && (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bs-skeleton block">
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-4 p-6 bg-[#EBE4DC] animate-pulse border border-[#0A0E17]/5 flex justify-center items-center">
                    <img src="/logofinn.png" alt="Loading" className="h-16 opacity-10" />
                </div>
                <div className="h-4 bg-[#EBE4DC] w-3/4 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-[#EBE4DC] w-1/4 rounded animate-pulse"></div>
              </div>
            ))
          )}
          {!loading && products.map((product, i) => (
            <Link key={product._id} to={`/product/${product._id}`} className="bs-card group block relative z-10 hover:z-50">
              <div 
                className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-4 bg-[#F5F0EB] flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:-translate-y-4 group-hover:scale-[1.05] group-hover:rotate-[2deg] group-hover:shadow-[0_30px_60px_-15px_rgba(236,0,128,0.45)] border border-[#0A0E17]/5"
              >
                {/* Editorial Glitch / Flash gradient overlay triggered on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#ec0080]/50 via-transparent to-[#00aeb2]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay z-20 pointer-events-none"></div>

                <span className="absolute top-4 left-4 bg-[#0A0E17] group-hover:bg-[#ec0080] px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm z-30 text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:-rotate-[4deg]">
                  Best Seller
                </span>
                
                <img 
                  src={product.images?.length > 0 ? getImageUrl(product.images[0]) : '/IMG_8301.png'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-125 group-hover:saturate-[1.3] group-hover:contrast-[1.1]"
                />
              </div>
              <h3 className="font-semibold text-base truncate text-[#0A0E17] group-hover:text-[#ec0080] transition-colors duration-300">{product.name}</h3>
              <p className="text-sm font-bold text-[#c4416f] mt-1 transition-transform duration-300 group-hover:translate-x-1">₹{product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   3. NEW ARRIVALS (Split)
   ═══════════════════════════════════════ */
function NewArrivals() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.na-anim', {
        y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
      {/* Left: Dark Navy */}
      <div className="bg-[#0A0E17] p-12 md:p-24 flex flex-col justify-center text-[#FAF7F2] relative overflow-hidden">
        <h2 className="na-anim text-5xl md:text-7xl font-serif tracking-tighter leading-tight mb-6 relative z-10 text-[#FAF7F2]">
          Effortless Structure,<br/>Timeless Charm.
        </h2>
        <p className="na-anim text-lg md:text-xl font-medium mb-10 text-[#F5F0EB] relative z-10">
          New arrivals now in stock. Discover the silhouettes of tomorrow.
        </p>
        <div className="na-anim relative z-10">
          <Link to="/collections" className="inline-block bg-[#FAF7F2] hover:bg-[#c4416f] hover:text-[#FAF7F2] transition-colors duration-300 px-10 py-4 rounded-full text-sm font-bold tracking-wider" style={{ color: '#0A0E17' }}>
            Shop Now
          </Link>
        </div>
      </div>
      {/* Right: Abstract imagery */}
      <div className="bg-[#F5F0EB] relative overflow-hidden flex items-center justify-center p-12 min-h-[50vh]">
        <img src="/img4.jpeg" alt="New Arrival" className="na-anim relative z-10 w-[75%] max-w-sm rounded-[2rem] shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-700" />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   4. MARQUEE TICKER
   ═══════════════════════════════════════ */
function Marquee() {
  return (
    <div className="bg-[#F5F0EB] py-6 overflow-hidden flex border-y border-[#0A0E17]/10">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="text-2xl md:text-3xl font-serif text-[#c4416f] mx-12">
            FREE SHIPPING ON ORDERS OVER ₹999 ✦
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   5. SHOP BY CATEGORY
   ═══════════════════════════════════════ */
function ShopByCategory() {
  const cats = [
    { title: 'Threads of Aura', img: '/threads%20of%20aura.png', link: '/collections' },
    { title: 'Colors of Aura', img: '/colors%20of%20aura.png', link: '/collections' },
    { title: 'All Essentials', img: '/img3.jpeg', link: '/collections' },
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-12 text-center text-[#0A0E17]">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cats.map((cat, i) => (
            <Link key={i} to={cat.link} className="group relative block aspect-[4/5] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 border border-[#0A0E17]/5">
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[85%] text-center">
                <span className="inline-block bg-[#FAF7F2]/95 backdrop-blur-md px-8 py-3.5 rounded-full text-sm font-bold tracking-wide text-[#0A0E17] shadow-lg group-hover:bg-[#0A0E17] group-hover:text-white group-hover:-translate-y-1 transition-all duration-300">
                  {cat.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   6. OUR STORY (Parallax / 3D / Video)
   ═══════════════════════════════════════ */
function OurStory() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.story-parallax-1', {
        y: -80,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
      gsap.to('.story-parallax-2', {
        y: 60,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 md:py-48 px-6 bg-[#0A0E17] overflow-hidden">
      {/* Subtle Background 3D Scene Layer */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-screen">
        <Scene3D />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Editorial Layout Images */}
        <div className="md:col-span-5 relative h-[60vh] md:h-[80vh] w-full mt-12 md:mt-0 order-2 md:order-1">
          <div className="story-parallax-1 absolute left-0 md:left-[10%] top-[10%] w-[60%] md:w-[70%] aspect-[3/4] z-20 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
            <img src="/img2.jpeg" alt="Story Detail 1" className="w-full h-full object-cover" />
          </div>
          <div className="story-parallax-2 absolute right-0 md:-right-[10%] bottom-[10%] w-[50%] md:w-[60%] aspect-square z-30 rounded-full overflow-hidden shadow-2xl border-4 border-[#0A0E17]">
            <img src="/img1.jpeg" alt="Story Detail 2" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Right Side: Clean Readable Text */}
        <div className="md:col-span-7 flex flex-col justify-center order-1 md:order-2 px-4 md:pl-20 text-[#FAF7F2]">
          <h2 className="text-4xl md:text-6xl font-serif mb-8 tracking-tighter pb-2">Our Story</h2>
          <p className="text-xl md:text-3xl font-serif leading-relaxed max-w-2xl mb-8 opacity-95">
            Chatakh isn't just clothing. It's the feeling of slipping into something that understands you.
          </p>
          <p className="opacity-80 text-base md:text-lg max-w-xl font-light mb-12">
            What started as a passion project became something larger: a label that celebrates unhurried elegance in a world that rarely slows down. We source textures that feel as good as they look.
          </p>
          <div>
            <Link to="/about" className="inline-block border border-[#FAF7F2]/30 hover:border-[#c4416f] hover:bg-[#c4416f] text-[#FAF7F2] px-10 py-4 rounded-full text-sm font-semibold tracking-wider transition-all duration-300">
              Read the Full Story
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   7. INSTAGRAM
   ═══════════════════════════════════════ */
function InstagramGrid() {
  const images = ['/img1.jpeg', '/img2.jpeg', '/img3.jpeg', '/img4.jpeg', '/img1.jpeg', '/img2.jpeg', '/img3.jpeg', '/img4.jpeg'];
  const imagesRow2 = [...images].reverse();
  
  return (
    <section className="relative py-40 md:py-52 bg-[#FAF7F2] overflow-hidden rounded-t-[3rem] md:rounded-t-[4rem] -mt-12 z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
      {/* Central Professional Overlay Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-4">
        <div className="bg-[#FAF7F2]/80 backdrop-blur-xl px-10 py-10 md:px-20 md:py-16 rounded-[4rem] shadow-[0_30px_60px_rgba(196,65,111,0.15)] border border-white/60 text-center pointer-events-auto transform hover:scale-[1.05] transition-all duration-700 hover:shadow-[0_40px_80px_rgba(196,65,111,0.25)]">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex flex-col items-center gap-6 text-[#0A0E17] hover:text-[#c4416f] transition-colors group">
            <svg className="w-12 h-12 md:w-16 md:h-16 text-[#c4416f] group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            <div>
              <h2 className="text-4xl md:text-6xl font-serif lowercase tracking-tighter mb-3">Join our community</h2>
              <p className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-[#0A0E17]/60">Discover exclusive drops & editorial insight</p>
            </div>
            <span className="mt-6 inline-block border-[1.5px] border-[#0A0E17] text-[#0A0E17] group-hover:border-[#c4416f] group-hover:bg-[#c4416f] group-hover:text-[#FAF7F2] px-10 py-4 rounded-full text-sm font-bold tracking-widest transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
              @chatakh_creations
            </span>
          </a>
        </div>
      </div>

      {/* Skewed Marquee Wrapper */}
      <div className="relative rotate-[-4deg] scale-[1.1] z-10 opacity-90 transition-opacity duration-700">
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Row 1 - Moving Left */}
          <div className="flex w-max animate-marquee">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-6 md:gap-8 px-3 md:px-4">
                {images.map((img, j) => (
                  <a key={`${i}-${j}`} href="https://instagram.com" target="_blank" rel="noreferrer" className="block w-56 md:w-80 xl:w-96 aspect-[4/5] overflow-hidden rounded-[2rem] shrink-0 group shadow-lg border border-[#0A0E17]/5 relative">
                    <div className="absolute inset-0 bg-[#c4416f]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 mix-blend-color-burn"></div>
                    <img src={img} alt="Instagram post" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-[1.15]" loading="lazy" />
                  </a>
                ))}
              </div>
            ))}
          </div>

          {/* Row 2 - Moving Right */}
          <div className="flex w-max animate-marquee" style={{ animationDirection: 'reverse' }}>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-6 md:gap-8 px-3 md:px-4">
                {imagesRow2.map((img, j) => (
                  <a key={`${i}-${j}`} href="https://instagram.com" target="_blank" rel="noreferrer" className="block w-56 md:w-80 xl:w-96 aspect-[4/5] overflow-hidden rounded-[2rem] shrink-0 group shadow-lg border border-[#0A0E17]/5 relative">
                    <div className="absolute inset-0 bg-[#c4416f]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 mix-blend-color-burn"></div>
                    <img src={img} alt="Instagram post" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-[1.15]" loading="lazy" />
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   HOME COMPONENT EXPORT
   ═══════════════════════════════════════ */
export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="bg-[var(--c-ivory)] min-h-screen text-[var(--c-navy)]">
      {!loaded && <PremiumLoader onComplete={() => setLoaded(true)} />}
      <HeroSection />
      <BestSellers />
      <NewArrivals />
      <Marquee />
      <ShopByCategory />
      <OurStory />
      <InstagramGrid />
    </div>
  );
}
