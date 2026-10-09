import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as Clerk from "@clerk/clerk-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const useSafeUser = () => {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return Clerk.useUser();
  } catch {
    return { user: null };
  }
};

const linkCls = ({ isActive }) =>
  `pill-link ${isActive ? "active" : ""}`;

const Navbar = ({ onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useCart();
  const { count } = useWishlist();
  const cartQty = cart.reduce((s, i) => s + (i.qty || 1), 0);
  const { user } = useSafeUser();
  const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    navigate(query ? `/collections?search=${encodeURIComponent(query)}` : "/collections");
    setSearchOpen(false);
  };

  return (
    <>
      <div className="announce">
        <div className="announce-track">
          {[...Array(2)].map((_, k) => (
            <span key={k} className="announce-set">
              <span>✦ Navratri Edit is live ❀</span>
              <span>✦ Free shipping over ₹999</span>
              <span>✦ Handcrafted in India</span>
            </span>
          ))}
        </div>
      </div>

      <header className={`pill-wrap ${scrolled ? "scrolled" : ""}`}>
        <nav className="pill-bar">
          <Link to="/" className="pill-logo" aria-label="Chatakh home">
            <img src="/logofinn.png" alt="Chatakh Creations" />
          </Link>

          <div className="pill-links">
            <NavLink to="/" className={linkCls}>Home</NavLink>
            <NavLink to="/about" className={linkCls}>About</NavLink>
            <NavLink to="/collections" className={linkCls}>Collections</NavLink>
          </div>

          <form className={`pill-search ${searchOpen ? "open" : ""}`} onSubmit={submitSearch}>
            <button type="button" className="icon-btn" aria-label="Search" onClick={() => setSearchOpen((s) => !s)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" /></svg>
            </button>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search kurtis, co-ords…"
              aria-label="Search products"
            />
          </form>

          <div className="pill-icons">
            <Link to="/wishlist" className="circle-btn" aria-label="Wishlist">
              <svg viewBox="0 0 24 24" fill={count ? "#ec0080" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 1 1 12 6.1a5 5 0 1 1 7.5 6.5z" /></svg>
              {count > 0 && <b className="badge">{count}</b>}
              <small>Wishlist</small>
            </Link>
            <Link to="/cart" className="circle-btn" aria-label="Cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 3h2l.4 2M7 13h10l4-8H5.4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="19" r="1.6" /><circle cx="17" cy="19" r="1.6" /></svg>
              {cartQty > 0 && <b className="badge teal">{cartQty}</b>}
              <small>Cart</small>
            </Link>
            {hasClerk ? (
              <SignedIn>
                <span className="circle-btn static">
                  <UserButton afterSignOutUrl="/" />
                  <small>Hi!</small>
                </span>
              </SignedIn>
            ) : (
              <Link to="/login" className="circle-btn" aria-label="Login">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" strokeLinecap="round" /></svg>
                <small>Login</small>
              </Link>
            )}
            {hasClerk && (
              <SignedOut>
                <Link to="/login" className="circle-btn" aria-label="Login">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" strokeLinecap="round" /></svg>
                  <small>Login</small>
                </Link>
              </SignedOut>
            )}
            {isAdmin && (
              <Link to="/admin" className="admin-chip">Admin</Link>
            )}
            <button className="burger" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
              <span /><span /><span />
            </button>
          </div>
        </nav>

        <div className={`pill-drop ${open ? "open" : ""}`}>
          <NavLink to="/" className={linkCls}>Home</NavLink>
          <NavLink to="/about" className={linkCls}>About</NavLink>
          <NavLink to="/collections" className={linkCls}>Collections</NavLink>
          <NavLink to="/wishlist" className={linkCls}>Wishlist ({count})</NavLink>
          <NavLink to="/cart" className={linkCls}>Cart ({cart.length})</NavLink>
          <NavLink to="/my-orders" className={linkCls}>My Orders</NavLink>
          {!hasClerk && <NavLink to="/login" className={linkCls}>Login</NavLink>}
        </div>
      </header>
    </>
  );
};

export default Navbar;
