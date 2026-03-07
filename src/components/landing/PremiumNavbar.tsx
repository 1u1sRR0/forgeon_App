'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface PremiumNavbarProps {
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
}

export default function PremiumNavbar({ activeSection, onNavigate }: PremiumNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) {
      console.warn(`Section ${sectionId} not found`);
      return;
    }
    element.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(sectionId);
    }
  };

  const navLinks = [
    { id: 'features', label: 'Features' },
    { id: 'about', label: 'About' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${isScrolled ? 'bg-black/30 backdrop-blur-xl border-b border-white/10 shadow-lg' : 'bg-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - EXTRA LARGE */}
          <div className="flex items-center gap-3">
            {!logoError ? (
              <Image
                src="/logo_forgeon.png"
                alt="Forgeon"
                width={96}
                height={96}
                className="object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
            )}
          </div>

          {/* Center - App Name - REMOVED per user request */}

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavigate(link.id)}
                className={`
                  text-sm font-medium transition-all duration-200
                  ${activeSection === link.id 
                    ? 'text-blue-400' 
                    : 'text-white/80 hover:text-white'
                  }
                `}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right - Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="
                px-6 py-2 rounded-lg
                bg-gradient-to-r from-blue-500 to-purple-600
                text-white text-sm font-medium
                hover:from-blue-600 hover:to-purple-700
                transition-all duration-200
                shadow-lg shadow-blue-500/25
              "
            >
              Start Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavigate(link.id)}
                className={`
                  block w-full text-left px-4 py-2 rounded-lg
                  ${activeSection === link.id 
                    ? 'text-blue-400 bg-blue-500/10' 
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 space-y-2">
              <Link
                href="/login"
                className="block w-full text-center px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="
                  block w-full text-center px-4 py-2 rounded-lg
                  bg-gradient-to-r from-blue-500 to-purple-600
                  text-white font-medium
                "
              >
                Start Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
