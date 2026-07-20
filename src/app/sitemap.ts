import type { MetadataRoute } from 'next'
import { fieldNotes } from '@/lib/field-notes'
import { caseStudySlugs } from '@/lib/data/projects'

const baseUrl = 'https://ahmadfx.xyz'

export default function sitemap(): MetadataRoute.Sitemap {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/field-notes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Case study routes — derived from the projects data module
  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudySlugs.map((slug) => ({
    url: `${baseUrl}/case-study/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Field note routes — derived from the registry, so publishing a note
  // updates the sitemap automatically
  const fieldNoteRoutes: MetadataRoute.Sitemap = fieldNotes
    .filter((n) => n.published && n.date)
    .map((n) => ({
      url: `${baseUrl}/field-notes/${n.slug}`,
      lastModified: new Date(n.date),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

  return [...staticRoutes, ...caseStudyRoutes, ...fieldNoteRoutes]
}
