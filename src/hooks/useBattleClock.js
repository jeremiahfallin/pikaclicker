import { useEffect } from "react";
import useGameStore from "@/hooks/useGameStore";
import { advanceBattle, catchUpBattle } from "@/game/battleClock";
import {
  planCatchUp,
  progressSnapshot,
  readLastBattle,
  recordLastBattle,
  summarizeProgress,
  useAwayStore,
} from "@/game/away";

// When the previous visit last ran a battle, read once as the game loads.
// The first battle of this visit picks up from there.
let previousVisit = typeof window === "undefined" ? null : readLastBattle();

const RECORD_EVERY_MS = 1000;

const isWildBattle = () => {
  const { battle } = useGameStore.getState();
  return !!battle.pokemon && !battle.isTrainer;
};

async function catchUp(plan, awayMs, shouldStop) {
  const before = progressSnapshot(useGameStore.getState());
  if (plan.showSummary) {
    useAwayStore.setState({
      status: "catching-up",
      awayMs,
      creditedMs: plan.ms,
      summary: null,
    });
  }
  await catchUpBattle(plan.ms, { shouldStop });
  if (plan.showSummary) {
    useAwayStore.setState({
      status: "done",
      summary: summarizeProgress(
        before,
        progressSnapshot(useGameStore.getState())
      ),
    });
  }
}

// Runs the current battle in real time while the Battle component is on
// screen, including in background tabs, and catches up on time the page was
// closed, asleep or frozen.
export default function useBattleClock() {
  useEffect(() => {
    let lastTick = Date.now();
    if (previousVisit) {
      if (previousVisit.wild && previousVisit.at < lastTick) {
        lastTick = previousVisit.at;
      }
      previousVisit = null;
    }
    let lastRecorded = 0;
    let busy = false;
    let stopped = false;

    const tick = () => {
      if (stopped || busy) return;
      const now = Date.now();
      const gap = now - lastTick;
      lastTick = now;

      const { isTrainer } = useGameStore.getState().battle;
      const plan = planCatchUp(gap, { isTrainer });
      if (plan.mode === "live") {
        advanceBattle(plan.ms);
      } else {
        busy = true;
        catchUp(plan, gap, () => stopped).finally(() => {
          busy = false;
        });
      }

      if (now - lastRecorded >= RECORD_EVERY_MS) {
        recordLastBattle(now, isWildBattle());
        lastRecorded = now;
      }
    };

    // Animation frames keep turns smooth while the page is visible. Browsers
    // pause them in background tabs, where the interval keeps going.
    let frame;
    const onFrame = () => {
      tick();
      frame = requestAnimationFrame(onFrame);
    };
    frame = requestAnimationFrame(onFrame);
    const interval = setInterval(tick, 1000);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      clearInterval(interval);
      // Leaving the battle: time from here on earns nothing.
      recordLastBattle(Date.now(), false);
    };
  }, []);
}
