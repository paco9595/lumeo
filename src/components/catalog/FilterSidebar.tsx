'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from URL params
    const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
        const categories = searchParams.get('categories');
        return categories ? categories.split(',') : [];
    });

    const [priceRange, setPriceRange] = useState({
        min: Number(searchParams.get('minPrice')) || 0,
        max: Number(searchParams.get('maxPrice')) || 1000
    });

    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();

        if (selectedCategories.length > 0) {
            params.set('categories', selectedCategories.join(','));
        }

        if (priceRange.min > 0) {
            params.set('minPrice', priceRange.min.toString());
        }

        if (priceRange.max < 1000) {
            params.set('maxPrice', priceRange.max.toString());
        }

        if (sortBy !== 'featured') {
            params.set('sort', sortBy);
        }

        const queryString = params.toString();
        const newUrl = queryString ? `/catalog?${queryString}` : '/catalog';

        router.replace(newUrl, { scroll: false });
    }, [selectedCategories, priceRange, sortBy, router]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    return (
        <div className="bg-white p-6 h-fit sticky top-24 border-r border-gray-100 pr-8">
            <div className="mb-8">
                <h3 className="font-medium text-gray-900 mb-4 text-sm uppercase tracking-wider">Categories</h3>
                <div className="space-y-3">
                    {['Boxes', 'Buttles', 'Cake Toppers', 'Stickers', 'T-Shirts'].map((category) => (
                        <label key={category} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-none border border-gray-300 transition-all checked:border-black checked:bg-black hover:border-gray-400"
                                />
                                <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-gray-600 text-sm group-hover:text-black transition-colors">{category}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <h3 className="font-medium text-gray-900 mb-4 text-sm uppercase tracking-wider">Price Range</h3>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                        <input
                            type="number"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                            className="w-full pl-6 pr-2 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-none focus:outline-none text-sm transition-all"
                            placeholder="Min"
                        />
                    </div>
                    <span className="text-gray-300 text-sm">-</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                        <input
                            type="number"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                            className="w-full pl-6 pr-2 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-none focus:outline-none text-sm transition-all"
                            placeholder="Max"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-medium text-gray-900 mb-4 text-sm uppercase tracking-wider">Sort By</h3>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 text-gray-900 text-sm rounded-none focus:outline-none block transition-all"
                >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                </select>
            </div>
        </div>
    );
}
