'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Project } from '@/lib/data/projects';
import { ProjectDetailModal } from './ProjectDetailModal';

const OpenContext = createContext<((p: Project) => void) | null>(null);

/** One project-details modal for the whole homepage; every world's poster cards open it. */
export function ProjectModalProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<Project | null>(null);
  const open = useMemo(() => (p: Project) => setProject(p), []);
  return (
    <OpenContext.Provider value={open}>
      {children}
      <ProjectDetailModal project={project} onClose={() => setProject(null)} />
    </OpenContext.Provider>
  );
}

export function useProjectModal(): { open: (p: Project) => void } {
  const open = useContext(OpenContext);
  if (!open) throw new Error('useProjectModal must be used inside ProjectModalProvider');
  return { open };
}
