import { Link } from "react-router-dom";
import { BRAND } from "../../constants/brand";
import LivingAtelierScene from "./LivingAtelierScene";

const HeroScene = () => (
  <section className="hero-container living-hero">
    {/* Living atelier: threads, fabric river, stitches */}
    <div className="living-scene">
      <LivingAtelierScene />
    </div>
    <div className="living-vignette" />

    {/* Floating brand garment panels */}
    <div className="hero-panels" aria-hidden="true">
      <div className="hero-panel-frame hero-panel-frame-a">
        <img src="/assets/her.png" alt="Her edit" loading="lazy" />
        <span className="hero-panel-label">Her</span>
      </div>
      <div className="hero-panel-frame hero-panel-frame-b">
        <img src="/assets/together.png" alt="Together edit" loading="lazy" />
        <span className="hero-panel-label">Together</span>
      </div>
      <div className="hero-panel-frame hero-panel-frame-c">
        <img src="/assets/him.png" alt="Him edit" loading="lazy" />
        <span className="hero-panel-label">Him</span>
      </div>
      <div className="hero-panel-frame hero-panel-frame-d">
        <img src="/assets/craft.png" alt="Craft detail" loading="lazy" />
        <span className="hero-panel-label">Khadi</span>
      </div>
    </div>

    <div className="hero-shell">
      <div className="hero-copy-wrap reveal-block">
        <div className="hero-tag">{BRAND.subtitle}</div>
        <h1 className="hero-title">
          <span>WOVEN FOR</span>
          <br />
          <span className="hero-accent">THE UNHURRIED</span>
        </h1>
        <p className="hero-desc">
          Handcrafted khadi, thread by unhurried thread. Every stitch honors the atelier — textures that drape like they were made for you, and details you feel up close.
        </p>
        <div className="hero-actions">
          <Link to="/collections" className="btn-premium">
            Explore Edit
          </Link>
          <Link to="/about" className="btn-ghost">
            Our Story
          </Link>
        </div>

        <div className="hero-metrics">
          <div className="hero-metric">
            <strong>Stitch</strong>
            <span>Hand-finished running detail</span>
          </div>
          <div className="hero-metric">
            <strong>Khadi</strong>
            <span>Breathable, sustainable weave</span>
          </div>
          <div className="hero-metric">
            <strong>Slow</strong>
            <span>Small-batch, unhurried craft</span>
          </div>
        </div>
      </div>
    </div>

    <div className="scroll-cue">
      <span>Scroll</span>
      <div className="scroll-line" />
    </div>
  </section>
);

export default HeroScene;
