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

import { cn } from "@/shared/lib/cn";

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

export const ChevronRightIcon = wrap(ChevronRight);
export const ChevronLeftIcon = wrap(ChevronLeft);
export const ChevronDownIcon = wrap(ChevronDown);
export const ChevronUpIcon = wrap(ChevronUp);
export const ArrowRightIcon = wrap(ArrowRight);
export const SearchIcon = wrap(Search);
export const CloseIcon = wrap(X);
export const CheckIcon = wrap(Check);
export const InfoIcon = wrap(Info);
export const AlertTriangleIcon = wrap(TriangleAlert);
export const ExternalLinkIcon = wrap(ExternalLink);
export const BookmarkIcon = wrap(Bookmark);
export const StarIcon = wrap(Star);
export const ShareIcon = wrap(Share2);
export const MenuIcon = wrap(Menu);
export const UserIcon = wrap(User);
export const MoonIcon = wrap(Moon);
export const SunIcon = wrap(Sun);
