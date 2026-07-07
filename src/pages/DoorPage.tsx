import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DoorPage.css';

const ENTER_DURATION_MS = 1600;

export function DoorPage() {
  const navigate = useNavigate();
  const [entering, setEntering] = useState(false);

  const handleEnter = useCallback(() => {
    if (entering) return;
    setEntering(true);
  }, [entering]);

  useEffect(() => {
    if (!entering) return;

    const timer = window.setTimeout(() => {
      navigate('/shop');
    }, ENTER_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [entering, navigate]);

  return (
    <div className={`door-page ${entering ? 'door-page--entering' : ''}`}>
      <div className="door-page__stage">
        <button
          type="button"
          className="door-page__trigger"
          onClick={handleEnter}
          disabled={entering}
          aria-label="Masuk ke RENAOMBER"
        >
          <img
            src="/door.png"
            alt="Pintu RENAOMBER"
            className="door-page__image"
            draggable={false}
          />
        </button>
      </div>

      <p className="door-page__hint">Ketuk pintu untuk masuk kedalam website</p>

      <div className="door-page__veil" aria-hidden />
    </div>
  );
}
