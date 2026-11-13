import useGameStore, { batchUpdates } from "@/hooks/useGameStore";

// Each side of a battle takes a turn every 100 / speed seconds: a speed-50
// Pokémon attacks every 2 seconds. The clock tracks how far each side is
// toward its next turn. It isn't part of the save: it changes many times a
// second and only matters while the game is open.
const clock = { player: 0, enemy: 0, enemyUuid: null };

// Milliseconds between a Pokémon's turns.
export const turnInterval = (speed) => 100000 / Math.max(speed || 0, 1);

export function resetBattleClock() {
  clock.player = 0;
  clock.enemy = 0;
  clock.enemyUuid = null;
}

// Plays the current battle forward by `ms`, taking each side's turns in the
// order they come due; when both are due at once, the player goes first. A
// new opponent starts both sides from zero.
//
// Stops after `maxTurns` turns and returns the time it didn't get to, so a
// long catch-up can be split into steps. Returns 0 once all the time is
// used, or when there is no battle to play.
export function advanceBattle(ms, maxTurns = Infinity) {
  let remaining = ms;
  for (let turns = 0; turns < maxTurns; turns++) {
    const { battle, player } = useGameStore.getState();
    const enemy = battle.pokemon?.[0];
    const lead = player.party[0];
    if (!enemy || !lead) {
      resetBattleClock();
      return 0;
    }
    if (enemy.uuid !== clock.enemyUuid) {
      resetBattleClock();
      clock.enemyUuid = enemy.uuid;
    }

    const playerWait = turnInterval(lead.speed) - clock.player;
    const enemyWait = turnInterval(enemy.speed) - clock.enemy;
    const wait = Math.max(0, Math.min(playerWait, enemyWait));
    if (wait > remaining) {
      clock.player += remaining;
      clock.enemy += remaining;
      return 0;
    }

    clock.player += wait;
    clock.enemy += wait;
    remaining -= wait;
    if (playerWait <= enemyWait) {
      clock.player = 0;
      useGameStore.getState().handleTurn("player");
    } else {
      clock.enemy = 0;
      useGameStore.getState().handleTurn();
    }
  }
  return remaining;
}

// How far each side is toward its next turn, from 0 to 1, for drawing the
// turn bar.
export function getTurnProgress() {
  const { battle, player } = useGameStore.getState();
  const enemy = battle.pokemon?.[0];
  const lead = player.party[0];
  if (!enemy || !lead || enemy.uuid !== clock.enemyUuid) {
    return { player: 0, enemy: 0 };
  }
  return {
    player: Math.min(1, clock.player / turnInterval(lead.speed)),
    enemy: Math.min(1, clock.enemy / turnInterval(enemy.speed)),
  };
}

// Turns played per step of a catch-up. Between steps the page can redraw
// and respond to clicks.
const TURNS_PER_STEP = 1000;

// Lets the browser redraw and handle clicks, unless nobody can see the page.
// Avoids setTimeout: browsers can hold timers back for up to a second in
// pages they consider in the background, which would stretch a catch-up
// from moments into minutes.
const yieldToBrowser = () => {
  if (typeof document === "undefined" || document.hidden) {
    return Promise.resolve();
  }
  if (globalThis.scheduler?.yield) {
    return globalThis.scheduler.yield();
  }
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => resolve();
    channel.port2.postMessage(null);
  });
};

// Plays `ms` of battle in steps, saving and updating the screen once per
// step instead of once per turn. Stops early when `shouldStop` returns true
// or the battle ends.
export async function catchUpBattle(ms, { shouldStop = () => false } = {}) {
  let remaining = ms;
  while (remaining > 0 && !shouldStop()) {
    remaining = batchUpdates(() => advanceBattle(remaining, TURNS_PER_STEP));
    if (remaining > 0) {
      await yieldToBrowser();
    }
  }
}
