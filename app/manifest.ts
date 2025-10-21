// app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'QuoteFast Dashboard',
    short_name: 'QuoteFast',
    description: 'AI-powered quote generator met spraakbesturing',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#8b5cf6',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Nieuwe Offerte',
        short_name: 'Offerte',
        description: 'Start een nieuwe offerte met AI',
        url: '/quotes/new',
        icons: [{ src: '/icon-shortcut-quote.png', sizes: '96x96' }],
      },
      {
        name: 'Scan & Quote',
        short_name: 'Scan',
        description: 'Maak foto en genereer offerte',
        url: '/quotes/scan',
        icons: [{ src: '/icon-shortcut-camera.png', sizes: '96x96' }],
      },
    ],
    categories: ['business', 'productivity', 'finance'],
  };
}
