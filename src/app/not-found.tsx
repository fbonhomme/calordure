import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Page non trouvée
        </h1>
        <p className="text-gray-600 mb-6">
          Désolé, la page que vous recherchez n&apos;existe pas.
        </p>

        <Link href="/">
          <Button variant="primary">Retour à l&apos;accueil</Button>
        </Link>
      </div>
    </div>
  );
}
