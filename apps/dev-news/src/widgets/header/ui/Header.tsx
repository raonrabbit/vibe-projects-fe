import Link from "next/link";
import { Badge, Button } from "@vibe/ui";
import { ThemeToggle } from "@/features/theme";

export function Header() {
    return (
        <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-sm border-b border-border">
            <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
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
