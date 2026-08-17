import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/clerk-react';
import { NAV_LINKS } from '../constants/brand';
import { useCart } from '../context/CartContext';

const ClerkAuthLinks = ({ mobile = false, onNavigate = () => {} }) => {
  const { user } = useUser();

  const linkBase = mobile
    ? 'block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-200'
    : 'text-sm font-medium transition-colors duration-200 tracking-wide';

  const textStyle = mobile
    ? 'text-[#0A0E17] hover:text-[#C45D3E] hover:bg-[#F5F0EB]'
    : 'text-[#0A0E17] hover:text-[#C45D3E]';

  if (mobile) {
    return (
      <>
        <SignedIn>
          <Link to="/my-orders" className={`${linkBase} ${textStyle}`} onClick={onNavigate}>
            My Orders
          </Link>
          {user?.publicMetadata?.role === 'admin' && (
            <Link
              to="/admin"
              className={`${linkBase} bg-[#0A0E17] text-[#FAF7F2] hover:bg-[#C45D3E]`}
              onClick={onNavigate}
            >
              Admin
            </Link>
          )}
        </SignedIn>
        <SignedOut>
          <Link to="/login" className={`${linkBase} ${textStyle}`} onClick={onNavigate}>Log In</Link>
          <Link
            to="/register"
            className={`${linkBase} bg-[#0A0E17] text-[#FAF7F2] hover:bg-[#C45D3E] text-center`}
            onClick={onNavigate}
          >
            Sign Up
          </Link>
        </SignedOut>
      </>
    );
  }

  return (
    <>
      <SignedIn>
        <Link to="/my-orders" className={`${linkBase} ${textStyle}`}>Orders</Link>
        {user?.publicMetadata?.role === 'admin' && (
          <Link
            to="/admin"
            className="text-sm font-semibold px-3 py-1.5 rounded-full bg-[#0A0E17] text-[#FAF7F2] hover:bg-[#C45D3E] transition-colors duration-200 tracking-wide"
          >
            Admin
          </Link>
        )}
        <div className="ml-1 flex items-center">
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
      <SignedOut>
        <Link to="/login" className={`${linkBase} ${textStyle}`}>Log In</Link>
      </SignedOut>
    </>
  );
};

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = location.pathname === '/';
  const shouldUseClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  let cartCount = 0;
  try {
    const { cart } = useCart();
    cartCount = cart?.length || 0;
  } catch (e) {
    // CartContext not available
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navClass = `fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-[9000] transition-all duration-300 ease-out backdrop-blur-md shadow-sm border ${
    scrolled || !isHome || mobileMenuOpen
      ? 'bg-[var(--c-ivory)]/90 border-black/5 rounded-full'
      : 'bg-white/70 border-white/20 rounded-full'
  }`;

  return (
    <>
      <header className={navClass}>
        <nav className="flex justify-between items-center px-6 py-3 md:py-2.5">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img src="/logofinn.png" alt="Chatakh" className="h-7 sm:h-9 w-auto mix-blend-multiply drop-shadow-sm" />
          </Link>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-[#0A0E17] hover:text-[#C45D3E] text-sm font-medium tracking-wide transition-colors duration-200">
              Home
            </Link>
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="text-[#0A0E17] hover:text-[#C45D3E] text-sm font-medium tracking-wide transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-5">
            {shouldUseClerk ? (
              <ClerkAuthLinks />
            ) : (
              <Link to="/login" className="text-[#0A0E17] hover:text-[#C45D3E] text-sm font-medium tracking-wide transition-colors duration-200">
                Log In
              </Link>
            )}

            {/* Wishlist Icon */}
            <button className="text-[#0A0E17] hover:text-[#C45D3E] transition-colors p-1" aria-label="Wishlist">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Cart Icon */}
            <Link to="/cart" className="relative text-[#0A0E17] hover:text-[#C45D3E] transition-colors p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-[#C45D3E] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Premium Search Pill */}
            <div className="relative flex items-center bg-[#FAF7F2] border border-[#F5F0EB] rounded-full px-4 py-1.5 ml-3 hover:border-[#0A0E17]/30 transition-all duration-300 shadow-sm focus-within:shadow-md focus-within:border-[#0A0E17]/50">
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent border-none outline-none w-24 sm:w-32 text-sm pr-6 text-[#0A0E17] placeholder:text-[#8A8279] font-sans"
              />
              <svg className="w-4 h-4 text-[#0A0E17] absolute right-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <Link to="/cart" className="relative p-1 text-[#0A0E17] hover:text-[#C45D3E]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00aeb2] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {shouldUseClerk && (
              <SignedIn>
                <div className="scale-75 origin-right">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            )}
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full transition-colors duration-200 text-[var(--c-navy)] hover:bg-[var(--c-cream)]"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-[#FAF7F2] border border-[#F5F0EB] rounded-2xl shadow-xl z-[8999] overflow-hidden">
          <div className="flex flex-col p-2">
            {!isHome && (
              <Link to="/" className="block py-3 px-4 rounded-xl text-sm font-medium text-[#0A0E17] hover:text-[#C45D3E] hover:bg-[#F5F0EB] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
            )}
            {NAV_LINKS.map(link => (
              <Link key={link.path} to={link.path} className="block py-3 px-4 rounded-xl text-sm font-medium text-[#0A0E17] hover:text-[#C45D3E] hover:bg-[#F5F0EB] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-[#F5F0EB] mx-2 my-2" />
            {shouldUseClerk ? (
              <ClerkAuthLinks mobile onNavigate={() => setMobileMenuOpen(false)} />
            ) : (
              <>
                <Link to="/login" className="block py-3 px-4 rounded-xl text-sm font-medium text-[#0A0E17] hover:text-[#C45D3E] hover:bg-[#F5F0EB] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Log In
                </Link>
                <Link to="/register" className="block py-3 px-4 rounded-xl text-sm font-medium bg-[#0A0E17] text-white text-center hover:bg-[#C45D3E] transition-colors mt-2" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
