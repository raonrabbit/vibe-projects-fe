export const ICON_PROVIDERS = {
  simpleicons: (slug: string) => `https://cdn.simpleicons.org/${slug}`,
} as const;

export type IconProvider = keyof typeof ICON_PROVIDERS;
