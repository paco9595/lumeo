'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import QuantitySelector from './QuantitySelector';

export default function ProductInfo({ product }: { product: Product }) {
    const { addToCart } = useCart();

    // Initialize selected options based on the first variant or default
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

    const [activeImage, setActiveImage] = useState(product.image);
    const [quantity, setQuantity] = useState(1);

    // Set initial options when product loads
    useEffect(() => {
        if (product.options && product.options.length > 0) {
            const initialOptions: Record<string, string> = {};
            product.options.forEach(option => {
                if (option.values.length > 0) {
                    initialOptions[option.name] = option.values[0].value;
                }
            });
            setSelectedOptions(initialOptions);
        }
    }, [product.options]);

    // Find the selected variant
    const selectedVariant = useMemo(() => {
        if (!product.variants || product.variants.length === 0) return null;

        return product.variants.find(variant => {
            if (!variant.options) return false;
            // Check if all selected options match the variant's options
            return Object.entries(selectedOptions).every(([name, value]) =>
                variant.options?.[name] === value
            );
        });
    }, [product.variants, selectedOptions]);

    const currentPrice = selectedVariant?.price ?? product.price;
    const currentStock = selectedVariant?.stock ?? product.stock;

    // Update active image if variant has one
    useEffect(() => {
        if (selectedVariant?.image_url) {
            setActiveImage(selectedVariant.image_url);
        } else {
            setActiveImage(product.image);
        }
    }, [selectedVariant, product.image]);

    const handleOptionChange = (optionName: string, value: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionName]: value
        }));
    };

    const handleAddToCart = () => {
        const variantId = selectedVariant?.id || undefined;
        // Construct a descriptive name for the variant, e.g. "Size: M, Color: Red"
        const variantName = Object.entries(selectedOptions)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');

        addToCart({
            ...product,
            price: currentPrice,
            stock: currentStock,
            image: activeImage,
            quantity,
            variantId,
            variantName: variantName || undefined
        });
    };

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
                <p className="text-2xl font-medium text-gray-900 mb-8">${currentPrice.toFixed(2)}</p>

                <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed">
                    <p>{product.description}</p>
                </div>

                {/* Option Selectors */}
                {product.options?.map((option) => (
                    <div key={option.id} className="mb-6">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Select {option.name}</h3>
                        <div className="flex flex-wrap gap-3">
                            {option.values.map((val) => (
                                <button
                                    key={val.id}
                                    onClick={() => handleOptionChange(option.name, val.value)}
                                    className={`px-4 py-2 text-sm font-medium transition-all ${selectedOptions[option.name] === val.value
                                        ? 'bg-black text-white'
                                        : 'bg-white text-gray-900 border border-gray-200 hover:border-black'
                                        }`}
                                >
                                    {val.value}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Fallback for hardcoded sizes if no options defined (Legacy support or if user hasn't migrated data yet) */}
                {!product.options && (
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Select Size</h3>
                        <div className="flex gap-3">
                            {['S', 'M', 'L', 'XL'].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => handleOptionChange('Size', size)} // This might not work perfectly with new logic if options are undefined
                                    className={`w-12 h-12 flex items-center justify-center text-sm font-medium transition-all ${selectedOptions['Size'] === size
                                        ? 'bg-black text-white'
                                        : 'bg-white text-gray-900 border border-gray-200 hover:border-black'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quantity Selector */}
                <QuantitySelector
                    initialQuantity={1}
                    onChange={setQuantity}
                    className="mb-8"
                />

                {/* Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    disabled={currentStock === 0}
                    className="w-full bg-black text-white py-4 font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all mb-6 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
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

