'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface MobileMenuProps {
    navLinks: { href: string; label: string }[];
}

export default function MobileMenu({ navLinks }: MobileMenuProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, signOut } = useAuth();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
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
                    {user ? (
                        <>
                            <div className="px-3 py-4 text-sm text-gray-600">
                                {user.email}
                            </div>
                            <button
                                onClick={() => {
                                    signOut();
                                    closeMobileMenu();
                                }}
                                className="block w-full text-left px-3 py-4 rounded-lg text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/sign-in"
                            onClick={closeMobileMenu}
                            className="block px-3 py-4 rounded-lg text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
