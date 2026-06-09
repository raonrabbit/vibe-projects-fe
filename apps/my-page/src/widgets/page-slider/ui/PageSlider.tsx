"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useActiveSection } from "@/features/active-section";

export interface SliderSection {
  id: string;
  label: string;
  component: React.ReactNode;
}

interface PageSliderProps {
  sections: SliderSection[];
}

export function PageSlider({ sections }: PageSliderProps) {
  const [current, setCurrent] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { setActiveSection, registerScrollToSection } = useActiveSection();

  useEffect(() => {
    setActiveSection(sections[current]?.id ?? "hero");
  }, [current, sections, setActiveSection]);

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

  const scrollToIndex = useCallback((index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollById = useCallback(
    (id: string) => {
      const index = sections.findIndex((s) => s.id === id);
      if (index !== -1) scrollToIndex(index);
    },
    [sections, scrollToIndex],
  );

  useEffect(() => {
    registerScrollToSection(scrollById);
  }, [registerScrollToSection, scrollById]);

  return (
    <main className="pt-14">
      {sections.map((section, i) => (
        <div
          key={section.id}
          ref={(el) => {
            sectionRefs.current[i] = el;
          }}
        >
          {section.component}
        </div>
      ))}
    </main>
  );
}
