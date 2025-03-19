import React from 'react';
import { Link } from 'react-router-dom';

const Features: React.FC = () => {
  return (
    <div className="min-h-screen bg-transparent text-white mb-12">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Features</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="Real-time Detection"
            description="Instant fraud detection using advanced machine learning algorithms"
            icon="⚡"
          />
          <FeatureCard
            title="Transaction Monitoring"
            description="24/7 monitoring of all transactions with detailed analytics"
            icon="📊"
          />
          <FeatureCard
            title="Smart Alerts"
            description="Intelligent notification system for suspicious activities"
            icon="🔔"
          />
          <FeatureCard
            title="Dashboard Analytics"
            description="Comprehensive dashboard with visual insights and trends"
            icon="📈"
          />
          <FeatureCard
            title="Multi-Factor Auth"
            description="Enhanced security with MFA integration"
            icon="🔒"
          />
          <FeatureCard
            title="API Integration"
            description="Easy integration with existing systems via REST API"
            icon="🔗"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; description: string; icon: string }> = ({
  title,
  description,
  icon,
}) => (
  <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-green-500 transition-all">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default Features; 