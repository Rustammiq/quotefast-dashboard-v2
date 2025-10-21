import React from 'react';

const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">QuoteFast</h3>
            <p className="text-gray-400">
              De slimste manier om offertes en facturen te beheren met AI-ondersteuning.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="#demo" className="hover:text-white">Demo</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#help" className="hover:text-white">Help Center</a></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
              <li><a href="#docs" className="hover:text-white">Documentation</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#about" className="hover:text-white">About</a></li>
              <li><a href="#privacy" className="hover:text-white">Privacy</a></li>
              <li><a href="#terms" className="hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 QuoteFast. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
