import { AwardsSection } from "@/widgets/awards";
import { HeroSection } from "@/widgets/hero";
import { PageSlider } from "@/widgets/page-slider";
import { ProjectsSection } from "@/widgets/projects";
import { SkillsSection } from "@/widgets/skills";

const SECTIONS = [
  { id: "hero", label: "소개", component: <HeroSection /> },
  { id: "skills", label: "스킬", component: <SkillsSection /> },
  { id: "awards", label: "수상", component: <AwardsSection /> },
  { id: "projects", label: "프로젝트", component: <ProjectsSection /> },
];

export default function Home() {
  return <PageSlider sections={SECTIONS} />;
}
