import { useState } from 'react';
import { products, categories } from '../data/products';
import { ProductCard } from './ProductCard';
import './ProductGrid.css';

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section className="shop" id="shop">
      <div className="shop__inner">
        <div className="shop__header">
          <h2 className="shop__title">Shop</h2>
          <p className="shop__count">{filtered.length} items</p>
        </div>

        <div className="shop__filters" role="tablist" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              className={`shop__filter ${activeCategory === cat ? 'shop__filter--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="shop__divider" />
      </div>

      <div className="shop__grid">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
