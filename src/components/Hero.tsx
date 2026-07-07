import { Link } from 'react-router-dom';
import './Hero.css';

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__mascot-wrap">
        <img
          src="/mascot.png"
          alt="RENAOMBER mascot"
          className="hero__mascot"
          loading="eager"
        />
      </div>

      <div className="hero__content">
        <h1 className="hero__title">RENAOMBER</h1>
        <p className="hero__desc">
          Streetwear & collectibles. Limited drops only.
        </p>
        <div className="hero__actions">
          <a href="#shop" className="hero__cta">
            Shop Now
          </a>
          <Link to="/story" className="hero__cta hero__cta--secondary">
            RENAOMBER Ranch
          </Link>
        </div>
      </div>
    </section>
  );
}
