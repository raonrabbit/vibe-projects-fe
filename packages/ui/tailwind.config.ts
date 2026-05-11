import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

// ── Semantic Typography Scale ─────────────────────────────────────────────────
//
//  Use `.type-{role}-{level}` classes to apply font size + weight + line-height
//  together. Never mix raw `text-*` + `font-*` for these roles — use the preset.
//
//  Role     | Lv | Size  | Weight | Use case
//  ---------|----+-------+--------+-----------------------------------------
//  display  |  1 | 48px  | Bold   | Hero, landing page — 가장 큰 강조
//           |  2 | 40px  | Bold   | Feature 섹션 강조
//           |  3 | 36px  | Bold   | Title 위계보다 큰 강조
//  title    |  1 | 30px  | SemiBold | 페이지 타이틀
//           |  2 | 24px  | SemiBold | 섹션·모달 타이틀
//           |  3 | 20px  | SemiBold | 카드·다이얼로그 타이틀
//  heading  |  1 | 18px  | SemiBold | 서브섹션 헤딩
//           |  2 | 16px  | SemiBold | 아이템 헤딩
//  headline |  1 | 16px  | Medium | 본문 상위 강조 (Bold body)
//           |  2 | 14px  | Medium | 작은 강조 텍스트
//  body     |  1 | 16px  | Regular | 기본 본문 (읽기용)
//           |  2 | 14px  | Regular | 보조 본문
//  label    |  1 | 14px  | Medium | 폼 레이블, 네비게이션
//           |  2 | 12px  | Medium | 작은 UI 레이블
//  caption  |  1 | 12px  | Regular | 메타 정보, 태그
//           |  2 | 11px  | Regular | 가장 작은 보조 텍스트

const typeScale: Record<string, Record<string, string>> = {
  '.type-display-1':  { fontSize: '3rem',      lineHeight: '1.1',   fontWeight: '700', letterSpacing: '-0.03em'  },
  '.type-display-2':  { fontSize: '2.5rem',    lineHeight: '1.15',  fontWeight: '700', letterSpacing: '-0.025em' },
  '.type-display-3':  { fontSize: '2.25rem',   lineHeight: '1.2',   fontWeight: '700', letterSpacing: '-0.022em' },
  '.type-title-1':    { fontSize: '1.875rem',  lineHeight: '1.25',  fontWeight: '600', letterSpacing: '-0.021em' },
  '.type-title-2':    { fontSize: '1.5rem',    lineHeight: '1.3',   fontWeight: '600', letterSpacing: '-0.019em' },
  '.type-title-3':    { fontSize: '1.25rem',   lineHeight: '1.35',  fontWeight: '600', letterSpacing: '-0.017em' },
  '.type-heading-1':  { fontSize: '1.125rem',  lineHeight: '1.4',   fontWeight: '600', letterSpacing: '-0.014em' },
  '.type-heading-2':  { fontSize: '1rem',      lineHeight: '1.45',  fontWeight: '600', letterSpacing: '-0.011em' },
  '.type-headline-1': { fontSize: '1rem',      lineHeight: '1.5',   fontWeight: '500', letterSpacing: '-0.011em' },
  '.type-headline-2': { fontSize: '0.875rem',  lineHeight: '1.5',   fontWeight: '500', letterSpacing: '-0.01em'  },
  '.type-body-1':     { fontSize: '1rem',      lineHeight: '1.625', fontWeight: '400', letterSpacing: '-0.011em' },
  '.type-body-2':     { fontSize: '0.875rem',  lineHeight: '1.625', fontWeight: '400', letterSpacing: '-0.01em'  },
  '.type-label-1':    { fontSize: '0.875rem',  lineHeight: '1.4',   fontWeight: '500', letterSpacing: '-0.01em'  },
  '.type-label-2':    { fontSize: '0.75rem',   lineHeight: '1.35',  fontWeight: '500', letterSpacing: '-0.01em'  },
  '.type-caption-1':  { fontSize: '0.75rem',   lineHeight: '1.4',   fontWeight: '400', letterSpacing: '-0.01em'  },
  '.type-caption-2':  { fontSize: '0.6875rem', lineHeight: '1.4',   fontWeight: '400', letterSpacing: '0'        },
}

const config = {
  content: [],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--color-bg)',
          subtle: 'var(--color-bg-subtle)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          raised: 'var(--color-surface-raised)',
          overlay: 'var(--color-surface-overlay)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          disabled: 'var(--color-text-disabled)',
          inverse: 'var(--color-text-inverse)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          subtle: 'var(--color-accent-subtle)',
          foreground: 'var(--color-accent-foreground)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          subtle: 'var(--color-success-subtle)',
          foreground: 'var(--color-success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          subtle: 'var(--color-warning-subtle)',
          foreground: 'var(--color-warning-foreground)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          subtle: 'var(--color-error-subtle)',
          foreground: 'var(--color-error-foreground)',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans KR',
          'sans-serif',
        ],
      },
      fontSize: {
        '2xs':   ['0.6875rem', { lineHeight: '1.4',     letterSpacing: '0' }],
        xs:      ['0.75rem',   { lineHeight: '1.125rem', letterSpacing: '-0.01em' }],
        sm:      ['0.875rem',  { lineHeight: '1.375rem', letterSpacing: '-0.01em' }],
        base:    ['1rem',      { lineHeight: '1.625rem', letterSpacing: '-0.011em' }],
        lg:      ['1.125rem',  { lineHeight: '1.75rem',  letterSpacing: '-0.014em' }],
        xl:      ['1.25rem',   { lineHeight: '1.875rem', letterSpacing: '-0.017em' }],
        '2xl':   ['1.5rem',    { lineHeight: '2.125rem', letterSpacing: '-0.019em' }],
        '3xl':   ['1.875rem',  { lineHeight: '2.375rem', letterSpacing: '-0.021em' }],
        '4xl':   ['2.25rem',   { lineHeight: '2.75rem',  letterSpacing: '-0.022em' }],
        '5xl':   ['3rem',      { lineHeight: '3.375rem', letterSpacing: '-0.03em' }],
      },
      borderRadius: {
        sm:      '0.25rem',
        DEFAULT: '0.5rem',
        md:      '0.5rem',
        lg:      '0.75rem',
        xl:      '1rem',
        '2xl':   '1.25rem',
        '3xl':   '1.5rem',
        full:    '9999px',
      },
      boxShadow: {
        sm:      '0 1px 2px 0 rgba(0,0,0,0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
        md:      '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05)',
        lg:      '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)',
        xl:      '0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)',
      },
      animation: {
        'fade-in':  'fadeIn 0.15s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%':   { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    plugin(({ addComponents }) => addComponents(typeScale)),
  ],
} satisfies Config

export default config
