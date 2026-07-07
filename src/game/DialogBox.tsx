import './DialogBox.css';

interface DialogBoxProps {
  title?: string;
  speaker?: string;
  lines: string[];
  actionLabel?: string;
  onAction: () => void;
}

export function DialogBox({
  title,
  speaker,
  lines,
  actionLabel = 'Lanjut [Space]',
  onAction,
}: DialogBoxProps) {
  return (
    <div className="dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="dialog-box">
        {title && (
          <p className="dialog-box__eyebrow" id="dialog-title">
            {title}
          </p>
        )}
        {speaker && <p className="dialog-box__speaker">{speaker}</p>}
        <div className="dialog-box__body">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <button type="button" className="dialog-box__btn" onClick={onAction}>
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
