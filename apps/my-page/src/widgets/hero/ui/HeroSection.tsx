import Image from "next/image";
import { cn } from "@/shared/lib/cn";
import { PROFILE } from "@/shared/config/profile";
import { HERO_SECTION_MIN_H_CLASS } from "@/shared/config/sectionMinHeights";
import { HeroTextContent } from "./HeroTextContent";

export function HeroSection() {
  return (
    <section
      className={`flex ${HERO_SECTION_MIN_H_CLASS} items-center justify-center px-6 py-16 sm:py-24`}
    >
      <div className="flex flex-col items-center gap-10 text-center md:flex-row md:items-center md:gap-20 md:text-left">
        <div className="shrink-0">
          <div className="relative h-44 w-44 overflow-hidden rounded-full ring-2 ring-black/10 md:h-56 md:w-56 dark:ring-white/10">
            <Image
              src={PROFILE.photo}
              alt={PROFILE.name}
              fill
              className="object-cover"
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 176px, 224px"
            />
            <div
              className={cn(
                "flex h-full w-full items-center justify-center",
                "bg-zinc-100 text-4xl font-bold text-zinc-400",
                "dark:bg-zinc-800 dark:text-zinc-500",
              )}
            >
              JH
            </div>
          </div>
        </div>

        <HeroTextContent />
      </div>
    </section>
  );
}
