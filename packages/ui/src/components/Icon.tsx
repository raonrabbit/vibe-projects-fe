import { type SVGProps } from "react";

import { cn } from "../lib/cn";

/** Props shared by all icon components. Extends native SVG attributes. */
export interface IconProps extends SVGProps<SVGSVGElement> {
  /** Width and height in pixels. @default 24 */
  size?: number;
}

function Icon({
  size = 24,
  className,
  children,
  ...props
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("shrink-0", className)}
      {...props}
    >
      {children}
    </svg>
  );
}

/**
 * ChevronRightIcon
 *
 * Use for: list-item disclosure arrows, next-page navigation, nested menu indicators.
 * @example
 * <ChevronRightIcon size={16} className="text-text-secondary" />
 */
export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 6l6 6-6 6" />
    </Icon>
  );
}

/**
 * ChevronLeftIcon
 *
 * Use for: back navigation, previous-page controls.
 * @example
 * <ChevronLeftIcon size={20} className="text-text-primary" />
 */
export function ChevronLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15 6l-6 6 6 6" />
    </Icon>
  );
}

/**
 * ChevronDownIcon
 *
 * Use for: select/dropdown open-state indicators, expandable section triggers.
 * @example
 * <ChevronDownIcon size={16} className="text-text-secondary" />
 */
export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  );
}

/**
 * ChevronUpIcon
 *
 * Use for: collapse controls, scroll-to-top triggers.
 * @example
 * <ChevronUpIcon size={16} className="text-text-secondary" />
 */
export function ChevronUpIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 15l-6-6-6 6" />
    </Icon>
  );
}

/**
 * ArrowRightIcon
 *
 * Use for: primary directional CTAs (stronger visual weight than ChevronRight).
 * @example
 * <Button variant="ghost">
 *   계속하기 <ArrowRightIcon size={16} />
 * </Button>
 */
export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </Icon>
  );
}

/**
 * SearchIcon
 *
 * Use for: search input leading slot, search trigger buttons.
 * @example
 * <Input leading={<SearchIcon size={16} />} placeholder="검색" />
 */
export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </Icon>
  );
}

/**
 * CloseIcon
 *
 * Use for: modal/dialog close buttons, tag dismiss controls, input clear buttons.
 * @example
 * <Input trailing={<button aria-label="지우기"><CloseIcon size={16} /></button>} />
 */
export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </Icon>
  );
}

/**
 * CheckIcon
 *
 * Use for: success feedback, checkbox checked state, step completion indicators.
 * @example
 * <CheckIcon size={20} className="text-success" />
 */
export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <polyline points="20 6 9 17 4 12" />
    </Icon>
  );
}

/**
 * InfoIcon
 *
 * Use for: informational hints, help tooltips, non-critical notices.
 * @example
 * <InfoIcon size={16} className="text-accent" />
 */
export function InfoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </Icon>
  );
}

/**
 * AlertTriangleIcon
 *
 * Use for: warning states, destructive action confirmation dialogs.
 * @example
 * <AlertTriangleIcon size={16} className="text-warning" />
 */
export function AlertTriangleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <path d="M12 9v4M12 17h.01" />
    </Icon>
  );
}

/**
 * ExternalLinkIcon
 *
 * Use for: links that open in a new tab or navigate to an external site.
 * @example
 * <a href={url} target="_blank" rel="noreferrer">
 *   원문 보기 <ExternalLinkIcon size={14} className="inline" />
 * </a>
 */
export function ExternalLinkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </Icon>
  );
}

/**
 * BookmarkIcon
 *
 * Use for: save/unsave article actions. Apply `className="fill-current"` to show a saved state.
 * @example
 * <button aria-label={saved ? "저장 취소" : "저장"}>
 *   <BookmarkIcon
 *     size={20}
 *     className={saved ? "fill-current text-accent" : "text-text-secondary"}
 *   />
 * </button>
 */
export function BookmarkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </Icon>
  );
}

/**
 * StarIcon
 *
 * Use for: rating displays, favorite actions. Apply `className="fill-current"` for active state.
 * @example
 * <StarIcon size={16} className={favorite ? "fill-current text-warning" : "text-text-disabled"} />
 */
export function StarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Icon>
  );
}

/**
 * ShareIcon
 *
 * Use for: share content buttons (article share, link copy triggers).
 * @example
 * <ShareIcon size={20} className="text-text-secondary" />
 */
export function ShareIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </Icon>
  );
}

/**
 * MenuIcon
 *
 * Use for: main navigation drawer trigger (hamburger), compact action menus.
 * @example
 * <button aria-label="메뉴 열기" aria-expanded={open}>
 *   <MenuIcon size={24} />
 * </button>
 */
export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </Icon>
  );
}

/**
 * UserIcon
 *
 * Use for: profile/account navigation, author display, user-related features.
 * @example
 * <UserIcon size={20} className="text-text-secondary" />
 */
export function UserIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Icon>
  );
}
