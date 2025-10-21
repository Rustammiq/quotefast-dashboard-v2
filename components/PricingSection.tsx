import React from 'react';
import { Check, Star } from 'lucide-react';

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: '€29',
      period: '/maand',
      description: 'Perfect voor kleine bedrijven',
      features: [
        'Tot 50 offertes per maand',
        'Basis AI-ondersteuning',
        'Email support',
        'Standaard templates',
        'PDF export'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '€79',
      period: '/maand',
      description: 'Ideaal voor groeiende bedrijven',
      features: [
        'Tot 200 offertes per maand',
        'Geavanceerde AI-ondersteuning',
        'Prioriteit support',
        'Aangepaste templates',
        'API toegang',
        'Team samenwerking',
        'Geavanceerde analytics'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '€199',
      period: '/maand',
      description: 'Voor grote organisaties',
      features: [
        'Onbeperkte offertes',
        'Premium AI-ondersteuning',
        '24/7 support',
        'Volledig aanpasbaar',
        'Dedicated account manager',
        'SSO integratie',
        'Custom integraties',
        'SLA garantie'
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Eenvoudige, transparante prijzen
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kies het plan dat het beste bij jouw bedrijf past. Upgrade of downgrade op elk moment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Meest populair
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {plan.name === 'Enterprise' ? 'Neem contact op' : 'Start gratis proefperiode'}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Alle plannen bevatten een 14-dagen gratis proefperiode
          </p>
          <p className="text-sm text-gray-500">
            Geen setup kosten • Geen verborgen kosten • Annuleer op elk moment
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
