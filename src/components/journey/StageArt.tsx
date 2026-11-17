import React from 'react';
import { Pic } from '@/components/ui/pic';
import type { StageSceneId, StagePhoto } from '@/lib/data/worlds';
import { StageScene } from './StageScene';

/**
 * The side of a world's stage opposite its words, so the frame is never "words and a
 * big empty photo": the world's animated drawing (from the old Story section) with
 * Ahmad's own photos laid over it like prints. The journey photo still shows around it.
 * Hidden on narrow screens, where the words take the whole width.
 */
export function StageArt({ id, scene, accent, gallery = [] }: { id: string; scene: StageSceneId; accent: string; gallery?: StagePhoto[] }) {
  return (
    <div data-testid={`stage-art-${id}`} className="stage-art" data-count={gallery.length} style={{ '--accent': accent } as React.CSSProperties}>
      <div className="stage-art-scene"><StageScene scene={scene} accent={accent} /></div>
      {gallery.map((g, i) => (
        <figure key={g.src} className="stage-print" data-i={i} style={{ margin: 0 }}>
          <Pic src={g.src} alt={g.alt} sizes="(max-width: 900px) 70vw, 380px" />
        </figure>
      ))}
    </div>
  );
}
