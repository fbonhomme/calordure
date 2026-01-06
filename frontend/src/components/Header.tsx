import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';

interface HeaderProps {
  currentPage?: 'home' | 'calendar';
}

export default function Header({ currentPage = 'home' }: HeaderProps) {
  return (
    <header className="mb-6 md:mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 md:mb-2 flex items-center gap-2 justify-center md:justify-start">
              🗑️ Collecte des Poubelles
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Pont-sur-Yonne (Bourg)
            </p>
          </div>
        </Link>

        <div className="flex gap-2 w-full md:w-auto">
          {currentPage === 'calendar' ? (
            <Link href="/" className="flex-1 md:flex-initial">
              <Button variant="outline" size="sm" className="w-full md:w-auto">
                ← Accueil
              </Button>
            </Link>
          ) : (
            <Link href="/calendrier" className="flex-1 md:flex-initial">
              <Button variant="outline" size="sm" className="w-full md:w-auto">
                📅 Calendrier complet
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
