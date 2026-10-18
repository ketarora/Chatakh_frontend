import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="cart-page">
    <div className="empty-box notfound">
      <p className="eyebrow">404 · lost in the bazaar</p>
      <h1 className="nf-big">Areyy!</h1>
      <h3>Ye gali kahin nahi jaati…</h3>
      <p>This page doesn't exist. But the good stuff does — come, let's get you back to it.</p>
      <div className="nf-actions">
        <Link to="/" className="btn-primary">Take me home →</Link>
        <Link to="/collections" className="back-link">or browse everything</Link>
      </div>
    </div>
  </div>
);

export default NotFound;
