// Brand loader + skeletons. Light, playful, unmistakably Chatakh.
export const PageLoader = ({ label = "Weaving the magic" }) => (
  <div className="chatakh-loader" role="status" aria-label={label}>
    <div className="bloom">
      {[...Array(8)].map((_, i) => (
        <span key={i} style={{ "--i": i }} />
      ))}
      <em className="bloom-core">C</em>
    </div>
    <p className="bloom-label">
      {label}
      <span className="dots">
        <i>.</i>
        <i>.</i>
        <i>.</i>
      </span>
    </p>
  </div>
);

export const CardSkeleton = () => (
  <div className="skel-card" aria-hidden="true">
    <div className="skel-img shimmer" />
    <div className="skel-line shimmer" style={{ width: "70%" }} />
    <div className="skel-line shimmer" style={{ width: "45%" }} />
  </div>
);

export const GridSkeleton = ({ count = 8 }) => (
  <div className="skel-grid">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="skel-wrap" style={{ "--d": `${(i % 8) * 90}ms` }}>
        <CardSkeleton />
      </div>
    ))}
  </div>
);
