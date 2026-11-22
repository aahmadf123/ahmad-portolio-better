'use client';

import React from 'react';
import { SmartBackLink } from '@/components/ui/smart-back-link';
import { SiteHeader } from './SiteHeader';

/**
 * Every non-home page: the site header (sticky) with a back link beside the name.
 * `children` (a page title or report links) shows on wide screens only.
 */
export function SubpageHeader({
  backHref,
  backLabel,
  backWhenPrev,
  restoreScroll,
  children,
}: {
  backHref: string;
  backLabel: string;
  backWhenPrev?: string[];
  /** Land where the reader last left the back destination (SmartBackLink). */
  restoreScroll?: boolean;
  accent?: string;
  children?: React.ReactNode;
}) {
  return (
    <SiteHeader sticky>
      <SmartBackLink fallbackHref={backHref} backWhenPrev={backWhenPrev} restoreScroll={restoreScroll} className="back-link">
        <span aria-hidden>←</span> {backLabel}
      </SmartBackLink>
      {children && <div className="subpage-right">{children}</div>}
    </SiteHeader>
  );
}
