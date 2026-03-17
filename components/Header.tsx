'use client'

import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DM</span>
            </div>
            <span className="text-xl font-semibold text-white">DashMetrx</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a href="/login" className="text-gray-300 hover:text-white transition-colors px-4 py-2">
              Log in
            </a>
            <a href="/login#signup" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20 inline-block">
              Get Started
            </a>
          </div>

          <button
            className="md:hidden text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 space-y-4 border-t border-gray-800">
            <a href="#features" className="block text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="block text-gray-300 hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="block text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#faq" className="block text-gray-300 hover:text-white transition-colors">FAQ</a>
            <div className="pt-4 space-y-2">
              <button className="w-full text-gray-300 hover:text-white transition-colors px-4 py-2 border border-gray-700 rounded-lg">
                Log in
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
