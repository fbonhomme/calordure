import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Collecte des Poubelles - Pont-sur-Yonne',
  description: 'Calendrier de collecte des déchets pour Pont-sur-Yonne (Bourg)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
