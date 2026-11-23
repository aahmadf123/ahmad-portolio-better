import React from 'react';
import { SH } from '@/components/shared/section-helpers';
import { nowCards, nowUpdated } from '@/lib/data/now';

/** What Ahmad is learning and building now, as three short columns. */
export function NowSection() {
  return (
    <section id="now" aria-label="Now" className="now">
      <div className="wrap">
        <SH color="#2dd4bf" label="Now" sub="What I'm actively learning, building, and chasing outside of work." />
        <p className="now-updated">Updated · {nowUpdated}</p>
        <div className="now-grid">
          {nowCards.map((card, i) => (
            <div key={card.category} className="now-col rv" style={{ '--i': i } as React.CSSProperties}>
              <div className="now-col-head">
                <h3>{card.category}</h3>
                <span><i aria-hidden style={{ background: card.statusColor }} />{card.status}</span>
              </div>
              <ul>
                {card.items.map((item) => (
                  <li key={item.title}>
                    <span className="now-item">{item.title}</span>
                    <span className="now-sub">{item.sub}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .now { padding: clamp(56px, 8vw, 112px) 0; }
        .now-updated { margin: -28px 0 32px; font-size: 14px; color: var(--text3); }
        .now-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr)); gap: 32px clamp(24px, 4vw, 56px); }
        .now-col-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--foreground); }
        .now-col-head h3 { font-size: 18px; font-weight: 400; }
        .now-col-head span { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: var(--text2); }
        .now-col-head i { width: 6px; height: 6px; border-radius: 50%; }
        .now-col ul { list-style: none; }
        .now-col li { padding: 14px 0; border-bottom: 1px solid var(--bd); }
        .now-item { display: block; font-size: 16px; }
        .now-sub { display: block; font-size: 14px; color: var(--text2); margin-top: 2px; }
      `}</style>
    </section>
  );
}
