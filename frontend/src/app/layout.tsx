import type { Metadata, Viewport } from 'next'
import './globals.css'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import PwaInstallPrompt from '@/components/PwaInstallPrompt'

export const metadata: Metadata = {
  title: 'Collecte des Poubelles - Pont-sur-Yonne',
  description: 'Calendrier de collecte des déchets pour Pont-sur-Yonne (Bourg)',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Collecte Poubelles',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        {children}
        <ServiceWorkerRegistration />
        <PwaInstallPrompt />
      </body>
    </html>
  )
}
