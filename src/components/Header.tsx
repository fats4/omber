import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

export function Header() {
  const { itemCount, toggleCart } = useCart();

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/shop" className="header__logo" aria-label="RENAOMBER home">
          <img src="/mascot.png" alt="" className="header__logo-img" />
          <span className="header__logo-text">RENAOMBER</span>
        </Link>

        <nav className="header__nav" aria-label="Main navigation">
          <a href="#shop">Shop</a>
          <Link to="/story">Ranch</Link>
          <a href="#policies">Policies</a>
        </nav>

        <button
          type="button"
          className="header__cart"
          onClick={toggleCart}
          aria-label={`Cart, ${itemCount} items`}
        >
          Cart ({itemCount})
        </button>
      </div>
    </header>
  );
}
