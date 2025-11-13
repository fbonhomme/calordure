'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erreur capturée:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">😞</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Oups ! Une erreur est survenue
        </h1>
        <p className="text-gray-600 mb-6">
          Nous sommes désolés, quelque chose s&apos;est mal passé. Veuillez
          réessayer.
        </p>

        <div className="flex flex-col gap-3">
          <Button onClick={reset} variant="primary">
            Réessayer
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
          >
            Retour à l&apos;accueil
          </Button>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs text-gray-400">
            Code d&apos;erreur : {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
