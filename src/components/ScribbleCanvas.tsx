import {
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import './ScribbleCanvas.css';

const BRUSH_COLOR = '#000000';
const BRUSH_WIDTH = 3;

interface ScribbleCanvasProps {
  children: ReactNode;
  className?: string;
  enabled?: boolean;
}

export function ScribbleCanvas({
  children,
  className = '',
  enabled = true,
}: ScribbleCanvasProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = BRUSH_COLOR;
      ctx.lineWidth = BRUSH_WIDTH;
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const isIgnoredTarget = (target: EventTarget | null) =>
    target instanceof Element && Boolean(target.closest('[data-scribble-ignore]'));

  const drawSegment = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = BRUSH_COLOR;
    ctx.lineWidth = BRUSH_WIDTH;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled || event.button !== 0 || isIgnoredTarget(event.target)) return;

    drawingRef.current = true;
    lastPointRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drawingRef.current || !lastPointRef.current) return;

    const next = { x: event.clientX, y: event.clientY };
    drawSegment(lastPointRef.current, next);
    lastPointRef.current = next;
    event.preventDefault();
  };

  const stopDrawing = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drawingRef.current) return;

    drawingRef.current = false;
    lastPointRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`scribble-root ${className}`.trim()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDrawing}
      onPointerCancel={stopDrawing}
      onPointerLeave={stopDrawing}
    >
      <canvas ref={canvasRef} className="scribble-canvas" aria-hidden />
      <div className="scribble-content">{children}</div>
    </div>
  );
}
