"use client";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../lib/cn";

// ── List Root ─────────────────────────────────────────────────────────────────

export interface ListProps extends HTMLAttributes<HTMLDivElement> {}

const ListRoot = forwardRef<HTMLDivElement, ListProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full overflow-hidden rounded-xl border border-border bg-surface", className)}
    {...props}
  >
    {children}
  </div>
));
ListRoot.displayName = "List";

// ── List.Item ─────────────────────────────────────────────────────────────────

export interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  /** When provided, the row becomes interactive with hover/active feedback and keyboard support. */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  /** Dims the row and prevents interaction. */
  disabled?: boolean;
}

const ListItemRoot = forwardRef<HTMLDivElement, ListItemProps>(
  ({ className, children, onClick, disabled, ...props }, ref) => {
    const isInteractive = Boolean(onClick) && !disabled;

    return (
      <div
        ref={ref}
        role={onClick ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-disabled={disabled || undefined}
        onClick={isInteractive ? onClick : undefined}
        onKeyDown={
          isInteractive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.currentTarget.click();
                }
              }
            : undefined
        }
        className={cn(
          "flex items-center gap-3 px-4 py-3 transition-colors",
          isInteractive && "cursor-pointer hover:bg-surface-raised active:bg-surface-overlay",
          disabled && "cursor-not-allowed opacity-40",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
ListItemRoot.displayName = "List.Item";

// ── List.Item.Leading ─────────────────────────────────────────────────────────

interface ListItemLeadingProps {
  children: React.ReactNode;
  className?: string;
}

function ListItemLeading({ children, className }: ListItemLeadingProps) {
  return <span className={cn("shrink-0 text-text-secondary", className)}>{children}</span>;
}
ListItemLeading.displayName = "List.Item.Leading";

// ── List.Item.Content ─────────────────────────────────────────────────────────

interface ListItemContentProps {
  /** Primary text for the row. */
  title: string;
  /** Secondary descriptive text shown below the title. */
  description?: string;
  className?: string;
}

function ListItemContent({ title, description, className }: ListItemContentProps) {
  return (
    <div className={cn("min-w-0 flex-1", className)}>
      <p className="type-headline-2 truncate text-text-primary">{title}</p>
      {description && (
        <p className="type-caption-1 mt-0.5 truncate text-text-secondary">{description}</p>
      )}
    </div>
  );
}
ListItemContent.displayName = "List.Item.Content";

// ── List.Item.Trailing ────────────────────────────────────────────────────────

interface ListItemTrailingProps {
  children: React.ReactNode;
  className?: string;
}

function ListItemTrailing({ children, className }: ListItemTrailingProps) {
  return <span className={cn("shrink-0 text-text-secondary", className)}>{children}</span>;
}
ListItemTrailing.displayName = "List.Item.Trailing";

// ── List.Item compound ────────────────────────────────────────────────────────

const ListItem = Object.assign(ListItemRoot, {
  Leading: ListItemLeading,
  Content: ListItemContent,
  Trailing: ListItemTrailing,
});

// ── List.Divider ──────────────────────────────────────────────────────────────

interface ListDividerProps {
  className?: string;
}

function ListDivider({ className }: ListDividerProps) {
  return <div role="separator" className={cn("mx-4 h-px bg-border", className)} />;
}
ListDivider.displayName = "List.Divider";

// ── List.Footer ───────────────────────────────────────────────────────────────

interface ListFooterProps {
  children: React.ReactNode;
  className?: string;
}

function ListFooterRoot({ children, className }: ListFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-t border-border bg-surface-raised px-4 py-3",
        "type-caption-1 text-text-secondary",
        className,
      )}
    >
      {children}
    </div>
  );
}
ListFooterRoot.displayName = "List.Footer";

// ── List.Footer.Icon ──────────────────────────────────────────────────────────

interface ListFooterIconProps {
  children: React.ReactNode;
  className?: string;
}

function ListFooterIcon({ children, className }: ListFooterIconProps) {
  return (
    <span aria-hidden="true" className={cn("shrink-0", className)}>
      {children}
    </span>
  );
}
ListFooterIcon.displayName = "List.Footer.Icon";

// ── List.Footer compound ──────────────────────────────────────────────────────

const ListFooter = Object.assign(ListFooterRoot, {
  Icon: ListFooterIcon,
});

// ── List compound export ──────────────────────────────────────────────────────

/**
 * List is a compound component for rendering structured rows of content.
 *
 * Sub-components:
 * - `List.Item` — a single interactive or static row
 *   - `List.Item.Leading` — left-side slot (icon, avatar, …)
 *   - `List.Item.Content` — structured `title` + optional `description`
 *   - `List.Item.Trailing` — right-side slot (icon, badge, …)
 * - `List.Divider` — thin separator line between items
 * - `List.Footer` — supplemental footer row
 *   - `List.Footer.Icon` — icon prefix inside the footer
 *
 * @example
 * <List>
 *   <List.Item onClick={() => navigate("/profile")}>
 *     <List.Item.Leading><UserIcon size={20} /></List.Item.Leading>
 *     <List.Item.Content title="프로필" description="계정 설정 관리" />
 *     <List.Item.Trailing><ChevronRightIcon size={16} /></List.Item.Trailing>
 *   </List.Item>
 *   <List.Divider />
 *   <List.Item onClick={() => navigate("/settings")}>
 *     <List.Item.Content title="설정" />
 *   </List.Item>
 *   <List.Footer>
 *     <List.Footer.Icon><InfoIcon size={14} /></List.Footer.Icon>
 *     마지막 업데이트: 5분 전
 *   </List.Footer>
 * </List>
 */
export const List = Object.assign(ListRoot, {
  Item: ListItem,
  Footer: ListFooter,
  Divider: ListDivider,
});
