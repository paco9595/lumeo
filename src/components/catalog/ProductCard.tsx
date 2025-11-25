'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-pastel-pink/20 hover:border-pastel-purple/40 transition-all duration-300 hover:shadow-lg hover:shadow-pastel-purple/10 flex flex-col group">
            <div className="relative h-64 w-full bg-gradient-to-br from-pastel-pink/10 to-pastel-purple/10">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-2">
                    <span className="text-xs font-medium text-pastel-accent uppercase tracking-wider">{product.category}</span>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1 line-clamp-2">{product.name}</h3>
                </div>
                <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <button
                        onClick={() => addToCart(product)}
                        className="bg-gradient-to-r from-pastel-pink to-pastel-purple text-gray-900 px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-md hover:shadow-pastel-purple/30 transition-all duration-300 hover:scale-105"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
