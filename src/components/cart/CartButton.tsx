'use client';

import { useCart } from '@/context/CartContext';

export function CartButton() {
    const { cartCount, toggleCart } = useCart();

    return (
        <button
            onClick={toggleCart}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Open cart"
        >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-black rounded-full min-w-[20px] h-5">
                    {cartCount}
                </span>
            )}
        </button>
    );
}
