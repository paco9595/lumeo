'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CartButton from './cart/CartButton';
import { Session } from 'next-auth';

interface NavbarContentProps {
    session: Session | null;
}

export default function NavbarContent({ session }: NavbarContentProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/catalog', label: 'Products' }
    ];

    return (
        <nav className="sticky top-0 z-40 w-full backdrop-blur-md  border-b border-pastel-purple/20 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
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
                        {!session && (
                            <Link
                                href="/login"
                                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Actions (Cart & Mobile Menu) */}
                    <div className="flex items-center gap-4">
                        <CartButton />

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 focus:outline-none transition-colors"
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`md:hidden fixed inset-0 z-30 bg-white transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
                    }`}
                style={{ top: '80px' }} // Height of the navbar
            >
                <div className="px-4 pt-4 pb-8 space-y-2 border-t border-gray-100 bg-(--background)">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMobileMenu}
                            className="block px-3 py-4 rounded-lg text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    {!session && (
                        <Link
                            href="/login"
                            onClick={closeMobileMenu}
                            className="block px-3 py-4 rounded-lg text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
