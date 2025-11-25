'use client';

import { useState } from 'react';

export default function FilterSidebar() {
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

    return (
        <div className="bg-pastel-purple/20 backdrop-blur-sm p-6 rounded-2xl border border-pastel-purple/30 h-fit sticky top-24">
            <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-base">Categories</h3>
                <div className="space-y-2">
                    {['All Products', 'Electronics', 'Clothing', 'Home & Garden', 'Sports'].map((category) => (
                        <label key={category} className="flex items-center gap-2.5 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input type="checkbox" className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-pastel-accent transition-all checked:border-pastel-accent checked:bg-pastel-accent hover:border-pastel-accent/80" />
                                <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">{category}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-base">Price Range</h3>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                        <input
                            type="number"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                            className="w-full pl-6 pr-2 py-1.5 bg-white/50 border border-pastel-purple/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-accent focus:border-transparent text-sm"
                            placeholder="Min"
                        />
                    </div>
                    <span className="text-gray-400 text-sm">-</span>
                    <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                        <input
                            type="number"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                            className="w-full pl-6 pr-2 py-1.5 bg-white/50 border border-pastel-purple/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-accent focus:border-transparent text-sm"
                            placeholder="Max"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-base">Sort By</h3>
                <select className="w-full p-2 bg-white/50 border border-pastel-purple/30 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-pastel-accent focus:border-transparent block">
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                </select>
            </div>
        </div>
    );
}
