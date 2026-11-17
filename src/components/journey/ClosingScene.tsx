import React from 'react';
import { closing } from '@/lib/data/worlds';
import { FlyInScene, SceneCopy } from './FlyInScene';
import { ChapterCopy } from './ChapterCopy';
import { StageArt } from './StageArt';

/** "The next chapter." Flies out of the last world and back to the opening photo. */
export function ClosingScene() {
  return (
    <section id="next-chapter" aria-labelledby="next-chapter-title" style={{ position: 'relative', zIndex: 20 }}>
      <FlyInScene id="next-chapter" from="ai-engineering" to="opening">
        <SceneCopy photo="opening" aside={<StageArt id="next-chapter" scene={closing.scene} accent="#2dd4bf" />}>
          <ChapterCopy
            mark={closing.kicker}
            title={closing.title}
            titleId="next-chapter-title"
            paragraphs={[closing.body]}
            stat={closing.stat}
            accent="#2dd4bf"
            testId="closing-copy"
          />
        </SceneCopy>
      </FlyInScene>
    </section>
  );
}
