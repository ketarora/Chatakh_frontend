import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const TRIO = { src: "/owners-trio.jpg", fallback: "/IMG_8301.png", last: "/img1.jpeg" };

const trioImg = () => (
  <img
    src={TRIO.src}
    alt="The three friends behind Chatakh"
    loading="lazy"
    decoding="async"
    onError={(e) => {
      const el = e.currentTarget;
      el.onerror = null;
      el.src = TRIO.fallback;
      el.onerror = () => { el.src = TRIO.last; };
    }}
  />
);

const About = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a beat for reveal animations to settle, then land on the anchor.
      const t = setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 350);
      return () => clearTimeout(t);
    }
  }, [hash]);

  return (
  <div className="about-page">
    <div className="coll-hero">
      <p className="eyebrow light">✦ Three friends · One little dream</p>
      <h1>About Chatakh</h1>
      <p>Fashion, creativity, culture, colour & all the wonderfully random things in between.</p>
    </div>
    <section className="section story revealed">
      <div className="story-grid">
        <div className="story-copy">
          <h2>Three Friends,<br /><em>One Little Dream</em></h2>
          <p>Three personalities, three very different ways of seeing the world — and somehow, all making sense in one place. One is calm, one is chaotic, one is probably changing the plan five minutes before it happens.</p>
          <p>But somewhere between the disagreements, the laughs, the random ideas, and the "wait, what if we did this?" moments — <b>Chatakh was born</b>.</p>
          <p className="dim">We make, experiment, mess up, start again, and turn our differences into something unmistakably Chatakh.</p>
          <div className="story-friends">
            <span className="friend f1">☾ the calm one</span>
            <span className="friend f2">✸ the chaotic one</span>
            <span className="friend f3">❀ the plan-changer</span>
          </div>
          <Link to="/collections" className="btn-primary">Shop our story →</Link>
        </div>
        <div className="trio-frame">
          {trioImg()}
          <p className="trio-cap">us, prolly arguing about whose idea's better</p>
          <span className="tape t1" /><span className="tape t2" />
          <span className="trio-doodle">↩ real humans, promise</span>
          <span className="story-badge">✦ the humans behind the chaos</span>
        </div>
      </div>
    </section>
    <section className="section manifesto">
      <div className="sec-head">
        <p className="eyebrow">✦ humara manifesto</p>
        <h2>Loud, Proud & <em>Extra</em></h2>
      </div>
      <div className="mani-card teal">
        <p>We believe that fashion isn't just about what you wear — it's about how loudly you show up in the world. It's your attitude, your presence, your moment. <b>Chatakh</b> is for the ones who glow a little brighter, walk a little taller, and never apologize for being just a little extra ;)</p>
      </div>
      <div className="mani-card yellow">
        <p><b>Chatakh</b> was born from a simple truth: blending in was never the goal. In a world full of sameness, we exist for the ones who dare to be different — for those who choose bold over basic, light over safe, and statement over silence.</p>
        <p>Every stitch, silhouette, and shade we design is a celebration of being unapologetically you.</p>
      </div>
    </section>
    <section id="policies" className="section policies">
      <div className="sec-head">
        <p className="eyebrow">✦ good to know</p>
        <h2>Shipping & <em>Exchanges</em></h2>
      </div>
      <div className="policy-grid">
        <div className="policy-card">
          <h3>🚚 Shipping</h3>
          <p>Dispatched in 24–48 hrs, tracked door-to-door across India. Orders over ₹999 ship FREE — smaller ones carry a tiny shipping charge shown upfront, no surprises at payment.</p>
        </div>
        <div className="policy-card">
          <h3>🔄 Exchanges</h3>
          <p>Wrong size? Easy swaps within 7 days of delivery, unworn with tags. Write to <a href="mailto:support@chatakh.com">support@chatakh.com</a> with your order ID — real humans reply.</p>
        </div>
        <div className="policy-card">
          <h3>🔒 Payments</h3>
          <p>UPI, cards & netbanking via Razorpay's secure checkout. We never see or store your card details. Ever.</p>
        </div>
      </div>
    </section>
  </div>
  );
};

export default About;
