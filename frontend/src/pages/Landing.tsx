import React from 'react';
import { Link } from 'react-router-dom';
import Features from './Features.tsx';
import Pricing from './Pricing.tsx';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 relative">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent z-10"></div>
        <img 
          src="/bg.jpg" 
          alt="Dashboard Preview" 
          className="w-full h-full object-cover object-center z-0" 
        />
      </div>
      <nav className="flex justify-between items-center p-6 relative z-20">
        <div className="flex items-center text-white">
          <span className="ml-12 text-xl font-bold">FraudGuard</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#features" className="text-white hover:text-gray-300">Features</a>
          <a href="#pricing" className="text-white hover:text-gray-300">Pricing</a>
          <Link 
            to="/login" 
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <section id="hero" className="min-h-screen flex items-center relative z-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-5xl font-bold text-white mb-6">
                Unleash the power of AI in Fraud Detection
              </h1>
              <p className="text-gray-400 text-xl mb-8">
                Real-time transaction monitoring and fraud prevention powered by advanced machine learning.
              </p>
              <div className="flex gap-4">
                <Link to="/login" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
                  Get Started
                </Link>
                <a href="#features" className="text-white border border-gray-600 px-6 py-3 rounded-lg hover:border-gray-400">
                  Learn More
                </a>
              </div>
              <div className="flex gap-8 mt-12">
                <div className="text-white">
                  <div className="text-3xl font-bold">99.9%</div>
                  <div className="text-gray-400">Accuracy Rate</div>
                </div>
                <div className="text-white">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-gray-400">Monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="min-h-screen flex items-center relative z-20">
        <div className="w-full">
          <Features />
        </div>
      </section>

      <section id="pricing" className="min-h-screen flex items-center relative z-20">
        <div className="w-full">
          <Pricing />
        </div>
      </section>
    </div>
  );
};

export default Landing; 