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
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="scrollbar-hide h-screen snap-y snap-mandatory overflow-y-scroll">
      {sections.map((section, i) => (
        <div
          key={section.id}
          ref={(el) => {
            sectionRefs.current[i] = el;
          }}
          className={`snap-start ${PAGE_INDICATOR_GUTTER_CLASS}`}
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
    </div>
  );
}
