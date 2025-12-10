'use client';

import { useState } from 'react';

interface QuantitySelectorProps {
    initialQuantity?: number;
    onChange?: (quantity: number) => void;
    className?: string;
}

export default function QuantitySelector({
    initialQuantity = 1,
    onChange,
    className = ''
}: QuantitySelectorProps) {
    const [quantity, setQuantity] = useState(initialQuantity);

    const handleIncrement = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onChange?.(newQuantity);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            onChange?.(newQuantity);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= 1) {
            setQuantity(value);
            onChange?.(value);
        }
    };

    return (
        <div className={className}>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Quantity</h3>
            <div className="flex items-center gap-4">
                <button
                    onClick={handleDecrement}
                    className="w-12 h-12 flex items-center justify-center text-xl font-medium bg-white text-gray-900 border border-gray-200 hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                >
                    −
                </button>
                <input
                    type="number"
                    value={quantity}
                    onChange={handleInputChange}
                    className="w-20 h-12 text-center text-lg font-medium border border-gray-200 focus:border-black focus:outline-none"
                    min="1"
                    aria-label="Quantity"
                />
                <button
                    onClick={handleIncrement}
                    className="w-12 h-12 flex items-center justify-center text-xl font-medium bg-white text-gray-900 border border-gray-200 hover:border-black transition-all"
                    aria-label="Increase quantity"
                >
                    +
                </button>
            </div>
        </div>
    );
}
