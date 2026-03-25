'use client'

import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center" onClick={closeMenu}>
            <Image
              src="/logorighttext.png"
              alt="DashMetrx"
              width={220}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </a>

          <div className="hidden md:flex items-center space-x-8">
            <a href="/#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="/#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="/#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
            <a href="/#faq" className="text-gray-300 hover:text-white transition-colors">
              FAQ
            </a>
          </div>

          <div className="hidden md:flex items-center">
            <a
              href="/coming-soon"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20 inline-block"
            >
              Download App (Coming Soon)
            </a>
          </div>

          <button
            className="md:hidden text-gray-300 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 space-y-4 border-t border-gray-800">
            <a
              href="/#features"
              onClick={closeMenu}
              className="block text-gray-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="/#pricing"
              onClick={closeMenu}
              className="block text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="/#about"
              onClick={closeMenu}
              className="block text-gray-300 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="/#faq"
              onClick={closeMenu}
              className="block text-gray-300 hover:text-white transition-colors"
            >
              FAQ
            </a>

            <div className="pt-4 space-y-2">
              <a
                href="/coming-soon"
                onClick={closeMenu}
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
              >
                Download App (Coming Soon)
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}