'use client'

import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  noindex?: boolean
  nofollow?: boolean
}

export function SEOHead({
  title = 'QuoteFast Dashboard - AI Offertegenerator | Automatiseer je Offerteproces',
  description = 'Automatiseer je offertes met AI. Bespaar uren werk en verhoog je conversie met QuoteFast Dashboard. CRM, facturatie en workflow automatisering in één platform.',
  keywords = 'offertes, AI, automatisering, CRM, facturatie, offertegenerator, business management, SaaS',
  image = '/og-image.jpg',
  url = 'https://quotefast-dashboard.vercel.app',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'QuoteFast Team',
  section,
  tags = [],
  noindex = false,
  nofollow = false,
}: SEOHeadProps) {
  const fullTitle = title.includes('QuoteFast') ? title : `${title} | QuoteFast Dashboard`
  const fullImageUrl = image.startsWith('http') ? image : `${url}${image}`
  
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(', ')

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="QuoteFast Dashboard" />
      <meta property="og:locale" content="nl_NL" />
      
      {/* Article specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags.length > 0 && (
        tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:creator" content="@quotefast" />
      <meta name="twitter:site" content="@quotefast" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="msapplication-TileColor" content="#6366f1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="QuoteFast" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': type === 'article' ? 'Article' : 'WebSite',
            name: fullTitle,
            description: description,
            url: url,
            image: fullImageUrl,
            publisher: {
              '@type': 'Organization',
              name: 'QuoteFast',
              url: 'https://quotefast-dashboard.vercel.app',
              logo: {
                '@type': 'ImageObject',
                url: 'https://quotefast-dashboard.vercel.app/logo.png',
              },
            },
            ...(type === 'article' && {
              author: {
                '@type': 'Person',
                name: author,
              },
              datePublished: publishedTime,
              dateModified: modifiedTime || publishedTime,
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': url,
              },
            }),
            ...(type === 'website' && {
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://quotefast-dashboard.vercel.app/search?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }),
        }}
      />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://qgyboabomydquodygomq.supabase.co" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//qgyboabomydquodygomq.supabase.co" />
    </Head>
  )
}
