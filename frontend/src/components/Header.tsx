import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';

interface HeaderProps {
  currentPage?: 'home' | 'calendar';
}

export default function Header({ currentPage = 'home' }: HeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-2 justify-center md:justify-start">
              🗑️ Collecte des Poubelles
            </h1>
            <p className="text-muted-foreground text-lg">
              Pont-sur-Yonne (Bourg)
            </p>
          </div>
        </Link>

        <div className="flex gap-2">
          {currentPage === 'calendar' ? (
            <Link href="/">
              <Button variant="outline" size="sm">
                ← Accueil
              </Button>
            </Link>
          ) : (
            <Link href="/calendrier">
              <Button variant="outline" size="sm">
                📅 Calendrier complet
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
