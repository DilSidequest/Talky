// SEO utilities and metadata generation

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
}

export function generateMetadata(config: SEOConfig) {
  const {
    title,
    description,
    keywords = [],
    image = '/og-image.png',
    url,
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
    section,
    tags = [],
  } = config

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://talky.app'
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'Talky',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        section,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
      creator: '@talkyapp',
      site: '@talkyapp',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: fullUrl,
    },
  }
}

// Generate structured data (JSON-LD)
export function generateStructuredData(type: 'Organization' | 'WebApplication' | 'Article', data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://talky.app'

  const schemas: Record<string, any> = {
    Organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Talky',
      description: 'AI-powered video messaging with real-time translation',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      sameAs: [
        'https://twitter.com/talkyapp',
        'https://facebook.com/talkyapp',
        'https://linkedin.com/company/talkyapp',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        email: 'support@talky.app',
      },
    },
    WebApplication: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Talky',
      description: 'AI-powered video messaging with real-time translation',
      url: baseUrl,
      applicationCategory: 'CommunicationApplication',
      operatingSystem: 'Web, iOS, Android',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1250',
      },
      screenshot: `${baseUrl}/screenshots/app-screenshot.png`,
    },
    Article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.title,
      description: data.description,
      image: data.image,
      datePublished: data.publishedTime,
      dateModified: data.modifiedTime,
      author: {
        '@type': 'Person',
        name: data.author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Talky',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
        },
      },
    },
  }

  return schemas[type] || schemas.Organization
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://talky.app'

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  }
}

// Generate FAQ structured data
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Common page metadata
export const commonMetadata = {
  home: generateMetadata({
    title: 'Talky - Break Down Language Barriers with AI',
    description: 'AI-powered video messaging app with real-time translation. Chat, call, and communicate seamlessly across languages with OCR scanning and AI phone calling.',
    keywords: ['video messaging', 'translation', 'AI', 'multilingual', 'communication', 'OCR', 'video call'],
  }),
  chat: generateMetadata({
    title: 'Chat - Talky',
    description: 'Send messages with real-time AI translation. Communicate effortlessly across languages.',
    keywords: ['chat', 'messaging', 'translation', 'multilingual chat'],
    url: '/chat',
  }),
  call: generateMetadata({
    title: 'Video Call - Talky',
    description: 'Make video calls with live translation subtitles. Break language barriers in real-time.',
    keywords: ['video call', 'live translation', 'subtitles', 'multilingual call'],
    url: '/call',
  }),
  ocr: generateMetadata({
    title: 'OCR Scanner - Talky',
    description: 'Scan and translate text from images instantly. Point your camera and get instant translations.',
    keywords: ['OCR', 'text recognition', 'image translation', 'camera translation'],
    url: '/ocr',
  }),
  aiCaller: generateMetadata({
    title: 'AI Phone Caller - Talky',
    description: 'Let AI make phone calls for you in any language. Automate calls with intelligent conversation handling.',
    keywords: ['AI caller', 'automated calls', 'phone automation', 'multilingual calls'],
    url: '/ai-caller',
  }),
}

