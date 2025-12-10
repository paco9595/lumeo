'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CartButton } from './cart/CartButton';
import MobileMenu from './MobileMenu';
import AuthButtons from './AuthButtons';

export default function Navbar() {
  const pathname = usePathname();

  // Don't show navbar on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/catalog', label: 'Products' }
  ];

  return (
    <nav className="sticky top-0 z-40 w-full  backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-full border border-gray-200 group-hover:border-black transition-colors">
                <Image
                  src="/logo.jpg"
                  alt="Lumeo Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-bold text-2xl tracking-tight text-gray-900 group-hover:text-gray-700 transition-colors">Lumeo</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors relative group"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            ))}
          </div>

          {/* Actions (Cart & Mobile Menu) */}
          <div className="flex items-center gap-4">
            <CartButton />

            {/* Auth Components */}
            <div className="hidden md:block">
              <AuthButtons />
            </div>

            {/* Mobile Menu */}
            <MobileMenu navLinks={navLinks} />
          </div>
        </div>
      </div>
    </nav>
  );
}
