"use client";

import type { AnimationPlaybackControlsWithThen } from "framer-motion";
import { animate, motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { RabbitSprite } from "./RabbitSprite";

const RABBIT_H = 33;
const MARGIN = 20;
const HEADER_H = 56;
const HOP_SIZE = 90;

type Phase =
  | "nest"
  | "leaving"
  | "entering-left"
  | "wandering"
  | "hopping"
  | "scrolling"
  | "approaching"
  | "exiting-left"
  | "returning-top";

const ACTIVE_PHASES = new Set<Phase>([
  "wandering",
  "hopping",
  "scrolling",
  "approaching",
]);

// Random Y within the visible viewport (viewport coords, for position:fixed)
function randomViewportY(): number {
  return (
    HEADER_H +
    MARGIN +
    Math.random() *
      Math.max(0, window.innerHeight - RABBIT_H - HEADER_H - MARGIN * 2)
  );
}

function isInViewport(viewportY: number): boolean {
  return viewportY + RABBIT_H > 0 && viewportY < window.innerHeight;
}

function getNestViewportPos() {
  const el = document.getElementById("rabbit-nest");
  if (el) {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top };
  }
  return { x: window.innerWidth - 80, y: (HEADER_H - RABBIT_H) / 2 };
}

export function RabbitCharacter() {
  // All coords are VIEWPORT coords (position: fixed)
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  // Separate page-Y tracking: used during active phases to keep the rabbit at
  // the same page position while the user scrolls.
  const mPageY = useMotionValue(0);

  const [spriteState, setSpriteState] = useState<"idle" | "run" | "react">(
    "idle",
  );
  const [flipX, setFlipX] = useState(false);

  const phaseRef = useRef<Phase>("nest");
  const stopRef = useRef<(() => void) | null>(null);
  const wanderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hopGen = useRef(0);

  // When mPageY changes (during hop animation), sync my = mPageY - scrollY
  useEffect(() => {
    const unsub = mPageY.on("change", (v) => {
      if (ACTIVE_PHASES.has(phaseRef.current)) {
        my.set(v - window.scrollY);
      }
    });
    return unsub;
  }, [mPageY, my]);

  const runAnim = useCallback(
    (ctrl: AnimationPlaybackControlsWithThen): Promise<void> =>
      new Promise<void>((resolve) => {
        const stop = () => {
          ctrl.stop();
          resolve();
        };
        stopRef.current = stop;
        ctrl.then(() => {
          if (stopRef.current === stop) stopRef.current = null;
          resolve();
        });
      }),
    [],
  );

  const interrupt = useCallback(() => {
    hopGen.current++; // invalidate any running hopTo loop
    stopRef.current?.();
    stopRef.current = null;
    if (wanderTimer.current) clearTimeout(wanderTimer.current);
  }, []);

  const dispatchPhase = (phase: Phase) =>
    window.dispatchEvent(
      new CustomEvent("rabbit:phase", { detail: { phase } }),
    );

  const scheduleWanderRef = useRef<() => void>(() => {});

  // targetViewportY: viewport coordinate target
  const hopTo = useCallback(
    async (targetViewportY: number) => {
      const myGen = ++hopGen.current;
      phaseRef.current = "hopping";

      const startPageY = mPageY.get();
      const targetPageY = targetViewportY + window.scrollY;
      const dist = Math.abs(targetPageY - startPageY);
      const count = Math.max(1, Math.ceil(dist / HOP_SIZE));
      const step = (targetPageY - startPageY) / count;

      setSpriteState("run");
      setFlipX(Math.random() < 0.5);

      for (let i = 0; i < count; i++) {
        if (hopGen.current !== myGen) return;
        await runAnim(
          animate(mPageY, startPageY + step * (i + 1), {
            type: "spring",
            stiffness: 250,
            damping: 18,
            mass: 0.6,
          }),
        );
        if (hopGen.current !== myGen) return;
      }

      phaseRef.current = "wandering";
      setSpriteState("idle");
      scheduleWanderRef.current();
    },
    [mPageY, runAnim],
  );

  const scheduleWander = useCallback(() => {
    if (wanderTimer.current) clearTimeout(wanderTimer.current);
    wanderTimer.current = setTimeout(
      () => {
        if (phaseRef.current !== "wandering") return;
        if (Math.random() > 0.35) hopTo(randomViewportY());
        else scheduleWanderRef.current();
      },
      800 + Math.random() * 2500,
    );
  }, [hopTo]);

  useEffect(() => {
    scheduleWanderRef.current = scheduleWander;
  }, [scheduleWander]);

  const doLeave = useCallback(async () => {
    if (phaseRef.current !== "nest") return;
    phaseRef.current = "leaving";
    dispatchPhase("leaving");

    const nest = getNestViewportPos();
    mx.set(nest.x);
    my.set(nest.y);
    setSpriteState("run");
    setFlipX(false);

    // Fly upward off-screen
    await runAnim(
      animate(my, -100, { duration: 0.4, ease: [0.4, 0, 0.8, 0.1] }),
    );
    if (phaseRef.current !== "leaving") return;

    // Pop in from left side
    phaseRef.current = "entering-left";
    const targetVY = randomViewportY();
    mx.set(-60);
    my.set(targetVY);
    setFlipX(false);

    await runAnim(animate(mx, 20, { duration: 0.5, ease: [0.25, 0, 0.05, 1] }));
    if (phaseRef.current !== "entering-left") return;

    // Sync page Y so scroll-tracking works correctly
    mPageY.set(my.get() + window.scrollY);
    phaseRef.current = "wandering";
    dispatchPhase("wandering");
    setSpriteState("idle");
    scheduleWander();
  }, [mx, my, mPageY, runAnim, scheduleWander]);

  const doReturn = useCallback(async () => {
    if (!ACTIVE_PHASES.has(phaseRef.current)) return;
    interrupt();
    if (scrollTimer.current) clearTimeout(scrollTimer.current);

    phaseRef.current = "exiting-left";
    dispatchPhase("exiting-left");
    setSpriteState("run");
    setFlipX(true);
    // my is already at correct viewport Y (kept in sync by scroll handler)

    await runAnim(animate(mx, -80, { duration: 0.4, ease: [0.5, 0, 0.8, 0] }));
    if (phaseRef.current !== "exiting-left") return;

    // Drop from top into nest
    phaseRef.current = "returning-top";
    const nest = getNestViewportPos();
    mx.set(nest.x);
    my.set(-100);
    setFlipX(false);

    await runAnim(
      animate(my, nest.y, {
        type: "spring",
        stiffness: 300,
        damping: 38,
        mass: 0.8,
      }),
    );
    if (phaseRef.current !== "returning-top") return;

    phaseRef.current = "nest";
    dispatchPhase("nest");
    setSpriteState("idle");
  }, [mx, my, runAnim, interrupt]);

  const handleClick = useCallback(() => {
    if (phaseRef.current === "nest") {
      doLeave();
    } else if (ACTIVE_PHASES.has(phaseRef.current)) {
      interrupt();
      hopTo(randomViewportY());
    }
  }, [doLeave, hopTo, interrupt]);

  const triggerReact = useCallback(() => {
    if (phaseRef.current !== "wandering") return;
    setSpriteState("react");
    if (reactTimer.current) clearTimeout(reactTimer.current);
    reactTimer.current = setTimeout(() => setSpriteState("idle"), 700);
  }, []);

  // Init: place rabbit at nest in header
  useEffect(() => {
    const nest = getNestViewportPos();
    mx.set(nest.x);
    my.set(nest.y);
    mPageY.set(nest.y + window.scrollY);
    phaseRef.current = "nest";
    dispatchPhase("nest");
  }, []);

  useEffect(() => {
    const handler = () => doReturn();
    window.addEventListener("rabbit:recall", handler);
    return () => window.removeEventListener("rabbit:recall", handler);
  }, [doReturn]);

  // Scroll: keep the rabbit at the same page position by adjusting viewport Y
  useEffect(() => {
    const onScroll = () => {
      if (!ACTIVE_PHASES.has(phaseRef.current)) return;

      // Keep fixed position tracking page Y
      my.set(mPageY.get() - window.scrollY);

      if (phaseRef.current !== "scrolling") {
        interrupt();
        phaseRef.current = "scrolling";
        setSpriteState("idle");
      }
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(async () => {
        const currVY = my.get(); // viewport Y
        if (isInViewport(currVY)) {
          phaseRef.current = "wandering";
          scheduleWander();
        } else {
          const isAbove = currVY < 0;
          const edgeVY = isAbove
            ? HEADER_H + MARGIN
            : window.innerHeight - RABBIT_H - MARGIN;
          const midVY =
            window.innerHeight * 0.2 +
            Math.random() * Math.max(0, window.innerHeight * 0.6 - RABBIT_H);

          phaseRef.current = "approaching";
          setSpriteState("run");
          const dur = Math.min(
            0.6,
            Math.max(0.2, Math.abs(edgeVY - currVY) / 1500),
          );
          // Animate mPageY so scroll-sync stays consistent
          const edgePageY = edgeVY + window.scrollY;
          await runAnim(
            animate(mPageY, edgePageY, {
              duration: dur,
              ease: [0.25, 0, 0.05, 1],
            }),
          );
          if (phaseRef.current !== "approaching") return;
          hopTo(midVY);
        }
      }, 300);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [my, mPageY, interrupt, scheduleWander, hopTo, runAnim]);

  // Re-sync nest position on resize so the rabbit doesn't disappear when
  // viewport width changes while it's sitting in the header.
  useEffect(() => {
    const onResize = () => {
      if (phaseRef.current !== "nest") return;
      const nest = getNestViewportPos();
      mx.set(nest.x);
      my.set(nest.y);
      mPageY.set(nest.y + window.scrollY);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mx, my, mPageY]);

  useEffect(() => {
    return () => {
      interrupt();
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      if (reactTimer.current) clearTimeout(reactTimer.current);
    };
  }, [interrupt]);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x: mx,
        y: my,
        zIndex: 55,
        cursor: "pointer",
      }}
      onClick={handleClick}
      onHoverStart={triggerReact}
    >
      <RabbitSprite state={spriteState} flipX={flipX} />
    </motion.div>
  );
}
