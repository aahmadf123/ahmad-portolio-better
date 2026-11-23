'use client';

import React from 'react';
import { useMagnetic } from './use-magnetic';

/** An <a> that leans toward the pointer (see useMagnetic). */
export function MagneticLink({ max = 6, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { max?: number }) {
  const ref = useMagnetic<HTMLAnchorElement>(max);
  return <a ref={ref} {...props} />;
}
