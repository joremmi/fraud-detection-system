import React from 'react';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white pb-6">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Pricing Plans</h1>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            title="Starter"
            price="$49"
            features={[
              "Up to 1,000 transactions/month",
              "Basic fraud detection",
              "Email support",
              "Basic dashboard",
              "1 team member"
            ]}
            buttonText="Get Started"
            isPopular={false}
          />
          <PricingCard
            title="Professional"
            price="$99"
            features={[
              "Up to 10,000 transactions/month",
              "Advanced fraud detection",
              "24/7 support",
              "Advanced analytics",
              "5 team members"
            ]}
            buttonText="Try Pro"
            isPopular={true}
          />
          <PricingCard
            title="Enterprise"
            price="Custom"
            features={[
              "Unlimited transactions",
              "Custom ML models",
              "Dedicated support",
              "Custom integration",
              "Unlimited team members"
            ]}
            buttonText="Contact Us"
            isPopular={false}
          />
        </div>
      </div>
    </div>
  );
};

const PricingCard: React.FC<{
  title: string;
  price: string;
  features: string[];
  buttonText: string;
  isPopular: boolean;
}> = ({ title, price, features, buttonText, isPopular }) => (
  <div className={`bg-gray-900 p-8 rounded-lg border ${
    isPopular ? 'border-green-500' : 'border-gray-800'
  } relative`}>
    {isPopular && (
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
        Most Popular
      </span>
    )}
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <div className="text-3xl font-bold mb-6">{price}<span className="text-sm text-gray-400">/month</span></div>
    <ul className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <span className="text-green-500 mr-2">✓</span>
          {feature}
        </li>
      ))}
    </ul>
    <Link
      to="/login"
      className={`block text-center py-2 px-4 rounded-lg ${
        isPopular
          ? 'bg-green-500 hover:bg-green-600'
          : 'bg-gray-800 hover:bg-gray-700'
      } transition-colors`}
    >
      {buttonText}
    </Link>
  </div>
);

export default Pricing; 