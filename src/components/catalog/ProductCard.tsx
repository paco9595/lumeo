'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Product, ProductWithImages } from '@/types/Product';

export default function ProductCard({ product }: { product: Product | ProductWithImages }) {
    const { addToCart } = useCart();
    // console.log(product);
    const router = useRouter();

    // Normalize data
    const productId = 'id' in product ? product.id : (product as Product).product_id; // Product has product_id
    const name = product.name || 'Producto sin nombre';
    // Product has base_price, ProductWithImages has price
    const price = 'price' in product ? product.price : ((product as Product).base_price || 0);
    const imageUrl = product.product_images?.[0]?.image_url;

    // cast to any to access properties safely or use type guards
    const p = product as Product;
    const hasOptions = p.product_options && Object.keys(p.product_options).length > 0;

    const stock = 'stock' in product ? product.stock : (p.variant_stock || 0);
    const isOutOfStock = stock === 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link click if wrapped
        e.stopPropagation();

        if (hasOptions) {
            router.push(`/product/${productId}`);
        } else {
            // we need to be careful with addToCart, ensuring it gets a valid objects
            // For now, suppress type error if addToCart expects strict Product

            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            addToCart({ ...(product as any), quantity: 1 });
        }
    };

    const categories = 'categories' in product ? product.categories : null;
    const categoryNames = Array.isArray(categories) ? categories.map(c => c.name).join(', ') : '';

    return (
        <div className="bg-white rounded-none overflow-hidden border border-transparent hover:border-gray-200 transition-all duration-300 flex flex-col group">
            <div className="relative h-80 w-full bg-gray-100">
                <Link href={`/product/${productId}`} className="block w-full h-full">
                    {imageUrl && <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />}
                </Link>
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`absolute bottom-4 right-4 bg-white text-black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white z-10 ${isOutOfStock ? 'cursor-not-allowed bg-gray-200 text-gray-400 hover:bg-gray-200 hover:text-gray-400' : ''}`}
                    aria-label={hasOptions ? "Select options" : isOutOfStock ? "Out of stock" : "Add to cart"}
                >
                    {hasOptions ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                    )}
                </button>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{categoryNames}</span>
                    <Link href={`/product/${productId}`} className="block">
                        <h3 className="text-base font-medium text-gray-900 mt-1 line-clamp-2 group-hover:underline decoration-1 underline-offset-4">{name}</h3>
                    </Link>
                </div>
                <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900">${price.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
