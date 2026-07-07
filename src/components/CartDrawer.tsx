import { useCart } from '../context/CartContext';
import './CartDrawer.css';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    total,
    removeItem,
    updateQuantity,
  } = useCart();

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? 'cart-overlay--visible' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        <div className="cart-drawer__header">
          <h2>Your Cart</h2>
          <button
            type="button"
            className="cart-drawer__close"
            onClick={closeCart}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <p>Keranjang kosong.</p>
            <button type="button" onClick={closeCart}>
              Lanjut Belanja
            </button>
          </div>
        ) : (
          <>
            <ul className="cart-drawer__items">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="cart-drawer__item">
                  <img src={product.image} alt="" />
                  <div className="cart-drawer__item-info">
                    <strong>{product.name}</strong>
                    <span>${product.price.toFixed(2)}</span>
                    <div className="cart-drawer__qty">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span>{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cart-drawer__remove"
                    onClick={() => removeItem(product.id)}
                    aria-label={`Remove ${product.name}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__total">
                <span>Estimated Total</span>
                <strong>${total.toFixed(2)} USD</strong>
              </div>
              <p className="cart-drawer__note">
                Pajak & ongkir dihitung saat checkout.
              </p>
              <button type="button" className="cart-drawer__checkout">
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
