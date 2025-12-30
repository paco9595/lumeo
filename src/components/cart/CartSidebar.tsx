'use client';

import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export function CartSidebar() {
    const { items, isOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const pathname = usePathname();

    // Don't show cart sidebar on admin routes
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/75 z-40 transition-opacity"
                    onClick={toggleCart}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                        <button
                            onClick={toggleCart}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {items.length === 0 ? (
                            <div className="text-center text-gray-500 mt-10">
                                <p>Your cart is empty.</p>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={`${item.id}-${item.variant_id || 'default'}`} className="flex gap-4">
                                    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                                        <Image
                                            src={item.product_images?.[0].image_url || ''}
                                            alt={item.name || 'Product Image'}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">{item.name}</h3>
                                            {/* {item.variantName && (
                                                <p className="text-sm text-gray-500 mb-1">{item.variantName}</p>
                                            )} */}
                                            <div className="flex items-center border border-gray-200 rounded-lg w-fit">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant_id)}
                                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 text-sm"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="px-2 py-1 text-sm text-gray-900 w-8 text-center border-x border-gray-200">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant_id)}
                                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-sm"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-900">${((item?.variant_price || 1) * item.quantity).toFixed(2)}</span>
                                            <button
                                                onClick={() => removeFromCart(item.id, item.variant_id)}
                                                className="text-red-500 text-sm hover:text-red-600 font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                        </div>
                        <Link
                            href="/checkout"
                            onClick={toggleCart}
                            className={`w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center ${items.length === 0 ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
