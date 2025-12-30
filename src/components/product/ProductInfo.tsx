'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import QuantitySelector from './QuantitySelector';
import { Product, ProductVariantSummary } from '@/types/Product';
import ImageGallery from './imageGallery';
import VariantSelector from './variantSelector';

export default function ProductInfo({ product, variants }: { product: Product, variants: ProductVariantSummary[] }) {
    const { addToCart } = useCart();

    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        if (product?.product_options && Object.keys(product.product_options).length > 0) {
            const initialOptions: Record<string, string> = {};
            Object.entries(product.product_options).forEach(([name, values]) => {
                if (values.length > 0) {
                    initialOptions[name] = values[0];
                }
            });
            setSelectedOptions(initialOptions);
        }
    }, [product.product_options]);

    // const selectedVariant = useMemo(() => {
    //     if (!variants || Object.keys(variants).length === 0) {
    //         return null;
    //     }

    //     return product.product_variants.find(variant => {
    //         if (!variant.product_variant_options) return false;
    //         return Object.entries(selectedOptions).every(([optionName, value]) =>
    //             variant.product_variant_options?.[optionName] === value
    //         );
    //     });
    // }, [product.product_variants, selectedOptions]);

    const currentPrice = 100;
    // const currentStock = 100;

    const handleAddToCart = () => {
        console.log('handleAddToCart', { product, selectedOptions, quantity });
        const cartItem = {
            ...product,
            id: product.variant_id || '',
            variant_id: selectedOptions.variant_id || '',
            sku: product.sku || '',
            quantity
        }
        addToCart(cartItem);
    };

    const galleryImages = useMemo(() => {
        const images: { image_url: string }[] = [];

        if (product.product_images && product.product_images.length > 0) {
            product.product_images.forEach((img) => {
                if (img.image_url) {
                    images.push({ image_url: img.image_url });
                }
            });
        }

        if (images.length === 0 && product.image_url) {
            images.push({ image_url: product.image_url });
        }

        return images;
    }, [product.product_images, product.image_url]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
            {/* Image Gallery */}
            <div className="space-y-4">
                <ImageGallery images={galleryImages} />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-start">
                <span className="text-sm text-gray-500 uppercase tracking-wider mb-2">{product.product_categories?.[0]}</span>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-2xl font-medium text-gray-900 mb-8">${currentPrice?.toFixed(2)}</p>

                <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed">
                    <p>{product.description}</p>
                </div>
                {/* Option Selectors */}
                <div className="mb-8">
                    <VariantSelector variantsData={variants || []} />
                </div>

                {/* Quantity Selector */}
                <QuantitySelector
                    initialQuantity={1}
                    onChange={setQuantity}
                    className="mb-8"
                />

                {/* Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    disabled={product.variant_stock === 0}
                    className="w-full bg-black text-white py-4 font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all mb-6 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >

                    {product.variant_stock === 0 ? 'Out of Stock' : 'Add to Cart'}
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

