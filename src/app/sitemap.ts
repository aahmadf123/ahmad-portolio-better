import type { MetadataRoute } from 'next'

const baseUrl = 'https://ahmadfx.xyz'

const caseStudies = [
  'batting-cleanup-smart-city-waste-reporting',
  'camel-car-cheme-car-control-system',
  'champions-complex-digital-campaign',
  'deepflyer-drone-reinforcement-learning',
  'deeptruth-ai-fact-checking',
  'graph-based-rl-uav-autonomy',
  'homeowner-loss-prediction',
  'security-discovery-tool',
  'toledo-athletics-onboarding-portal',
  'toledo-football-iq-computer-vision-analytics',
]

const fieldNoteSlugs = ['agentic-ai-in-production']

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

  // Case study routes
  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((slug) => ({
    url: `${baseUrl}/case-study/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Field note dynamic routes
  const fieldNoteRoutes: MetadataRoute.Sitemap = fieldNoteSlugs.map((slug) => ({
    url: `${baseUrl}/field-notes/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...caseStudyRoutes, ...fieldNoteRoutes]
}
