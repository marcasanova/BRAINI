import React from 'react';
import { Link } from 'react-router-dom';
import GeometricBackground from '@/components/GeometricBackground';
import WaitlistForm from '@/components/WaitlistForm';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />

      {/* Navigation */}
      <nav className="relative z-10 p-4">
        <div className="container mx-auto flex justify-end space-x-4">
          <Button
            variant="ghost"
            className="text-braini-blue hover:text-braini-blue-dark hover:bg-transparent"
            asChild
          >
            <Link to="/login">Sign In</Link>
          </Button>
          <Button
            variant="default"
            className="bg-braini-blue hover:bg-braini-blue-dark text-white transition-colors"
            asChild
          >
            <Link to="/register">Create Account</Link>
          </Button>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo and Title Section */}
          <div className="mb-12 animate-fade-in">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/fa0ca160-fc3a-4e28-b976-371888549499.png" 
                alt="Braini Logo" 
                className="w-32 h-32 md:w-40 md:h-40 object-contain animate-bounce-slow"
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
              <span className="text-braini-blue">Braini</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-2 font-medium">
              mind & emotions
            </p>
          </div>

          {/* Tagline */}
          <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4 leading-relaxed">
              Mind and emotions in harmony
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join our waitlist and discover how Braini can elevate your emotional well-being.
            </p>
          </div>

          {/* Waitlist Form */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <WaitlistForm />
          </div>

          {/* Additional Info */}
          <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center p-6 bg-white/70 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-braini-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl">🧠</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Mindful Approach</h3>
                <p className="text-gray-600 text-sm">Science-backed techniques for better emotional awareness</p>
              </div>
              
              <div className="text-center p-6 bg-white/70 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-braini-pink rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl">💖</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Emotional Balance</h3>
                <p className="text-gray-600 text-sm">Tools to help you understand and manage your emotions</p>
              </div>
              
              <div className="text-center p-6 bg-white/70 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-braini-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl">✨</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Personal Growth</h3>
                <p className="text-gray-600 text-sm">Personalized insights for your emotional journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
