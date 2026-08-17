import { Link } from 'react-router-dom';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#0A0E17] text-[#FAF7F2] font-sans pt-24 pb-12 border-t border-[#FAF7F2]/10 mt-auto w-full relative z-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-10 mb-20">
          
          {/* Left Column: Brand & Newsletter */}
          <div className="lg:col-span-5 flex flex-col md:pr-12">
            <Link to="/" className="inline-block mb-10">
              <img src="/logofinn.png" alt="Chatakh" className="h-10 md:h-12 w-auto invert brightness-200 hue-rotate-180 hover:opacity-80 transition-opacity" />
            </Link>
            <p className="text-sm text-[#FAF7F2]/60 leading-relaxed mb-12 font-light max-w-sm tracking-wide">
              Elevating the modern wardrobe through uncompromising design, effortless silhouettes, and richly textured luxury edits.
            </p>
            
            <form onSubmit={handleSubscribe} className="relative w-full max-w-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Stay informed. Join our newsletter."
                className="w-full bg-transparent border-b border-[#FAF7F2]/20 hover:border-[#FAF7F2]/40 focus:border-[#ec0080] pb-3 text-sm text-[#FAF7F2] placeholder:text-[#FAF7F2]/30 focus:outline-none transition-colors pr-10"
                required
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-0 bottom-3 text-[#FAF7F2]/40 hover:text-[#ec0080] transition-colors duration-300"
              >
                {subscribed ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#00aeb2]">✓</span>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                )}
              </button>
            </form>
          </div>

          {/* Right Columns: Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 sm:gap-8">
            
            {/* Shop */}
            <div className="flex flex-col">
              <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#FAF7F2] mb-8 opacity-90">Shop</h4>
              <ul className="space-y-4">
                {['All Products', 'Threads of Aura', 'Colors of Aura', 'New Arrivals'].map((item, idx) => (
                  <li key={idx}>
                    <Link to="/collections" className="text-[#FAF7F2]/50 hover:text-[#FAF7F2] text-sm tracking-wide transition-colors duration-300 block hover:translate-x-1 transform fast-ease">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Assistance */}
            <div className="flex flex-col">
              <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#FAF7F2] mb-8 opacity-90">Assistance</h4>
              <ul className="space-y-4">
                {['Shipping & Delivery', 'Returns & Exchanges', 'Privacy Policy', 'Terms of Service'].map((item, idx) => (
                  <li key={idx}>
                    <Link to="#" className="text-[#FAF7F2]/50 hover:text-[#FAF7F2] text-sm tracking-wide transition-colors duration-300 block hover:translate-x-1 transform fast-ease">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inquiries */}
            <div className="flex flex-col col-span-2 md:col-span-1 mt-4 md:mt-0">
              <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#FAF7F2] mb-8 opacity-90">Inquiries</h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/about" className="text-[#FAF7F2]/50 hover:text-[#FAF7F2] text-sm tracking-wide transition-colors duration-300 block hover:translate-x-1 transform fast-ease">
                    Our Story
                  </Link>
                </li>
                <li>
                  <a href="mailto:hello@chatakh.com" className="text-[#FAF7F2]/50 hover:text-[#FAF7F2] text-sm tracking-wide transition-colors duration-300 block hover:translate-x-1 transform fast-ease">
                    hello@chatakh.com
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#FAF7F2]/50 hover:text-[#ec0080] text-sm tracking-wide transition-colors duration-300 block hover:translate-x-1 transform fast-ease flex items-center gap-2">
                    Instagram ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar Segment */}
        <div className="pt-8 border-t border-[#FAF7F2]/10 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          <p className="text-[#FAF7F2]/30 text-xs tracking-widest uppercase font-semibold">
            © {new Date().getFullYear()} Chatakh Creations. Designed for Luxury.
          </p>
          <div className="flex gap-5 items-center">
            {/* Minimal Social Anchor */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 border border-[#FAF7F2]/10 rounded-full text-[#FAF7F2]/60 hover:text-[#FAF7F2] hover:bg-[#ec0080] hover:border-[#ec0080] transition-all duration-500" aria-label="Instagram">
              <svg className="w-4 h-4 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;