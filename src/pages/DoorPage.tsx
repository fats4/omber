import { useCallback, useState, type AnimationEvent } from 'react';
import './DoorPage.css';

export function DoorPage() {
  const [zooming, setZooming] = useState(false);

  const handlePeek = useCallback(() => {
    if (zooming) return;
    setZooming(true);
  }, [zooming]);

  const handleZoomEnd = useCallback((event: AnimationEvent<HTMLButtonElement>) => {
    if (!event.animationName.startsWith('door-peek-zoom')) return;
    setZooming(false);
  }, []);

  return (
    <div className={`door-page door-page--soon ${zooming ? 'door-page--zooming' : ''}`}>
      <div className="door-page__stage">
        <button
          type="button"
          className="door-page__trigger"
          onClick={handlePeek}
          disabled={zooming}
          onAnimationEnd={handleZoomEnd}
          aria-label="Ketuk mascot RENAOMBER"
        >
          <img
            src="/omber-door.gif"
            alt="RENAOMBER mascot"
            className="door-page__image"
            draggable={false}
          />
        </button>
      </div>

      <p className="door-page__hint">When</p>

      <div className="door-page__veil" aria-hidden />
    </div>
  );
}
