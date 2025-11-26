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
        <div className="bg-white rounded-none overflow-hidden border border-transparent hover:border-gray-200 transition-all duration-300 flex flex-col group">
            <div className="relative h-80 w-full bg-gray-100">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white"
                    aria-label="Add to cart"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                </button>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{product.category}</span>
                    <h3 className="text-base font-medium text-gray-900 mt-1 line-clamp-2 group-hover:underline decoration-1 underline-offset-4">{product.name}</h3>
                </div>
                <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900">${product.price.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
