export interface Skill {
  name: string;
  slug: string; // simpleicons.org slug
  invertInDark?: true;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: "Frontend",
    skills: [
      { name: "React", slug: "react" },
      { name: "Next.js", slug: "nextjs" },
      { name: "TypeScript", slug: "typescript" },
      { name: "JavaScript", slug: "javascript" },
      { name: "Tailwind CSS", slug: "tailwindcss" },
      { name: "Tanstack Query", slug: "reactquery", invertInDark: true },
      { name: "Zustand", slug: "zustand" },
      { name: "Electron", slug: "electron" },
    ],
  },
  {
    category: "3D / Graphics",
    skills: [
      { name: "Three.js", slug: "threejs", invertInDark: true },
      { name: "Blender", slug: "blender" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Spring Boot", slug: "spring" },
      { name: "Python", slug: "python" },
    ],
  },
  {
    category: "Design",
    skills: [{ name: "Figma", slug: "figma" }],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git", slug: "git" },
      { name: "GitHub", slug: "github", invertInDark: true },
      { name: "Jira", slug: "jira" },
    ],
  },
  {
    category: "AI",
    skills: [
      { name: "Cursor", slug: "cursor" },
      { name: "Claude", slug: "claudecode" },
    ],
  },
];
