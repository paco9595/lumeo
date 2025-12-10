'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AdminHeaderProps {
    userProfile: {
        first_name: string | null;
        last_name: string | null;
    } | null;
}

export default function AdminHeader({ userProfile }: AdminHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/users', label: 'Usuarios' },
        { href: '/admin/products', label: 'Productos' },
        { href: '/admin/orders', label: 'Pedidos' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-4 md:gap-8">
                        {/* Hamburger Button (Mobile) */}
                        <button
                            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>

                        <Link href="/admin" className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Panel de Administración
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {userProfile && (
                            <span className="text-sm text-gray-600 hidden lg:block">
                                {userProfile.first_name} {userProfile.last_name}
                            </span>
                        )}
                        <Link
                            href="/"
                            className="text-xs sm:text-sm bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium whitespace-nowrap"
                        >
                            Ver Tienda
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white absolute w-full shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 bg-gray-50/50"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    {userProfile && (
                        <div className="pt-4 pb-4 border-t border-gray-200 px-4">
                            <div className="flex items-center">
                                <div className="text-sm font-medium text-gray-500">Sesión iniciada como:</div>
                                <div className="ml-2 text-sm font-bold text-gray-800">
                                    {userProfile.first_name} {userProfile.last_name}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
