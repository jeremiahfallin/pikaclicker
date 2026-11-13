import { create } from "zustand";

// Gaps up to this long (a busy page, a background tab the browser slows
// down) are played straight through.
export const LIVE_LIMIT_MS = 10 * 1000;
// The most battle time a wild battle gets for time away.
export const MAX_AWAY_MS = 8 * 60 * 60 * 1000;
// Players away at least this long get a summary of what happened.
export const AWAY_SUMMARY_MS = 5 * 60 * 1000;
// The most time a gym battle plays through after a gap. Gym battles end
// long before this; the cap only guards against odd clocks.
const TRAINER_LIMIT_MS = 10 * 60 * 1000;

// Decides how to handle `gapMs` of time since the battle last ran:
// - "live": play it now, in one go.
// - "catch-up": play it in steps (wild battles), capped at MAX_AWAY_MS, with
//   a summary for the player if they were gone long enough.
export function planCatchUp(gapMs, { isTrainer }) {
  if (gapMs <= LIVE_LIMIT_MS) {
    return { mode: "live", ms: gapMs };
  }
  if (isTrainer) {
    return { mode: "live", ms: Math.min(gapMs, TRAINER_LIMIT_MS) };
  }
  return {
    mode: "catch-up",
    ms: Math.min(gapMs, MAX_AWAY_MS),
    showSummary: gapMs >= AWAY_SUMMARY_MS,
  };
}

// The parts of the game a summary reports on.
export function progressSnapshot(state) {
  const { player } = state;
  return {
    coins: player.coins,
    party: player.party.map((p) => ({
      uuid: p.uuid,
      level: p.level,
      knockOuts: p.pokemonKnockedOut || 0,
    })),
    owned: player.party.length + player.bank.length,
    pokedexCaught: player.pokedex.caught.size,
    balls: player.items
      .filter((item) => item.type === "ball")
      .reduce((total, item) => total + item.quantity, 0),
    isInTown: player.isInTown,
  };
}

// What changed between two snapshots.
export function summarizeProgress(before, after) {
  const beforeByUuid = new Map(before.party.map((p) => [p.uuid, p]));
  let defeated = 0;
  let levels = 0;
  for (const pokemon of after.party) {
    const earlier = beforeByUuid.get(pokemon.uuid);
    if (earlier) {
      defeated += pokemon.knockOuts - earlier.knockOuts;
      levels += pokemon.level - earlier.level;
    } else {
      // Caught while away.
      defeated += pokemon.knockOuts;
    }
  }
  return {
    coins: after.coins - before.coins,
    defeated,
    caught: after.owned - before.owned,
    newSpecies: after.pokedexCaught - before.pokedexCaught,
    levels,
    ballsUsed: Math.max(0, before.balls - after.balls),
    sentHome: after.isInTown && !before.isInTown,
  };
}

// "2h 5m", "45m", "30s".
export function formatDuration(ms) {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${Math.max(0, Math.round(ms / 1000))}s`;
}

// What the "welcome back" dialog shows. status is null (closed),
// "catching-up" or "done".
export const useAwayStore = create(() => ({
  status: null,
  awayMs: 0,
  creditedMs: 0,
  summary: null,
}));

// When the page last ran a battle, kept apart from the save so the save
// isn't rewritten every second. `wild` is false once the player leaves a
// battle or enters a gym, so time spent elsewhere earns nothing.
const LAST_BATTLE_KEY = "pokeclicker-last-battle";

export function recordLastBattle(at, wild) {
  try {
    localStorage.setItem(LAST_BATTLE_KEY, JSON.stringify({ at, wild }));
  } catch {
    // Storage can be full or blocked; the game still plays.
  }
}

export function readLastBattle() {
  try {
    const value = JSON.parse(localStorage.getItem(LAST_BATTLE_KEY));
    return typeof value?.at === "number" ? value : null;
  } catch {
    return null;
  }
}
