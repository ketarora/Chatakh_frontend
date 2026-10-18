import { BRAND } from "../../constants/brand";

const PremiumLoader = ({ progress }) => (
  <div className="premium-loader">
    <div className="loader-inner">
      <div className="loader-logo">
        <img src="/logofinn.png" alt={BRAND.name} />
      </div>
      <div className="loader-brand">
        {BRAND.name.split("").map((char, i) => (
          <span key={i}>{char === " " ? "\u00A0" : char}</span>
        ))}
      </div>
      <div className="loader-tagline">{BRAND.tagline}</div>
      <div className="loader-thread">
        <div className="loader-thread-line" />
      </div>
      <div className="loader-progress">
        <span className="loader-count">{progress}</span>
        <span className="loader-percent">%</span>
      </div>
    </div>
  </div>
);

export default PremiumLoader;
