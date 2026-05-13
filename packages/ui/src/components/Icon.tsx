import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Info,
  type LucideIcon,
  type LucideProps,
  Menu,
  Moon,
  Search,
  Share2,
  Star,
  Sun,
  TriangleAlert,
  User,
  X,
} from "lucide-react";

import { cn } from "../lib/cn";

export type IconProps = LucideProps;

function wrap(LucideIconComponent: LucideIcon) {
  return function Icon({ size = 24, className, ...props }: IconProps) {
    return (
      <LucideIconComponent
        size={size}
        aria-hidden="true"
        className={cn("shrink-0", className)}
        {...props}
      />
    );
  };
}

/** Use for: list-item disclosure arrows, next-page navigation. */
export const ChevronRightIcon = wrap(ChevronRight);

/** Use for: back navigation, previous-page controls. */
export const ChevronLeftIcon = wrap(ChevronLeft);

/** Use for: select/dropdown open-state indicators, expandable section triggers. */
export const ChevronDownIcon = wrap(ChevronDown);

/** Use for: collapse controls, scroll-to-top triggers. */
export const ChevronUpIcon = wrap(ChevronUp);

/** Use for: primary directional CTAs (stronger visual weight than ChevronRight). */
export const ArrowRightIcon = wrap(ArrowRight);

/** Use for: search input leading slot, search trigger buttons. */
export const SearchIcon = wrap(Search);

/** Use for: modal/dialog close buttons, tag dismiss controls, input clear buttons. */
export const CloseIcon = wrap(X);

/** Use for: success feedback, checkbox checked state, step completion indicators. */
export const CheckIcon = wrap(Check);

/** Use for: informational hints, help tooltips, non-critical notices. */
export const InfoIcon = wrap(Info);

/** Use for: warning states, destructive action confirmation dialogs. */
export const AlertTriangleIcon = wrap(TriangleAlert);

/** Use for: links that open in a new tab or navigate to an external site. */
export const ExternalLinkIcon = wrap(ExternalLink);

/**
 * Use for: save/unsave article actions.
 * @example <BookmarkIcon className={saved ? "fill-current text-accent" : ""} />
 */
export const BookmarkIcon = wrap(Bookmark);

/**
 * Use for: rating displays, favorite actions.
 * @example <StarIcon className={fav ? "fill-current text-warning" : "text-text-disabled"} />
 */
export const StarIcon = wrap(Star);

/** Use for: share content buttons (article share, link copy triggers). */
export const ShareIcon = wrap(Share2);

/** Use for: main navigation drawer trigger (hamburger), compact action menus. */
export const MenuIcon = wrap(Menu);

/** Use for: profile/account navigation, author display, user-related features. */
export const UserIcon = wrap(User);

/** Use for: dark mode indicator in theme toggle buttons. */
export const MoonIcon = wrap(Moon);

/** Use for: light mode indicator in theme toggle buttons. */
export const SunIcon = wrap(Sun);
