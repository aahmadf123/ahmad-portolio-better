'use client';
import React from 'react';
import { cn } from '@/lib/utils';

type MenuToggleProps = React.ComponentProps<'svg'> & {
  open: boolean;
  duration?: number;
};

export function MenuToggleIcon({
  open,
  className,
  duration = 300,
  ...props
}: MenuToggleProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      className={cn('overflow-visible', className)}
      {...props}
    >
      {/* Top bar */}
      <line
        x1="2" y1="5" x2="18" y2="5"
        style={{
          transformOrigin: '10px 5px',
          transition: `transform ${duration}ms ease`,
          transform: open ? 'translateY(5px) rotate(45deg)' : 'none',
        }}
      />
      {/* Middle bar */}
      <line
        x1="2" y1="10" x2="18" y2="10"
        style={{
          transition: `opacity ${duration}ms ease`,
          opacity: open ? 0 : 1,
        }}
      />
      {/* Bottom bar */}
      <line
        x1="2" y1="15" x2="18" y2="15"
        style={{
          transformOrigin: '10px 15px',
          transition: `transform ${duration}ms ease`,
          transform: open ? 'translateY(-5px) rotate(-45deg)' : 'none',
        }}
      />
    </svg>
  );
}
