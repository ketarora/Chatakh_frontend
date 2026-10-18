import { Link } from "react-router-dom";
import { COLLECTIONS } from "../../constants/brand";

const FeaturedCollections = () => (
  <section className="featured-section scene-3d">
    <div className="section-header reveal-block">
      <span className="section-eyebrow">Curated Edit</span>
      <h2 className="section-title">Featured Collections</h2>
      <p className="section-desc">
        Two distinct worlds — one philosophy. Explore signature threads and expressive color stories.
      </p>
    </div>

    <div className="featured-grid">
      {COLLECTIONS.map((col, i) => (
        <Link
          key={col.slug}
          to={`/collections/${col.slug}`}
          className={`featured-card card-3d reveal-block delay-${i + 1}`}
        >
          <div className="featured-card-inner hero-panel-main">
            <img src={col.image} alt={col.name} loading="lazy" />

            <div className="featured-card-overlay">
              <div className="featured-meta">
                <span className="featured-index">0{i + 1}</span>
                <span className="hero-card-kicker">Curated Edit</span>
              </div>

              <h3>{col.name}</h3>
              <p>{col.description}</p>

              <div className="featured-cta-row">
                <span className="featured-cta">Explore →</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

export default FeaturedCollections;
