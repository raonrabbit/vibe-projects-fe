"use client";

import { SkillItem, SkillCategory, SKILL_CATEGORIES } from "@/entities/skill";
import { Button } from "@/shared";
import { useState } from "react";
import { SKILLS_SECTION_MIN_H_CLASS } from "@/shared/config/sectionMinHeights";

function SkillCategoryButton({
  label,
  isActive,
  onSelect,
}: {
  label: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <Button variant={isActive ? "solid" : "pill"} size="md" onClick={onSelect}>
      {label}
    </Button>
  );
}

function SkillGrid({
  skillCategories,
  currentCategory,
  onSelectCategory,
}: {
  skillCategories: SkillCategory[];
  currentCategory: string | null;
  onSelectCategory: (category: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-12">
      <div className="grid grid-cols-3 gap-3">
        {skillCategories.map((sc) => (
          <SkillCategoryButton
            key={sc.category}
            label={sc.category}
            isActive={sc.category === currentCategory}
            onSelect={() => onSelectCategory(sc.category)}
          />
        ))}
      </div>
      <div className="grid grid-cols-5 gap-y-6">
        {skillCategories.map((skillCategory) =>
          skillCategory.skills.map((skill) => (
            <div
              key={`${skillCategory.category}-${skill.slug}`}
              className={`${currentCategory && (skillCategory.category !== currentCategory ? "blur" : "")} transition-all delay-75`}
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
  );
}

export function SkillsSection() {
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const handleToggleButton = (category: string) => {
    if (currentCategory === category) setCurrentCategory(null);
    else setCurrentCategory(category);
  };

  return (
    <section
      className={`flex ${SKILLS_SECTION_MIN_H_CLASS} flex-col items-center justify-center gap-8 px-6 py-12 sm:gap-12`}
    >
      <h2 className="text-4xl font-bold text-black dark:text-white">Skills</h2>
      <div className="w-full space-y-8">
        <SkillGrid
          skillCategories={SKILL_CATEGORIES}
          currentCategory={currentCategory}
          onSelectCategory={handleToggleButton}
        />
      </div>
    </section>
  );
}
