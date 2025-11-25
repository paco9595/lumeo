'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from 'next-auth';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    addToCart: (product: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (productId: string) => void;
    toggleCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children, session }: { children: ReactNode; session: Session | null }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from LocalStorage on mount if not logged in
    useEffect(() => {
        if (!session) {
            const savedCart = localStorage.getItem('cartItems');
            if (savedCart) {
                try {
                    setItems(JSON.parse(savedCart));
                } catch (error) {
                    console.error('Failed to parse cart items from localStorage:', error);
                }
            }
        }
        setIsInitialized(true);
    }, [session]);

    // Save to LocalStorage when items change if not logged in
    useEffect(() => {
        if (isInitialized && !session) {
            localStorage.setItem('cartItems', JSON.stringify(items));
        }
    }, [items, session, isInitialized]);

    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
        setIsOpen(true);
    };

    const removeFromCart = (productId: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    const toggleCart = () => setIsOpen((prev) => !prev);

    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, isOpen, addToCart, removeFromCart, toggleCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
