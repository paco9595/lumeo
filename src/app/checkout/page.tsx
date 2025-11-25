'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CheckoutPage() {
    const { items, removeFromCart, cartTotal } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('credit');

    const shipping = 0; // Free shipping
    const total = cartTotal + shipping;

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {items.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg mb-6">Your cart is empty.</p>
                        <Link href="/catalog" className="inline-block bg-gradient-to-r from-pastel-pink to-pastel-purple text-gray-900 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Shopping Cart - Left Column */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart.</h1>

                            {/* Product Table Header */}
                            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm font-medium text-gray-600 mb-4">
                                <div className="col-span-5">Product</div>
                                <div className="col-span-2">Size</div>
                                <div className="col-span-2">Quantity</div>
                                <div className="col-span-2">Total Price</div>
                                <div className="col-span-1"></div>
                            </div>

                            {/* Product List */}
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-100">
                                        {/* Product Info */}
                                        <div className="col-span-12 md:col-span-5 flex items-center gap-3">
                                            <div className="relative w-16 h-16 bg-gradient-to-br from-pastel-pink/20 to-pastel-purple/20 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                                                <p className="text-xs text-gray-500">${item.price.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        {/* Size Selector */}
                                        <div className="col-span-6 md:col-span-2">
                                            <select className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pastel-accent">
                                                <option>35 L</option>
                                                <option>30 L</option>
                                                <option>25 L</option>
                                            </select>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="col-span-4 md:col-span-2">
                                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1">
                                                <button className="text-gray-500 hover:text-gray-900 w-6 h-6 flex items-center justify-center">−</button>
                                                <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                                <button className="text-gray-500 hover:text-gray-900 w-6 h-6 flex items-center justify-center">+</button>
                                            </div>
                                        </div>

                                        {/* Total Price */}
                                        <div className="col-span-1 md:col-span-2">
                                            <span className="font-semibold text-gray-900 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>

                                        {/* Remove Button */}
                                        <div className="col-span-1 md:col-span-1 flex justify-end">
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cart Summary */}
                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping:</span>
                                    <span className="font-semibold">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Continue Shopping Link */}
                            <Link href="/catalog" className="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium">
                                <span className="mr-2">←</span>
                                Continue Shopping
                            </Link>
                        </div>

                        {/* Payment Info - Right Column */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Payment Info.</h2>

                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-pastel-purple/20">
                                {/* Payment Method Accordion */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method:</label>
                                    <div className="space-y-3">
                                        {/* Credit Card Option */}
                                        <div className="border border-pastel-purple/30 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => setPaymentMethod('credit')}
                                                className={`w-full flex items-center justify-between p-4 transition-colors ${paymentMethod === 'credit' ? 'bg-pastel-purple/10' : 'bg-white/50 hover:bg-pastel-purple/5'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'credit' ? 'border-pastel-accent' : 'border-gray-300'
                                                        }`}>
                                                        {paymentMethod === 'credit' && (
                                                            <div className="w-2.5 h-2.5 rounded-full bg-pastel-accent"></div>
                                                        )}
                                                    </div>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                    <span className="font-medium text-gray-900">Credit Card</span>
                                                </div>
                                                <svg
                                                    className={`w-5 h-5 transition-transform ${paymentMethod === 'credit' ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {/* Credit Card Form - Expandable */}
                                            <div className={`transition-all duration-300 ease-in-out ${paymentMethod === 'credit' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                                                }`}>
                                                <div className="p-4 pt-2 space-y-4 bg-white/30">
                                                    {/* Name on Card */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Name On Card:</label>
                                                        <input
                                                            type="text"
                                                            placeholder="John Carter"
                                                            className="w-full px-4 py-2.5 bg-white border border-pastel-purple/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-accent"
                                                        />
                                                    </div>

                                                    {/* Card Number */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number:</label>
                                                        <input
                                                            type="text"
                                                            placeholder="•••• •••• •••• 2153"
                                                            className="w-full px-4 py-2.5 bg-white border border-pastel-purple/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-accent"
                                                        />
                                                    </div>

                                                    {/* Expiration and CVV */}
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Month:</label>
                                                            <select className="w-full px-3 py-2.5 bg-white border border-pastel-purple/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-accent">
                                                                <option>05</option>
                                                                <option>06</option>
                                                                <option>07</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Year:</label>
                                                            <select className="w-full px-3 py-2.5 bg-white border border-pastel-purple/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-accent">
                                                                <option>2024</option>
                                                                <option>2025</option>
                                                                <option>2026</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">CVV:</label>
                                                            <input
                                                                type="text"
                                                                placeholder="156"
                                                                maxLength={3}
                                                                className="w-full px-3 py-2.5 bg-white border border-pastel-purple/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-accent"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* PayPal Option */}
                                        <div className="border border-pastel-purple/30 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => setPaymentMethod('paypal')}
                                                className={`w-full flex items-center justify-between p-4 transition-colors ${paymentMethod === 'paypal' ? 'bg-pastel-purple/10' : 'bg-white/50 hover:bg-pastel-purple/5'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'paypal' ? 'border-pastel-accent' : 'border-gray-300'
                                                        }`}>
                                                        {paymentMethod === 'paypal' && (
                                                            <div className="w-2.5 h-2.5 rounded-full bg-pastel-accent"></div>
                                                        )}
                                                    </div>
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.653h8.53c2.347 0 4.203.645 5.072 1.87.5.708.734 1.57.734 2.71 0 3.28-2.114 5.52-5.26 5.52h-2.88a.77.77 0 0 0-.76.653l-.797 5.053a.641.641 0 0 1-.633.653z" />
                                                    </svg>
                                                    <span className="font-medium text-gray-900">PayPal</span>
                                                </div>
                                                <svg
                                                    className={`w-5 h-5 transition-transform ${paymentMethod === 'paypal' ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {/* PayPal Content - Expandable */}
                                            <div className={`transition-all duration-300 ease-in-out ${paymentMethod === 'paypal' ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                                                }`}>
                                                <div className="p-4 pt-2 bg-white/30">
                                                    <p className="text-sm text-gray-600 mb-4">
                                                        You will be redirected to PayPal to complete your purchase securely.
                                                    </p>
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                                                        💡 PayPal offers buyer protection and secure payment processing.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Check Out Button */}
                                <button className="w-full bg-gradient-to-r from-pastel-pink to-pastel-purple text-gray-900 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-pastel-purple/30 transition-all hover:scale-105">
                                    Check Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
