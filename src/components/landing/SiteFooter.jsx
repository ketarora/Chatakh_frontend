import { Link } from "react-router-dom";
import { BRAND, QUICK_LINKS } from "../../constants/brand";

const QuickLinks = () => (
  <section className="quicklinks-section">
    <div className="section-header reveal-block">
      <span className="section-eyebrow">Navigate</span>
      <h2 className="section-title">Quick Links</h2>
    </div>

    <div className="quicklinks-grid reveal-block delay-1">
      {QUICK_LINKS.map((link) =>
        link.external ? (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="quicklink-pill"
          >
            {link.label}
          </a>
        ) : (
          <Link key={link.label} to={link.to} className="quicklink-pill">
            {link.label}
          </Link>
        )
      )}
    </div>
  </section>
);

const LandingFooter = () => (
  <footer className="landing-footer">
    <div className="footer-inner reveal-block">
      <img src="/logofinn.png" alt={BRAND.name} className="footer-logo" />
      <h2>{BRAND.name}</h2>
      <p>
        Luxury fashion designed for modern confidence. Bold silhouettes, premium texture, and a polished shopping experience.
      </p>
      <div className="footer-social">
        <span>Follow Us</span>
        <a href={BRAND.instagram} target="_blank" rel="noreferrer">
          {BRAND.instagramHandle}
        </a>
      </div>
      <div className="footer-copy">© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</div>
    </div>
  </footer>
);

export { QuickLinks, LandingFooter };
