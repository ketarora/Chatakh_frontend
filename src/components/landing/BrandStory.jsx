import { Link } from "react-router-dom";
import { BRAND, BRAND_STORY } from "../../constants/brand";

const BrandStory = () => (
  <section className="story-section scene-3d">
    <div className="story-layout">
      <div className="story-visual reveal-block">
        <div className="story-image-stack">
          <img src="/img1.jpeg" alt="Craft detail" className="stack-img stack-a" loading="lazy" />
          <img src="/img2.jpeg" alt="Fabric texture" className="stack-img stack-b" loading="lazy" />
          <img src="/assets/craft.png" alt="Atelier" className="stack-img stack-c" loading="lazy" />
        </div>
        <div className="story-badge">Est. with love</div>
      </div>

      <div className="story-content reveal-block delay-2">
        <span className="section-eyebrow">Our Story</span>
        <h2 className="section-title">{BRAND_STORY.headline}</h2>
        <p className="story-excerpt">{BRAND_STORY.excerpt}</p>
        <Link to="/about" className="btn-premium btn-rust">
          Read Full Story
        </Link>
      </div>
    </div>
  </section>
);

export default BrandStory;
