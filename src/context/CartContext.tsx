'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    getOrCreateCart,
    getCartItems,
    addCartItem,
    removeCartItem,
    updateCartItemQuantity,
    syncLocalCartToSupabase,
    createCart,
} from '@/lib/supabase/cartApi';
import { CartItem } from '@/types/cart';



interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    addToCart: (product: CartItem) => void;
    removeFromCart: (productId: string, variantId?: string | null) => void;
    updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void;
    toggleCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [cartId, setCartId] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    const { user } = useAuth();
    const isSignedIn = !!user;

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

    // Load existing cart from Supabase (for logged-in users) - don't create if doesn't exist
    const loadCartFromSupabase = async () => {
        if (!user?.id || isSyncing) return;

        setIsSyncing(true);
        try {
            // Try to get existing cart (don't create)
            const { data: cart, error: cartError } = await getOrCreateCart(user.id);

            if (cartError) {
                console.error('Error getting cart:', cartError);
                return;
            }

            // If cart exists, load it
            if (cart) {
                setCartId(cart.id);

                // Load cart items from Supabase
                const { data: cartItems, error: itemsError } = await getCartItems(cart.id);

                if (itemsError) {
                    console.error('Error loading cart items:', itemsError);
                    return;
                }

                setItems(cartItems || []);
            }

            // Check if there are local items to sync
            const localCart = localStorage.getItem('cartItems');
            if (localCart) {
                try {
                    const localItems: CartItem[] = JSON.parse(localCart);
                    if (localItems.length > 0) {
                        // If we have local items but no cart yet, just keep them in state
                        // They'll be synced when user adds first item
                        if (!cart) {
                            setItems(localItems);
                        } else {
                            // Sync local items to existing Supabase cart
                            await syncLocalCartToSupabase(user.id, localItems);
                            // Reload cart items after sync
                            const { data: updatedItems } = await getCartItems(cart.id);
                            setItems(updatedItems || []);
                        }
                        // Clear localStorage after handling
                        localStorage.removeItem('cartItems');
                    }
                } catch (error) {
                    console.error('Error syncing local cart:', error);
                }
            }
        } finally {
            setIsSyncing(false);
        }
    };

    // Initialize cart on mount and when auth state changes
    useEffect(() => {
        const initializeCart = async () => {
            if (isSignedIn && user) {
                // User is logged in - load existing cart (don't create)
                await loadCartFromSupabase();
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

    const addToCart = async (product: CartItem) => {
        // Optimistically update UI
        // Check stock if defined
        if (product.variant_stock !== undefined && product.quantity > (product.variant_stock || 0)) {
            alert(`Sorry, only ${product.variant_stock} items available in stock`);
            return;
        }

        setItems((prevItems) => {
            const existingItem = prevItems.find((item) =>
                item.id === product.id &&
                (item.variant_id || null) === (product.variant_id || null)
            );

            if (existingItem) {
                const newQuantity = existingItem.quantity + product.quantity;
                if (product.variant_stock !== undefined && newQuantity > (product.variant_stock || 0)) {
                    alert(`Sorry, only ${product.variant_stock} items available in stock`);
                    return prevItems;
                }
                return prevItems.map((item) =>
                    (item.id === product.id && (item.variant_id || null) === (product.variant_id || null))
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            }
            return [...prevItems, { ...product }];
        });
        setIsOpen(true);
        // If logged in, persist to Supabase
        if (isSignedIn && user) {
            try {
                // Create cart if it doesn't exist yet
                let cart = { id: cartId };
                if (!cartId) {
                    const { data: cartData, error: cartError } = await getOrCreateCart(user.id);
                    if (cartError) {
                        console.error('Error getting/creating cart:', cartError);
                        return;
                    }
                    cart = cartData;
                    if (!cart) {
                        const { data: newCart, error: createError } = await createCart(user.id);
                        if (createError || !newCart) {
                            console.error('Error creating cart:', createError);
                            return;
                        }
                        cart = newCart;
                    }
                    setCartId(cart.id || cartId);
                }

                await addCartItem(cart.id || '', product);
            } catch (error) {
                console.error('Error adding item to Supabase cart:', error);
                // Optionally: revert optimistic update on error
            }
        }
    };

    const removeFromCart = async (productId: string, variantId?: string | null) => {
        // Optimistically update UI
        setItems((prevItems) => prevItems.filter((item) =>
            !(item.id === productId && (item.variantId || null) === (variantId || null))
        ));

        // If logged in, remove from Supabase
        if (isSignedIn && cartId) {
            try {
                // We pass productId, but under the hood we need to handle variantId too. 
                // The current API might not support variantId deletion yet, we need to update it.
                // Assuming removeCartItem will be updated to take variantId.
                // For now, we pass keys if the API supports updates.
                await removeCartItem(cartId, productId, variantId);
            } catch (error) {
                console.error('Error removing item from Supabase cart:', error);
                // Optionally: revert optimistic update on error
            }
        }
    };

    const toggleCart = () => setIsOpen((prev) => !prev);

    const cartCount = items.length;
    const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    const updateQuantity = async (productId: string, quantity: number, variantId?: string | null) => {
        if (quantity < 1) return;

        const item = items.find((i) => i.id === productId && (i.variantId || null) === (variantId || null));
        if (item && item.stock !== undefined && quantity > item.stock) {
            alert(`Sorry, only ${item.stock} items available in stock`);
            return;
        }

        // Optimistically update UI
        setItems((prevItems) =>
            prevItems.map((item) =>
                (item.id === productId && (item.variantId || null) === (variantId || null))
                    ? { ...item, quantity }
                    : item
            )
        );

        // If logged in, update Supabase
        if (isSignedIn && cartId) {
            try {
                await updateCartItemQuantity(cartId, productId, quantity, variantId);
            } catch (error) {
                console.error('Error updating item quantity in Supabase cart:', error);
                // Optionally: revert optimistic update on error
            }
        }
    };

    return (
        <CartContext.Provider value={{ items, isOpen, addToCart, removeFromCart, updateQuantity, toggleCart, cartCount, cartTotal }}>
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


