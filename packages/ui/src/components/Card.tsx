import { type HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ hover = false, padding = 'md', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-xl overflow-hidden',
        hover && 'transition-shadow hover:shadow-md cursor-pointer',
        {
          '':              padding === 'none',
          'p-3':           padding === 'sm',
          'p-4 md:p-5':    padding === 'md',
          'p-6 md:p-8':    padding === 'lg',
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
