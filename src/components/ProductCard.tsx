import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const statusLabels: Record<Product['status'], string | null> = {
  available: null,
  sale: 'Sale',
  'sold-out': 'Sold Out',
  'pre-order': 'Pre-Order',
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isDisabled = product.status === 'sold-out';
  const badge = statusLabels[product.status];

  return (
    <article className="product-card">
      <button
        type="button"
        className="product-card__media"
        onClick={() => !isDisabled && addItem(product)}
        disabled={isDisabled}
        aria-label={isDisabled ? product.name : `Add ${product.name} to cart`}
      >
        <img src={product.image} alt="" loading="lazy" />
        {badge && (
          <span className={`product-card__badge product-card__badge--${product.status}`}>
            {badge}
          </span>
        )}
        {!isDisabled && <span className="product-card__overlay">Add to Cart</span>}
      </button>

      <div className="product-card__info">
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__pricing">
          <span className="product-card__price">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="product-card__original">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
