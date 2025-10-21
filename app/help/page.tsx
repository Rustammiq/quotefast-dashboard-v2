import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help - QuoteFast Dashboard',
  description: 'Hulp en ondersteuning voor QuoteFast Dashboard',
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Help & Ondersteuning</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Veelgestelde Vragen</h2>
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Hoe maak ik een nieuwe offerte?</h3>
                <p className="text-gray-300">Ga naar het dashboard en klik op &ldquo;Nieuwe Offerte&rdquo; om te beginnen.</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Hoe beheer ik mijn klanten?</h3>
                <p className="text-gray-300">Gebruik het &ldquo;Klanten Overzicht&rdquo; om alle contactpersonen te beheren.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p className="text-gray-300">
              Voor meer hulp, neem contact op via: support@quotefast.nl
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}