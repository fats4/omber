import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DoorPage } from './pages/DoorPage';
import { ShopPage } from './pages/ShopPage';

const StoryPage = lazy(() =>
  import('./pages/StoryPage').then((module) => ({ default: module.StoryPage })),
);

function StoryLoading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'var(--font)',
      }}
    >
      Memuat dunia 3D…
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DoorPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route
          path="/story"
          element={
            <Suspense fallback={<StoryLoading />}>
              <StoryPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
