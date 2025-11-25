'use client';

import ProductCard from '@/components/catalog/ProductCard';

const BEST_SELLERS = [
    {
        id: '1',
        name: 'Minimalist Leather Watch',
        price: 129.99,
        image: 'https://placehold.co/600x600/png',
        category: 'Accessories'
    },
    {
        id: '2',
        name: 'Wireless Noise-Cancelling Headphones',
        price: 249.99,
        image: 'https://placehold.co/600x600/png',
        category: 'Electronics'
    },
    {
        id: '5',
        name: 'Ceramic Coffee Mug Set',
        price: 34.99,
        image: 'https://placehold.co/600x600/png',
        category: 'Home & Garden'
    },
    {
        id: '7',
        name: 'Polarized Sunglasses',
        price: 159.50,
        image: 'https://placehold.co/600x600/png',
        category: 'Accessories'
    }
];

export default function BestSellers() {
    return (
        <section className="py-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Best Sellers</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Our most popular products, loved by customers around the world.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {BEST_SELLERS.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
