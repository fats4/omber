import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src="/mascot.png" alt="" className="footer__mascot" />
          <span className="footer__logo">RENAOMBER</span>
        </div>

        <div className="footer__links">
          <div>
            <h4>Shop</h4>
            <a href="#shop">All Products</a>
            <a href="#shop">Apparel</a>
            <a href="#shop">Collectibles</a>
          </div>
          <div>
            <h4>Info</h4>
            <a href="#policies">Shipping</a>
            <a href="#policies">Refunds</a>
            <a href="#policies">Terms</a>
          </div>
          <div>
            <h4>Social</h4>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
              TikTok
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© 2026 RENAOMBER. All rights reserved.</p>
      </div>
    </footer>
  );
}
