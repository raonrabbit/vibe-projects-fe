"use client";

import { useEffect, useRef, useState } from "react";
import { PAGE_INDICATOR_GUTTER_CLASS } from "../indicatorGutter";
import { RightIndicator, type SliderSection } from "./RightIndicator";

interface PageSliderProps {
  sections: SliderSection[];
}

export function PageSlider({ sections }: PageSliderProps) {
  const [current, setCurrent] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentRef = useRef(0);
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  // Restore navigation state from sessionStorage
  useEffect(() => {
    const sectionId = sessionStorage.getItem("nav_sectionId");
    if (!sectionId) return;
    sessionStorage.removeItem("nav_sectionId");

    const targetIndex = sections.findIndex((s) => s.id === sectionId);
    if (targetIndex === -1) return;

    requestAnimationFrame(() => {
      sectionRefs.current[targetIndex]?.scrollIntoView({ behavior: "auto" });
      setCurrent(targetIndex);
    });
  }, [sections]);

  useEffect(() => {
    const ratios = new Array<number>(sections.length).fill(0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = sectionRefs.current.indexOf(
            entry.target as HTMLDivElement,
          );
          if (index === -1) return;
          ratios[index] = entry.intersectionRatio;
        });

        // Suppress updates while programmatic scroll is in progress
        if (isScrollingRef.current) return;

        let bestIndex = 0;
        let bestRatio = -1;
        ratios.forEach((ratio, index) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIndex = index;
          }
        });
        setCurrent(bestIndex);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [sections.length]);

  const scrollToSection = (index: number) => {
    isScrollingRef.current = true;
    currentRef.current = index;
    setCurrent(index);
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  useEffect(() => {
    let isLocked = false;

    const handleWheel = (e: WheelEvent) => {
      const idx = currentRef.current;
      const section = sectionRefs.current[idx];
      if (!section) return;

      const goingDown = e.deltaY > 0;

      // Not at section boundary — let the browser scroll natively (smooth)
      if (goingDown) {
        const atBottom =
          section.scrollTop + section.clientHeight >= section.scrollHeight - 1;
        if (!atBottom) return;
      } else {
        const atTop = section.scrollTop <= 0;
        if (!atTop) return;
      }

      // At boundary — intercept and navigate to adjacent section
      e.preventDefault();

      if (isLocked) return;

      const nextIndex = goingDown
        ? Math.min(idx + 1, sections.length - 1)
        : Math.max(idx - 1, 0);

      if (nextIndex === idx) return;

      isLocked = true;
      scrollToSection(nextIndex);
      setTimeout(() => {
        isLocked = false;
      }, 800);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [sections.length]);

  return (
    <main className="scrollbar-hide h-screen overflow-y-scroll">
      {sections.map((section, i) => (
        <div
          key={section.id}
          ref={(el) => {
            sectionRefs.current[i] = el;
          }}
          className={`scrollbar-hide h-screen overflow-y-auto ${PAGE_INDICATOR_GUTTER_CLASS}`}
        >
          {section.component}
        </div>
      ))}

      <RightIndicator
        total={sections.length}
        current={current}
        sections={sections}
        onDotClick={scrollToSection}
      />
    </main>
  );
}
