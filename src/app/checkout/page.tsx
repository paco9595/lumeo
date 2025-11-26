'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CheckoutPage() {
    const { items, removeFromCart, cartTotal } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('credit');

    const shipping: number = 0; // Free shipping
    const total = cartTotal + shipping;

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {items.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-gray-500 text-lg mb-8 font-light">Your cart is empty.</p>
                        <Link href="/catalog" className="inline-block bg-black text-white px-8 py-4 text-sm font-medium tracking-widest hover:bg-gray-800 transition-all">
                            CONTINUE SHOPPING
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Shopping Cart - Left Column */}
                        <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100">
                            <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Shopping Cart.</h1>

                            {/* Product Table Header */}
                            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider mb-6">
                                <div className="col-span-5">Product</div>
                                <div className="col-span-2">Size</div>
                                <div className="col-span-2">Quantity</div>
                                <div className="col-span-2">Total Price</div>
                                <div className="col-span-1"></div>
                            </div>

                            {/* Product List */}
                            <div className="space-y-6 mb-8">
                                {items.map((item) => (
                                    <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-100">
                                        {/* Product Info */}
                                        <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                                            <div className="relative w-20 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 text-sm mb-1">{item.name}</h3>
                                                <p className="text-xs text-gray-500">${item.price.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        {/* Size Selector */}
                                        <div className="col-span-6 md:col-span-2">
                                            <select className="w-full px-2 py-2 bg-gray-50 border-none text-sm focus:outline-none focus:ring-1 focus:ring-black">
                                                <option>35 L</option>
                                                <option>30 L</option>
                                                <option>25 L</option>
                                            </select>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="col-span-4 md:col-span-2">
                                            <div className="flex items-center gap-3 border border-gray-200 px-3 py-1.5 w-fit">
                                                <button className="text-gray-400 hover:text-black transition-colors">−</button>
                                                <span className="text-sm font-medium text-gray-900 w-4 text-center">{item.quantity}</span>
                                                <button className="text-gray-400 hover:text-black transition-colors">+</button>
                                            </div>
                                        </div>

                                        {/* Total Price */}
                                        <div className="col-span-1 md:col-span-2">
                                            <span className="font-medium text-gray-900 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>

                                        {/* Remove Button */}
                                        <div className="col-span-1 md:col-span-1 flex justify-end">
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-300 hover:text-black transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cart Summary */}
                            <div className="space-y-3 mb-8 bg-gray-50 p-6">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-gray-200 mt-2">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Continue Shopping Link */}
                            <Link href="/catalog" className="inline-flex items-center text-gray-500 hover:text-black text-sm font-medium transition-colors">
                                <span className="mr-2">←</span>
                                Continue Shopping
                            </Link>
                        </div>

                        {/* Payment Info - Right Column */}
                        <div className="bg-white p-8 h-fit shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Payment Info.</h2>

                            <div className="space-y-6">
                                {/* Payment Method Accordion */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Payment Method</label>
                                    <div className="space-y-3">
                                        {/* Credit Card Option */}
                                        <div className="bg-white border border-gray-200 overflow-hidden">
                                            <button
                                                onClick={() => setPaymentMethod('credit')}
                                                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'credit' ? 'border-black' : 'border-gray-300'
                                                        }`}>
                                                        {paymentMethod === 'credit' && (
                                                            <div className="w-2 h-2 rounded-full bg-black"></div>
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-gray-900 text-sm">Credit Card</span>
                                                </div>
                                            </button>

                                            {/* Credit Card Form - Expandable */}
                                            <div className={`transition-all duration-300 ease-in-out ${paymentMethod === 'credit' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                                                }`}>
                                                <div className="p-4 pt-0 space-y-4 border-t border-gray-100">
                                                    {/* Name on Card */}
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Name On Card</label>
                                                        <input
                                                            type="text"
                                                            placeholder="John Carter"
                                                            className="w-full px-3 py-2 bg-gray-50 border-none focus:ring-1 focus:ring-black text-sm"
                                                        />
                                                    </div>

                                                    {/* Card Number */}
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Card Number</label>
                                                        <input
                                                            type="text"
                                                            placeholder="•••• •••• •••• 2153"
                                                            className="w-full px-3 py-2 bg-gray-50 border-none focus:ring-1 focus:ring-black text-sm"
                                                        />
                                                    </div>

                                                    {/* Expiration and CVV */}
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Month</label>
                                                            <select className="w-full px-3 py-2 bg-gray-50 border-none focus:ring-1 focus:ring-black text-sm">
                                                                <option>05</option>
                                                                <option>06</option>
                                                                <option>07</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Year</label>
                                                            <select className="w-full px-3 py-2 bg-gray-50 border-none focus:ring-1 focus:ring-black text-sm">
                                                                <option>2024</option>
                                                                <option>2025</option>
                                                                <option>2026</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1.5">CVV</label>
                                                            <input
                                                                type="text"
                                                                placeholder="156"
                                                                maxLength={3}
                                                                className="w-full px-3 py-2 bg-gray-50 border-none focus:ring-1 focus:ring-black text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* PayPal Option */}
                                        <div className="bg-white border border-gray-200 overflow-hidden">
                                            <button
                                                onClick={() => setPaymentMethod('paypal')}
                                                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'paypal' ? 'border-black' : 'border-gray-300'
                                                        }`}>
                                                        {paymentMethod === 'paypal' && (
                                                            <div className="w-2 h-2 rounded-full bg-black"></div>
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-gray-900 text-sm">PayPal</span>
                                                </div>
                                            </button>

                                            {/* PayPal Content - Expandable */}
                                            <div className={`transition-all duration-300 ease-in-out ${paymentMethod === 'paypal' ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                                                }`}>
                                                <div className="p-4 pt-0 border-t border-gray-100">
                                                    <p className="text-xs text-gray-500 leading-relaxed">
                                                        You will be redirected to PayPal to complete your purchase securely.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Check Out Button */}
                                <button className="w-full bg-black text-white py-4 font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all">
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
