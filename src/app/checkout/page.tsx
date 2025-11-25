'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, removeFromCart, cartTotal } = useCart();

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
                <p className="text-gray-600 mb-8">Review your order before proceeding to payment</p>

                {items.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg mb-6">Your cart is empty.</p>
                        <Link href="/catalog" className="inline-block bg-gradient-to-r from-pastel-pink to-pastel-purple text-gray-900 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items List */}
                        <div className="flex-grow space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-pastel-purple/10 backdrop-blur-sm rounded-2xl hover:bg-pastel-purple/15 transition-all">
                                    <div className="relative w-20 h-20 flex-shrink-0 bg-gradient-to-br from-pastel-pink/20 to-pastel-purple/20 rounded-xl overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                                                <p className="text-gray-500 text-sm mt-0.5">${item.price.toFixed(2)} × {item.quantity}</p>
                                            </div>
                                            <span className="font-bold text-gray-900 text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 text-xs font-medium hover:text-red-600 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="w-full lg:w-96 flex-shrink-0">
                            <div className="bg-gradient-to-br from-pastel-pink/30 to-pastel-purple/30 backdrop-blur-sm p-6 rounded-2xl sticky top-24 border-2 border-pastel-purple/40 shadow-lg shadow-pastel-purple/20">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax (Estimate)</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="border-t border-pastel-purple/20 pt-3 flex justify-between font-bold text-gray-900 text-lg">
                                        <span>Total</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    className="w-full bg-gradient-to-r from-pastel-pink to-pastel-purple text-gray-900 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-pastel-purple/30 transition-all hover:scale-105"
                                    onClick={() => console.log('Proceeding to payment...')}
                                >
                                    Continue to Payment
                                </button>

                                <p className="text-xs text-gray-500 mt-4 text-center">
                                    🔒 Secure Checkout - SSL Encrypted
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
