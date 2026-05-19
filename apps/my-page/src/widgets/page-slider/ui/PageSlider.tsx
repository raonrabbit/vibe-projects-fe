"use client";

import { useEffect, useRef, useState } from "react";
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(
              entry.target as HTMLDivElement,
            );
            if (index !== -1) setCurrent(index);
          }
        });
      },
      { threshold: 0.6 },
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

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
          className="h-screen snap-start"
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
