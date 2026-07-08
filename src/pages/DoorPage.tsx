import { ScribbleCanvas } from '../components/ScribbleCanvas';
import './DoorPage.css';

export function DoorPage() {
  return (
    <ScribbleCanvas className="door-page door-page--soon">
      <div className="door-page__stage">
        <div className="door-page__mascot">
          <img
            src="/omber-door.gif"
            alt="RENAOMBER mascot"
            className="door-page__image"
            draggable={false}
          />
        </div>
      </div>

      <p className="door-page__hint">When</p>
    </ScribbleCanvas>
  );
}
