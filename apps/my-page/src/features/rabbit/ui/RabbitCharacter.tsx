"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RabbitSprite } from "./RabbitSprite";

const RABBIT_H = 33;
const MARGIN = 20;
const HEADER_H = 56;
const HOP_SIZE = 90; // 한 번의 점프로 이동하는 px

// 각 hop의 spring 설정: underdamped(ζ≈0.44)로 착지 시 약 20% 오버슈트
const HOP_SPRING = {
  type: "spring" as const,
  stiffness: 250,
  damping: 18,
  mass: 0.6,
};

function randomViewportY(): number {
  const scrollY = window.scrollY;
  const viewportH = window.innerHeight;
  return (
    HEADER_H +
    MARGIN +
    scrollY +
    Math.random() * Math.max(0, viewportH - RABBIT_H - HEADER_H - MARGIN * 2)
  );
}

function isInViewport(pageY: number): boolean {
  const scrollY = window.scrollY;
  const viewportH = window.innerHeight;
  return pageY + RABBIT_H > scrollY && pageY < scrollY + viewportH;
}

// wandering: 뷰포트 내 배회 (hop 이동 중에는 hopping)
// scrolling: 스크롤 중 (토끼 Y 고정)
// approaching: 뷰포트 밖에서 경계까지 빠르게 달려옴
// hopping: 뷰포트 내에서 껑충껑충
type Phase = "wandering" | "scrolling" | "approaching" | "hopping";

export function RabbitCharacter() {
  const [pageY, setPageY] = useState<number | null>(null);
  const [spriteState, setSpriteState] = useState<"idle" | "run" | "react">(
    "idle",
  );
  const [flipX, setFlipX] = useState(false);

  const phaseRef = useRef<Phase>("wandering");
  const scheduleWanderRef = useRef<() => void>(() => {});
  const pageYRef = useRef(0);
  const hopQueueRef = useRef<number[]>([]);
  const hopIndexRef = useRef(0);
  const finalYRef = useRef(0); // approach 완료 후 hop 착지 목표
  const approachDurRef = useRef(0.5);
  const wanderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialized = useRef(false);

  // 목표까지의 거리를 HOP_SIZE 단위로 쪼개 hop 배열 생성 후 첫 hop 시작
  const startHops = useCallback((targetY: number) => {
    const startY = pageYRef.current;
    const totalDist = Math.abs(targetY - startY);
    const hopCount = Math.max(1, Math.ceil(totalDist / HOP_SIZE));
    const hopSize = (targetY - startY) / hopCount;

    hopQueueRef.current = Array.from(
      { length: hopCount },
      (_, i) => startY + hopSize * (i + 1),
    );
    hopIndexRef.current = 0;
    phaseRef.current = "hopping";
    setFlipX(Math.random() < 0.5);

    const firstY = hopQueueRef.current[0];
    pageYRef.current = firstY;
    setSpriteState("run");
    setPageY(firstY);
  }, []);

  const scheduleWander = useCallback(() => {
    if (wanderTimerRef.current) clearTimeout(wanderTimerRef.current);
    const delay = 800 + Math.random() * 2500;
    wanderTimerRef.current = setTimeout(() => {
      if (phaseRef.current !== "wandering") return;
      if (Math.random() > 0.35) {
        startHops(randomViewportY());
      } else {
        scheduleWanderRef.current(); // 가만히 있음
      }
    }, delay);
  }, [startHops]);

  useEffect(() => {
    scheduleWanderRef.current = scheduleWander;
  }, [scheduleWander]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const y = randomViewportY();
    pageYRef.current = y;
    setPageY(y);
    scheduleWander();
    return () => {
      if (wanderTimerRef.current) clearTimeout(wanderTimerRef.current);
    };
  }, [scheduleWander]);

  useEffect(() => {
    const onScroll = () => {
      if (phaseRef.current !== "scrolling") {
        if (wanderTimerRef.current) clearTimeout(wanderTimerRef.current);
        hopQueueRef.current = []; // 진행 중인 hop 큐 초기화
        phaseRef.current = "scrolling";
        setSpriteState("idle");
      }

      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        if (isInViewport(pageYRef.current)) {
          phaseRef.current = "wandering";
          scheduleWander();
        } else {
          const scrollY = window.scrollY;
          const viewportH = window.innerHeight;
          const isAbove = pageYRef.current < scrollY;

          // 1단계: 뷰포트 경계까지 빠르게
          const edgeY = isAbove
            ? scrollY + HEADER_H + MARGIN
            : scrollY + viewportH - RABBIT_H - MARGIN;

          // 2단계: 뷰포트 중앙부(20~80%) 랜덤 착지
          const midMin = scrollY + viewportH * 0.2;
          const midMax = scrollY + viewportH * 0.8 - RABBIT_H;
          finalYRef.current =
            midMin + Math.random() * Math.max(0, midMax - midMin);

          const distance = Math.abs(edgeY - pageYRef.current);
          approachDurRef.current = Math.min(
            0.6,
            Math.max(0.2, distance / 1500),
          );

          phaseRef.current = "approaching";
          pageYRef.current = edgeY;
          setSpriteState("run");
          setPageY(edgeY);
        }
      }, 300);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, [scheduleWander]);

  const onAnimationComplete = useCallback(() => {
    const phase = phaseRef.current;

    if (phase === "approaching") {
      // 경계 도착 → hop으로 착지
      startHops(finalYRef.current);
    } else if (phase === "hopping") {
      hopIndexRef.current++;
      if (hopIndexRef.current < hopQueueRef.current.length) {
        // 다음 hop
        const nextY = hopQueueRef.current[hopIndexRef.current];
        pageYRef.current = nextY;
        setPageY(nextY);
      } else {
        // 모든 hop 완료
        setSpriteState("idle");
        phaseRef.current = "wandering";
        scheduleWander();
      }
    }
    // "scrolling": 진행 중이던 hop이 자연스럽게 끝남 (별도 처리 불필요)
  }, [scheduleWander, startHops]);

  const triggerReact = useCallback(() => {
    if (phaseRef.current !== "wandering") return;
    setSpriteState("react");
    if (reactTimerRef.current) clearTimeout(reactTimerRef.current);
    reactTimerRef.current = setTimeout(() => setSpriteState("idle"), 700);
  }, []);

  if (pageY === null) return null;

  const isRunning = spriteState === "run";
  // eslint-disable-next-line react-hooks/refs
  const phase = phaseRef.current;

  const transition = (() => {
    if (!isRunning) return { duration: 0 };
    if (phase === "approaching") {
      return {
        // eslint-disable-next-line react-hooks/refs
        duration: approachDurRef.current,
        ease: [0.25, 0, 0.05, 1] as const,
      };
    }
    return HOP_SPRING; // hopping: 각 hop마다 spring으로 탱탱 튀김
  })();

  return (
    <motion.div
      style={{ position: "absolute", left: 20, zIndex: 40, cursor: "pointer" }}
      initial={false}
      animate={{ top: pageY }}
      transition={transition}
      onAnimationComplete={onAnimationComplete}
      onHoverStart={triggerReact}
      onClick={triggerReact}
    >
      <RabbitSprite state={spriteState} direction="down" flipX={flipX} />
    </motion.div>
  );
}
