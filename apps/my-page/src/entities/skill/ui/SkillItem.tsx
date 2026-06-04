import { Label } from "@/shared";
import { SimpleIcon } from "@/shared/ui/SimpleIcon";

import type { Skill } from "../model/skills";

function SkillItemRoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-3 px-2">
      {children}
    </div>
  );
}

function SkillItemIcon({ slug, name }: Skill) {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5">
      <SimpleIcon
        slug={slug}
        alt={name}
        size={36}
        className="h-9 w-9 object-contain"
      />
    </div>
  );
}

function SkillItemLabel({ name }: { name: string }) {
  return <Label size="xs">{name}</Label>;
}

export const SkillItem = Object.assign(SkillItemRoot, {
  Icon: SkillItemIcon,
  Label: SkillItemLabel,
});
