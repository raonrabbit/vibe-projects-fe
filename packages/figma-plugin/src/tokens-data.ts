export const PALETTE: Record<string, Record<string, string>> = {
  gray: {
    '0': '#ffffff', '50': '#f9fafb', '100': '#f3f4f6', '200': '#e5e7eb',
    '300': '#d1d5db', '400': '#9ca3af', '500': '#6b7280', '600': '#4b5563',
    '700': '#374151', '800': '#1f2937', '900': '#111827', '950': '#030712',
  },
  emerald: {
    '50': '#ecfdf5', '100': '#d1fae5', '300': '#6ee7b7', '400': '#34d399',
    '500': '#10b981', '600': '#059669', '700': '#047857', '800': '#065f46', '900': '#064e3b',
  },
  red:    { '50': '#fef2f2', '500': '#ef4444' },
  yellow: { '50': '#fffbeb', '500': '#f59e0b', '600': '#d97706' },
}

export const SEMANTIC_LIGHT: Record<string, string> = {
  bg:                  '{palette.gray.0}',
  'bg-subtle':         '{palette.gray.50}',
  surface:             '{palette.gray.0}',
  'surface-raised':    '{palette.gray.50}',
  'surface-overlay':   '{palette.gray.100}',
  border:              '{palette.gray.200}',
  'border-strong':     '{palette.gray.300}',
  'text-primary':      '{palette.gray.900}',
  'text-secondary':    '{palette.gray.500}',
  'text-disabled':     '{palette.gray.300}',
  'text-inverse':      '{palette.gray.0}',
  accent:              '{palette.emerald.600}',
  'accent-hover':      '{palette.emerald.700}',
  'accent-subtle':     '{palette.emerald.50}',
  'accent-foreground': '{palette.gray.0}',
  success:             '{palette.emerald.600}',
  'success-subtle':    '{palette.emerald.50}',
  'success-foreground':'{palette.gray.0}',
  warning:             '{palette.yellow.600}',
  'warning-subtle':    '{palette.yellow.50}',
  'warning-foreground':'{palette.gray.900}',
  error:               '{palette.red.500}',
  'error-subtle':      '{palette.red.50}',
  'error-foreground':  '{palette.gray.0}',
}

export const SEMANTIC_DARK: Record<string, string> = {
  bg:                  '{palette.gray.950}',
  'bg-subtle':         '{palette.gray.900}',
  surface:             '{palette.gray.900}',
  'surface-raised':    '{palette.gray.800}',
  'surface-overlay':   '{palette.gray.700}',
  border:              '{palette.gray.800}',
  'border-strong':     '{palette.gray.700}',
  'text-primary':      '{palette.gray.50}',
  'text-secondary':    '{palette.gray.400}',
  'text-disabled':     '{palette.gray.600}',
  'text-inverse':      '{palette.gray.900}',
  accent:              '{palette.emerald.500}',
  'accent-hover':      '{palette.emerald.400}',
  'accent-subtle':     '{palette.emerald.900}',
  'accent-foreground': '{palette.gray.950}',
  success:             '{palette.emerald.500}',
  'success-subtle':    '#10b98120',
  'success-foreground':'{palette.gray.950}',
  warning:             '{palette.yellow.500}',
  'warning-subtle':    '#f59e0b1f',
  'warning-foreground':'{palette.gray.900}',
  error:               '{palette.red.500}',
  'error-subtle':      '#ef44441f',
  'error-foreground':  '{palette.gray.0}',
}

export const SPACING: Record<string, number> = {
  '1': 4, '2': 8, '3': 12, '4': 16, '5': 20,
  '6': 24, '8': 32, '10': 40, '12': 48, '16': 64, '20': 80, '24': 96,
}

export const RADIUS: Record<string, number> = {
  sm: 4, md: 8, lg: 12, xl: 16, '2xl': 20, full: 9999,
}

export const FONT_SIZES: Record<string, number> = {
  'fontSize/xs':   12,
  'fontSize/sm':   14,
  'fontSize/base': 16,
  'fontSize/lg':   18,
  'fontSize/xl':   20,
  'fontSize/2xl':  24,
  'fontSize/3xl':  30,
  'fontSize/4xl':  36,
}

export type TypeStyle = {
  label: string
  category: string
  size: number
  weight: 'Regular' | 'Medium' | 'Semi Bold' | 'Bold'
  lineHeight: number
  letterSpacing: number  // em value, e.g. -0.03
  usage: string
}

export const TYPE_SCALE: TypeStyle[] = [
  { label: 'Display 1',  category: 'Display',  size: 48, weight: 'Bold',      lineHeight: 1.10,  letterSpacing: -0.030, usage: 'Hero, 랜딩 페이지 — 가장 큰 강조' },
  { label: 'Display 2',  category: 'Display',  size: 40, weight: 'Bold',      lineHeight: 1.15,  letterSpacing: -0.025, usage: 'Feature 섹션 강조' },
  { label: 'Display 3',  category: 'Display',  size: 36, weight: 'Bold',      lineHeight: 1.20,  letterSpacing: -0.022, usage: 'Title 위계보다 큰 강조' },
  { label: 'Title 1',    category: 'Title',    size: 30, weight: 'Semi Bold', lineHeight: 1.25,  letterSpacing: -0.021, usage: '페이지 타이틀' },
  { label: 'Title 2',    category: 'Title',    size: 24, weight: 'Semi Bold', lineHeight: 1.30,  letterSpacing: -0.019, usage: '섹션·모달 타이틀' },
  { label: 'Title 3',    category: 'Title',    size: 20, weight: 'Semi Bold', lineHeight: 1.35,  letterSpacing: -0.017, usage: '카드·다이얼로그 타이틀' },
  { label: 'Heading 1',  category: 'Heading',  size: 18, weight: 'Semi Bold', lineHeight: 1.40,  letterSpacing: -0.014, usage: '서브섹션 헤딩' },
  { label: 'Heading 2',  category: 'Heading',  size: 16, weight: 'Semi Bold', lineHeight: 1.45,  letterSpacing: -0.011, usage: '아이템 헤딩' },
  { label: 'Headline 1', category: 'Headline', size: 16, weight: 'Medium',    lineHeight: 1.50,  letterSpacing: -0.011, usage: '본문 상위 강조 (Bold body)' },
  { label: 'Headline 2', category: 'Headline', size: 14, weight: 'Medium',    lineHeight: 1.50,  letterSpacing: -0.010, usage: '작은 강조 텍스트' },
  { label: 'Body 1',     category: 'Body',     size: 16, weight: 'Regular',   lineHeight: 1.625, letterSpacing: -0.011, usage: '기본 본문 (읽기용)' },
  { label: 'Body 2',     category: 'Body',     size: 14, weight: 'Regular',   lineHeight: 1.625, letterSpacing: -0.010, usage: '보조 본문' },
  { label: 'Label 1',    category: 'Label',    size: 14, weight: 'Medium',    lineHeight: 1.40,  letterSpacing: -0.010, usage: '폼 레이블, 네비게이션' },
  { label: 'Label 2',    category: 'Label',    size: 12, weight: 'Medium',    lineHeight: 1.35,  letterSpacing: -0.010, usage: '작은 UI 레이블' },
  { label: 'Caption 1',  category: 'Caption',  size: 12, weight: 'Regular',   lineHeight: 1.40,  letterSpacing: -0.010, usage: '메타 정보, 태그' },
  { label: 'Caption 2',  category: 'Caption',  size: 11, weight: 'Regular',   lineHeight: 1.40,  letterSpacing:  0.000, usage: '가장 작은 보조 텍스트' },
]

export function resolveColor(raw: string): string {
  if (!raw.startsWith('{')) return raw
  const m = raw.match(/^\{palette\.(\w+)\.(\w+)\}$/)
  if (!m) return raw
  return PALETTE[m[1]]?.[m[2]] ?? raw
}
