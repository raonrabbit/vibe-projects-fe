import Link from "next/link";

import { ThemeToggle } from "@/features/theme";
import { Badge, Button } from "@/shared/ui";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <span className="type-heading-2 text-text-primary">
            Dev &amp; AI News
          </span>
          <Badge variant="default" size="sm">
            Korea
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              로그인
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
