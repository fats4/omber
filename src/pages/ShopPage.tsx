import { CartProvider } from '../context/CartContext';
import { Header } from '../components/Header';
import { Marquee } from '../components/Marquee';
import { Hero } from '../components/Hero';
import { ProductGrid } from '../components/ProductGrid';
import { Newsletter } from '../components/Newsletter';
import { Policies } from '../components/Policies';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';

export function ShopPage() {
  return (
    <CartProvider>
      <Marquee />
      <Header />
      <main>
        <Hero />
        <ProductGrid />
        <Newsletter />
        <Policies />
      </main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
