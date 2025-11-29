'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import {
    getOrCreateCart,
    getCartItems,
    addCartItem,
    removeCartItem,
    syncLocalCartToSupabase,
} from '@/lib/supabase/cartApi';

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

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [cartId, setCartId] = useState<number | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    const { isSignedIn } = useAuth();
    const { user } = useUser();

    // Load cart from localStorage (for non-logged-in users)
    const loadCartFromLocalStorage = () => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to parse cart items from localStorage:', error);
            }
        }
    };

    // Sync cart with Supabase (for logged-in users)
    const syncCartWithSupabase = async () => {
        if (!user?.id || isSyncing) return;

        setIsSyncing(true);
        try {
            // Get or create cart
            const { data: cart, error: cartError } = await getOrCreateCart(user.id);

            if (cartError || !cart) {
                console.error('Error getting/creating cart:', cartError);
                return;
            }

            setCartId(cart.id);

            // Check if there are local items to sync
            const localCart = localStorage.getItem('cartItems');
            if (localCart) {
                try {
                    const localItems: CartItem[] = JSON.parse(localCart);
                    if (localItems.length > 0) {
                        // Sync local items to Supabase
                        await syncLocalCartToSupabase(user.id, localItems);
                        // Clear localStorage after syncing
                        localStorage.removeItem('cartItems');
                    }
                } catch (error) {
                    console.error('Error syncing local cart:', error);
                }
            }

            // Load cart items from Supabase
            const { data: cartItems, error: itemsError } = await getCartItems(cart.id);

            if (itemsError) {
                console.error('Error loading cart items:', itemsError);
                return;
            }

            setItems(cartItems || []);
        } finally {
            setIsSyncing(false);
        }
    };

    // Initialize cart on mount and when auth state changes
    useEffect(() => {
        const initializeCart = async () => {
            if (isSignedIn && user) {
                // User is logged in - sync with Supabase
                await syncCartWithSupabase();
            } else {
                // User is not logged in - load from localStorage
                loadCartFromLocalStorage();
            }
            setIsInitialized(true);
        };

        initializeCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignedIn, user?.id]);

    // Save to localStorage when items change (only for non-logged-in users)
    useEffect(() => {
        if (isInitialized && !isSignedIn) {
            localStorage.setItem('cartItems', JSON.stringify(items));
        }
    }, [items, isSignedIn, isInitialized]);

    const addToCart = async (product: Omit<CartItem, 'quantity'>) => {
        // Optimistically update UI
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

        // If logged in, persist to Supabase
        if (isSignedIn && cartId) {
            try {
                await addCartItem(cartId, product.id, 1);
            } catch (error) {
                console.error('Error adding item to Supabase cart:', error);
                // Optionally: revert optimistic update on error
            }
        }
    };

    const removeFromCart = async (productId: string) => {
        // Optimistically update UI
        setItems((prevItems) => prevItems.filter((item) => item.id !== productId));

        // If logged in, remove from Supabase
        if (isSignedIn && cartId) {
            try {
                await removeCartItem(cartId, productId);
            } catch (error) {
                console.error('Error removing item from Supabase cart:', error);
                // Optionally: revert optimistic update on error
            }
        }
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

