import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { COMING_SOON } from './config/site';
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
        <Route
          path="/shop"
          element={COMING_SOON ? <Navigate to="/" replace /> : <ShopPage />}
        />
        <Route
          path="/story"
          element={
            COMING_SOON ? (
              <Navigate to="/" replace />
            ) : (
              <Suspense fallback={<StoryLoading />}>
                <StoryPage />
              </Suspense>
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
