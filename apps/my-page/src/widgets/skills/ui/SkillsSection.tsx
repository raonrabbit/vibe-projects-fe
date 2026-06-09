"use client";

import { useState } from "react";
import { SkillItem, SKILL_CATEGORIES } from "@/entities/skill";
import { Button, cn } from "@/shared";
import { SKILLS_SECTION_MIN_H_CLASS } from "@/shared/config/sectionMinHeights";

export function SkillsSection() {
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  const handleToggle = (category: string) => {
    setCurrentCategory((prev) => (prev === category ? null : category));
  };

  return (
    <section
      className={`flex ${SKILLS_SECTION_MIN_H_CLASS} flex-col items-center justify-center gap-8 px-6 py-12 sm:gap-12`}
    >
      <h2 className="text-4xl font-bold text-black dark:text-white">Skills</h2>

      <div className="flex flex-col items-center gap-12">
        <div className="grid grid-cols-3 gap-3">
          {SKILL_CATEGORIES.map((sc) => (
            <Button
              key={sc.category}
              variant={sc.category === currentCategory ? "solid" : "pill"}
              size="md"
              onClick={() => handleToggle(sc.category)}
            >
              {sc.category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-y-6 sm:grid-cols-4 lg:grid-cols-5">
          {SKILL_CATEGORIES.map((sc) =>
            sc.skills.map((skill) => (
              <div
                key={`${sc.category}-${skill.slug}`}
                className={cn(
                  "transition-[filter] delay-75",
                  currentCategory !== null &&
                    sc.category !== currentCategory &&
                    "blur",
                )}
              >
                <SkillItem>
                  <SkillItem.Icon {...skill} />
                  <SkillItem.Label name={skill.name} />
                </SkillItem>
              </div>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
