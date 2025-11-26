'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/products';
import { useCart } from '@/context/CartContext';

export default function ProductInfo({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('M');
    const [activeImage, setActiveImage] = useState(product.image);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
            {/* Image Gallery */}
            <div className="space-y-4">
                <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
                    <Image
                        src={activeImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <button
                        onClick={() => setActiveImage(product.image)}
                        className={`relative aspect-square bg-gray-100 overflow-hidden border ${activeImage === product.image ? 'border-black' : 'border-transparent'}`}
                    >
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </button>
                    {product.images?.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveImage(img)}
                            className={`relative aspect-square bg-gray-100 overflow-hidden border ${activeImage === img ? 'border-black' : 'border-transparent'}`}
                        >
                            <Image src={img} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center">
                <span className="text-sm text-gray-500 uppercase tracking-wider mb-2">{product.category}</span>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-2xl font-medium text-gray-900 mb-8">${product.price.toFixed(2)}</p>

                <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed">
                    <p>{product.description}</p>
                </div>

                {/* Size Selector */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Select Size</h3>
                    <div className="flex gap-3">
                        {['S', 'M', 'L', 'XL'].map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-12 h-12 flex items-center justify-center text-sm font-medium transition-all ${selectedSize === size
                                        ? 'bg-black text-white'
                                        : 'bg-white text-gray-900 border border-gray-200 hover:border-black'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Add to Cart */}
                <button
                    onClick={() => addToCart({ ...product, id: product.id })} // Ensure ID matches
                    className="w-full bg-black text-white py-4 font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all mb-6"
                >
                    Add to Cart
                </button>

                {/* Additional Info */}
                <div className="border-t border-gray-100 pt-6 space-y-3 text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                        <span className="w-5 text-center">🚚</span>
                        <span>Free shipping on orders over $200</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-5 text-center">↺</span>
                        <span>30-day return policy</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
