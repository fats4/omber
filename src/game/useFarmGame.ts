import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createFarmTiles,
  DAY_END_MINUTES,
  DAY_START_MINUTES,
  FARMHOUSE_POSITION,
  GROWTH_STAGES,
  MAX_STAMINA,
  MINUTES_PER_REAL_SECOND,
  SEASONS,
  TOOL_ORDER,
  type FarmTile,
  type FarmTool,
  type Season,
} from '../data/farmData';
import { gameIntro, PLAYER_START, storyQuests, type StoryQuest } from '../data/stories';
import { bindKeyboard } from './input';
import { INTERACT_RADIUS } from './world/constants';
import { facingToward, flatDistance, type FlatCoord } from './world/flatCoords';

export type GamePhase =
  | 'intro'
  | 'playing'
  | 'dialog'
  | 'lore'
  | 'complete';

export type DialogKind = 'intro' | 'seeds' | 'sleep' | 'greet' | 'thank' | 'epilogue';

interface DialogState {
  kind: DialogKind;
  title?: string;
  lines: string[];
  speaker?: string;
}

export type PlayerPosition = FlatCoord;

const TILE_RADIUS = 1.05;

function findNearestTile(tiles: FarmTile[], player: FlatCoord): FarmTile | null {
  let best: FarmTile | null = null;
  let bestDist = TILE_RADIUS;

  for (const tile of tiles) {
    const dist = flatDistance(player, tile.coord);
    if (dist < bestDist) {
      bestDist = dist;
      best = tile;
    }
  }

  return best;
}

function seasonForDay(day: number): Season {
  return SEASONS[Math.floor((day - 1) / 30) % SEASONS.length];
}

export function useFarmGame() {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [questIndex, setQuestIndex] = useState(0);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [activeLore, setActiveLore] = useState<StoryQuest | null>(null);
  const [nearbyLabel, setNearbyLabel] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tiles, setTiles] = useState<FarmTile[]>(() => createFarmTiles());
  const [tool, setTool] = useState<FarmTool>('hoe');
  const [day, setDay] = useState(1);
  const [minutes, setMinutes] = useState(DAY_START_MINUTES);
  const [stamina, setStamina] = useState(MAX_STAMINA);
  const [hasSeeds, setHasSeeds] = useState(false);
  const [harvestItem, setHarvestItem] = useState<string | null>(null);

  const playerRef = useRef<PlayerPosition>({ ...PLAYER_START });
  const facingRef = useRef(facingToward(PLAYER_START, FARMHOUSE_POSITION));
  const moveSpeedRef = useRef(0);
  const phaseRef = useRef(phase);
  const questIndexRef = useRef(questIndex);
  const toolRef = useRef(tool);
  const tilesRef = useRef(tiles);
  const hasSeedsRef = useRef(hasSeeds);
  const harvestItemRef = useRef(harvestItem);
  const staminaRef = useRef(stamina);
  const minutesRef = useRef(minutes);

  phaseRef.current = phase;
  questIndexRef.current = questIndex;
  toolRef.current = tool;
  tilesRef.current = tiles;
  hasSeedsRef.current = hasSeeds;
  harvestItemRef.current = harvestItem;
  staminaRef.current = stamina;
  minutesRef.current = minutes;

  const currentQuest = storyQuests[questIndex] ?? null;
  const allDone = questIndex >= storyQuests.length;
  const season = seasonForDay(day);

  useEffect(() => bindKeyboard(), []);

  useEffect(() => {
    setIsPlaying(phase === 'playing');
  }, [phase]);

  useEffect(() => {
    function onEscape(e: KeyboardEvent) {
      if (e.key !== 'Escape' || phaseRef.current !== 'playing') return;
      setPhase('intro');
      setIsPlaying(false);
      setDialog({
        kind: 'intro',
        title: 'RENAOMBER Ranch',
        lines: ['Kembali ke intro. Tekan lanjut untuk melanjutkan.'],
      });
    }
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, []);

  useEffect(() => {
    function onToolKey(e: KeyboardEvent) {
      if (phaseRef.current !== 'playing') return;
      const idx = Number.parseInt(e.key, 10);
      if (idx >= 1 && idx <= TOOL_ORDER.length) {
        setTool(TOOL_ORDER[idx - 1]);
      }
    }
    window.addEventListener('keydown', onToolKey);
    return () => window.removeEventListener('keydown', onToolKey);
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;

    const interval = window.setInterval(() => {
      setMinutes((prev) => {
        const next = Math.min(prev + MINUTES_PER_REAL_SECOND, DAY_END_MINUTES);
        minutesRef.current = next;
        return next;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [phase]);

  const spendStamina = useCallback((cost: number) => {
    setStamina((prev) => Math.max(0, prev - cost));
  }, []);

  const advanceDay = useCallback(() => {
    setTiles((prev) =>
      prev.map((tile) => {
        if (tile.state === 'planted') {
          if (tile.watered) {
            const nextStage = tile.growthStage + 1;
            if (nextStage >= GROWTH_STAGES) {
              return { ...tile, state: 'ready', growthStage: GROWTH_STAGES, watered: false };
            }
            return { ...tile, growthStage: nextStage, watered: false };
          }
          return { ...tile, watered: false };
        }
        return { ...tile, watered: false };
      }),
    );

    setDay((prev) => prev + 1);
    setMinutes(DAY_START_MINUTES);
    minutesRef.current = DAY_START_MINUTES;
    setStamina(MAX_STAMINA);
    setHasSeeds(false);
  }, []);

  useEffect(() => {
    if (phase !== 'playing') {
      setNearbyLabel(null);
      return;
    }

    const interval = window.setInterval(() => {
      const p = playerRef.current;
      const quest = storyQuests[questIndexRef.current] ?? null;
      const tile = findNearestTile(tilesRef.current, p);

      if (tile && flatDistance(p, tile.coord) < TILE_RADIUS) {
        setNearbyLabel(`Ladang — ${toolRef.current} [E]`);
        return;
      }

      if (flatDistance(p, FARMHOUSE_POSITION) < INTERACT_RADIUS) {
        if (minutesRef.current >= DAY_END_MINUTES - 60) {
          setNearbyLabel('Rumah — Tidur [E]');
          return;
        }
        if (!hasSeedsRef.current && quest && !harvestItemRef.current) {
          setNearbyLabel('Rumah — Ambil benih [E]');
          return;
        }
        setNearbyLabel('Rumah RENAOMBER');
        return;
      }

      if (
        harvestItemRef.current &&
        quest &&
        harvestItemRef.current === quest.id &&
        flatDistance(p, quest.position) < INTERACT_RADIUS
      ) {
        setNearbyLabel(`${quest.npcName} — Berikan hasil panen [E]`);
        return;
      }

      setNearbyLabel(null);
    }, 120);

    return () => window.clearInterval(interval);
  }, [phase, questIndex, hasSeeds, harvestItem, tool, tiles]);

  const startIntro = useCallback((lines: string[], title?: string) => {
    setDialog({ kind: 'intro', title, lines });
    setPhase('dialog');
  }, []);

  useEffect(() => {
    startIntro(gameIntro.lines, gameIntro.title);
  }, [startIntro]);

  const useToolOnTile = useCallback(
    (tile: FarmTile) => {
      if (staminaRef.current <= 0) {
        setDialog({
          kind: 'sleep',
          speaker: 'Diri sendiri',
          lines: ['Stamina habis… Kamu perlu tidur di rumah.'],
        });
        setPhase('dialog');
        return;
      }

      const quest = storyQuests[questIndexRef.current] ?? null;
      const activeTool = toolRef.current;

      if (activeTool === 'hoe' && tile.state === 'grass') {
        spendStamina(3);
        setTiles((prev) =>
          prev.map((t) => (t.row === tile.row && t.col === tile.col ? { ...t, state: 'tilled' } : t)),
        );
        return;
      }

      if (activeTool === 'seeds' && tile.state === 'tilled' && hasSeedsRef.current && quest) {
        spendStamina(4);
        setHasSeeds(false);
        setTiles((prev) =>
          prev.map((t) =>
            t.row === tile.row && t.col === tile.col
              ? { ...t, state: 'planted', growthStage: 0, watered: false }
              : t,
          ),
        );
        return;
      }

      if (activeTool === 'watering' && tile.state === 'planted' && !tile.watered) {
        spendStamina(2);
        setTiles((prev) =>
          prev.map((t) => (t.row === tile.row && t.col === tile.col ? { ...t, watered: true } : t)),
        );
        return;
      }

      if (activeTool === 'basket' && tile.state === 'ready' && quest) {
        spendStamina(2);
        setHarvestItem(quest.id);
        setTiles((prev) =>
          prev.map((t) =>
            t.row === tile.row && t.col === tile.col
              ? { ...t, state: 'tilled', growthStage: 0, watered: false }
              : t,
          ),
        );
      }
    },
    [spendStamina],
  );

  const interact = useCallback(() => {
    if (phaseRef.current !== 'playing') return;

    const p = playerRef.current;
    const quest = storyQuests[questIndexRef.current] ?? null;
    const done = questIndexRef.current >= storyQuests.length;
    const tile = findNearestTile(tilesRef.current, p);

    if (tile && flatDistance(p, tile.coord) < TILE_RADIUS) {
      useToolOnTile(tile);
      return;
    }

    if (flatDistance(p, FARMHOUSE_POSITION) < INTERACT_RADIUS) {
      if (minutesRef.current >= DAY_END_MINUTES - 60 || staminaRef.current <= 0) {
        setDialog({
          kind: 'sleep',
          speaker: 'Diri sendiri',
          lines: [
            'Hari sudah gelap. Kamu tidur nyenyak…',
            'Besok pagi ladang menunggu lagi.',
          ],
        });
        setPhase('dialog');
        return;
      }

      if (!hasSeedsRef.current && !harvestItemRef.current && quest && !done) {
        setHasSeeds(true);
        setDialog({
          kind: 'seeds',
          speaker: 'Gudang rumah',
          lines: [
            `Benih ${quest.packageLabel} sudah siap.`,
            'Cangkul tanah, tanam, siram setiap hari, lalu panen saat matang.',
          ],
        });
        setPhase('dialog');
      }
      return;
    }

    if (
      harvestItemRef.current &&
      quest &&
      harvestItemRef.current === quest.id &&
      flatDistance(p, quest.position) < INTERACT_RADIUS
    ) {
      setDialog({
        kind: 'greet',
        speaker: quest.npcName,
        lines: [quest.greetLine],
      });
      setPhase('dialog');
    }
  }, [useToolOnTile]);

  const advanceDialog = useCallback(() => {
    if (!dialog) return;
    const quest = storyQuests[questIndexRef.current] ?? null;

    if (dialog.kind === 'sleep') {
      advanceDay();
      setDialog(null);
      setPhase('playing');
      return;
    }

    if (dialog.kind === 'greet' && quest) {
      setDialog({
        kind: 'thank',
        speaker: quest.npcName,
        lines: [quest.thankLine],
      });
      return;
    }

    if (dialog.kind === 'thank' && quest) {
      setHarvestItem(null);
      setCompletedQuests((prev) => [...prev, quest.id]);
      setTiles(createFarmTiles());
      setActiveLore(quest);
      setDialog(null);
      setPhase('lore');
      return;
    }

    if (dialog.kind === 'seeds' || dialog.kind === 'intro') {
      setDialog(null);
      setPhase('playing');
      return;
    }

    setDialog(null);
    setPhase('playing');
  }, [dialog, advanceDay]);

  const continueFromLore = useCallback(() => {
    setActiveLore(null);
    const nextIndex = questIndex + 1;

    if (nextIndex >= storyQuests.length) {
      setPhase('complete');
      setQuestIndex(nextIndex);
      return;
    }

    setQuestIndex(nextIndex);
    setPhase('playing');
  }, [questIndex]);

  const finishEpilogue = useCallback(() => {
    setDialog(null);
  }, []);

  useEffect(() => {
    function onInteractKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() !== 'e' && e.key !== ' ') return;
      if (phaseRef.current === 'playing') {
        e.preventDefault();
        interact();
      } else if (phaseRef.current === 'dialog' || phaseRef.current === 'complete') {
        e.preventDefault();
        if (dialog?.kind === 'epilogue') {
          finishEpilogue();
        } else {
          advanceDialog();
        }
      } else if (phaseRef.current === 'lore') {
        e.preventDefault();
        continueFromLore();
      }
    }

    window.addEventListener('keydown', onInteractKey);
    return () => window.removeEventListener('keydown', onInteractKey);
  }, [dialog, interact, advanceDialog, continueFromLore, finishEpilogue]);

  return {
    phase,
    isPlaying,
    playerRef,
    facingRef,
    moveSpeedRef,
    questIndex,
    questTotal: storyQuests.length,
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
  };
}
