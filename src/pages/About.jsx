import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BRAND, BRAND_STORY } from "../constants/brand";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-hero-content > *", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.utils.toArray(".about-chapter").forEach((chapter) => {
        gsap.from(chapter, {
          scrollTrigger: { trigger: chapter, start: "top 85%" },
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power2.out",
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="about-page">
      <section className="about-hero">
        <div className="about-hero-bg" />
        <div className="about-hero-content">
          <span className="about-eyebrow">About Us</span>
          <h1>{BRAND_STORY.headline}</h1>
          <p>{BRAND_STORY.excerpt}</p>
          <Link to="/collections" className="about-cta">
            Explore Collections
          </Link>
        </div>
      </section>

      <section className="about-body">
        {BRAND_STORY.full.map((paragraph, i) => (
          <article key={i} className="about-chapter">
            <span className="chapter-num">0{i + 1}</span>
            <p>{paragraph}</p>
          </article>
        ))}

        <div className="about-gallery about-chapter">
          <img src="/img3.jpeg" alt="Collection mood" loading="lazy" />
          <img src="/img4.jpeg" alt="Studio detail" loading="lazy" />
        </div>

        <div className="about-closing about-chapter">
          <h2>Woven with intention. Worn with confidence.</h2>
          <p>— {BRAND.name}</p>
          <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="about-instagram">
            Follow {BRAND.instagramHandle}
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
