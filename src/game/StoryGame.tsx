import { Link } from 'react-router-dom';
import {
  formatGameTime,
  formatHmDate,
  SEASON_LABELS,
  TOOL_LABELS,
  TOOL_ORDER,
} from '../data/farmData';
import { storyQuests } from '../data/stories';
import { DialogBox } from './DialogBox';
import { useFarmGame } from './useFarmGame';
import { StoryWorld3D } from './world/StoryWorld3D';
import './StoryGame.css';

export function StoryGame() {
  const {
    phase,
    isPlaying,
    playerRef,
    facingRef,
    moveSpeedRef,
    questIndex,
    currentQuest,
    completedQuests,
    harvestItem,
    dialog,
    activeLore,
    nearbyLabel,
    allDone,
    tiles,
    tool,
    day,
    season,
    minutes,
    stamina,
    hasSeeds,
    advanceDialog,
    continueFromLore,
    finishEpilogue,
  } = useFarmGame();

  const canGetSeeds = phase === 'playing' && !hasSeeds && !harvestItem && !allDone;

  return (
    <div className="story-game">
      <header className="story-game__header">
        <Link to="/shop" className="story-game__back">
          ← Kembali ke Shop
        </Link>
        <div className="story-game__progress">
          Hari {day} · {SEASON_LABELS[season]}
        </div>
      </header>

      <div className="story-game__viewport" aria-label="Dunia 3D RENAOMBER Ranch">
        <StoryWorld3D
          playerRef={playerRef}
          facingRef={facingRef}
          moveSpeedRef={moveSpeedRef}
          isPlaying={isPlaying}
          harvestItem={harvestItem}
          currentQuest={currentQuest}
          completedQuests={completedQuests}
          canGetSeeds={canGetSeeds}
          tiles={tiles}
        />

        <div className="hm-hud hm-hud--btn" aria-live="polite">
          <div className="hm-hud__icon" aria-hidden>🌱</div>
          <div className="hm-hud__info">
            <div className="hm-hud__date">{formatHmDate(day)}</div>
            <div className="hm-hud__clock">{formatGameTime(minutes)}</div>
          </div>
        </div>

        <div className="hm-toolbar">
          <div className="hm-toolbar__stamina">
            <div className="hm-toolbar__stamina-fill" style={{ width: `${stamina}%` }} />
          </div>
          <div className="hm-toolbar__tools">
            {TOOL_ORDER.map((t, i) => (
              <span key={t} className={`hm-toolbar__tool ${tool === t ? 'is-active' : ''}`}>
                {i + 1}
              </span>
            ))}
          </div>
        </div>

        {nearbyLabel && phase === 'playing' && (
          <p className="story-game__hint">{nearbyLabel}</p>
        )}
      </div>

      <aside className="story-game__hud">
        <h1>RENAOMBER Ranch</h1>
        <p className="story-game__hud-desc">
          Simulasi ladang ala Harvest Moon: Back to Nature. Tanam, siram, panen, dan kenalan
          dengan warga sambil buka lore produk.
        </p>

        {currentQuest && !allDone && (
          <div className="story-game__current-crop">
            <p className="story-game__current-label">Panen aktif</p>
            <strong>{currentQuest.packageLabel}</strong>
            <span>Antar ke {currentQuest.npcName} setelah panen</span>
          </div>
        )}

        <ul className="story-game__quest-list">
          {storyQuests.map((quest, index) => {
            const done = completedQuests.includes(quest.id);
            const current = index === questIndex && !done;

            return (
              <li
                key={quest.id}
                className={`story-game__quest-item ${done ? 'is-done' : ''} ${current ? 'is-current' : ''}`}
              >
                <span className="story-game__quest-dot" aria-hidden />
                <div>
                  <strong>{quest.productName}</strong>
                  <span>{quest.npcName}</span>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="story-game__controls">
          1–4 alat ({TOOL_LABELS[tool]}) · WASD jalan · E pakai · {SEASON_LABELS[season]}
        </p>
      </aside>

      {dialog && (
        <DialogBox
          title={dialog.title}
          speaker={dialog.speaker}
          lines={dialog.lines}
          actionLabel={dialog.kind === 'epilogue' ? 'Selesai [Space]' : 'Lanjut [Space]'}
          onAction={dialog.kind === 'epilogue' ? finishEpilogue : advanceDialog}
        />
      )}

      {activeLore && phase === 'lore' && (
        <div className="lore-overlay" role="dialog" aria-modal="true">
          <article className="lore-card">
            <p className="lore-card__product">{activeLore.productName}</p>
            <h2>{activeLore.lore.headline}</h2>
            {activeLore.lore.paragraphs.map((paragraph: string) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="lore-card__actions">
              <button type="button" className="lore-card__btn" onClick={continueFromLore}>
                Musim berikutnya [Space]
              </button>
              <Link to="/shop#shop" className="lore-card__link">
                Lihat di Shop
              </Link>
            </div>
          </article>
        </div>
      )}

      {phase === 'complete' && !dialog && (
        <div className="lore-overlay">
          <article className="lore-card lore-card--epilogue">
            <h2>Semua musim selesai</h2>
            <p>
              Ladang kecil RENAOMBER sudah panen penuh. Empat warga, empat cerita produk —
              mythos brand terus tumbuh.
            </p>
            <div className="lore-card__actions">
              <Link to="/shop#shop" className="lore-card__btn lore-card__btn--link">
                Belanja Sekarang
              </Link>
              <button
                type="button"
                className="lore-card__link"
                onClick={() => window.location.reload()}
              >
                Main lagi
              </button>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
