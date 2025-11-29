import { CartItemWithProduct } from '@/types/Product';
import { createBrowserClient } from './createBrowserClient';
import type { CartItem } from '@/context/CartContext';

const supabase = createBrowserClient();

/**
 * Get or create a cart for the user
 */
export async function getOrCreateCart(userId: string) {
    // First, try to get existing cart
    const { data: existingCart, error } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userId)
        .single();

    console.log('existingCart', existingCart);
    console.log('error', error);
    if (existingCart) {
        return { data: existingCart, error: null };
    }

    // If no cart exists, create one
    const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({ user_id: userId })
        .select('id')
        .single();

    return { data: newCart, error: createError };
}

/**
 * Get all items in a cart with product details
 */
export async function getCartItems(cartId: number) {
    const { data, error } = await supabase.from('cart_items')
        .select(`
            id,
            quantity,
            product_id,
            products (
                id,
                name,
                price,
                image_url
            )
        `)
        .eq('cart_id', cartId);

    if (error) {
        console.error('Error fetching cart items:', error);
        return { data: null, error };
    }

    // Transform to CartItem format
    const cartItems: CartItem[] = data
        .filter(item => item.products !== null) // Filter out items with missing products
        .map((item) => ({
            id: item.products!.id.toString(),
            name: item.products!.name,
            price: item.products!.price,
            image: item.products!.image_url || '/placeholder.jpg',
            quantity: item.quantity,
        }));

    return { data: cartItems, error: null };
}

/**
 * Add or update an item in the cart
 */
export async function addCartItem(cartId: number, productId: string, quantity: number = 1) {
    // Check if item already exists
    const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cartId)
        .eq('product_id', parseInt(productId))
        .single();

    if (existingItem) {
        // Update quantity
        const { error } = await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + quantity })
            .eq('id', existingItem.id);

        return { error };
    }

    // Insert new item
    const { error } = await supabase
        .from('cart_items')
        .insert({
            cart_id: cartId,
            product_id: parseInt(productId),
            quantity,
        });

    return { error };
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(cartId: number, productId: string, quantity: number) {
    const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('cart_id', cartId)
        .eq('product_id', parseInt(productId));

    return { error };
}

/**
 * Remove an item from the cart
 */
export async function removeCartItem(cartId: number, productId: string) {
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId)
        .eq('product_id', parseInt(productId));

    return { error };
}

/**
 * Sync local cart items to Supabase
 */
export async function syncLocalCartToSupabase(userId: string, localItems: CartItem[]) {
    // Get or create cart
    const { data: cart, error: cartError } = await getOrCreateCart(userId);

    if (cartError || !cart) {
        console.error('Error getting/creating cart:', cartError);
        return { error: cartError };
    }

    // Add each local item to Supabase
    for (const item of localItems) {
        await addCartItem(cart.id, item.id, item.quantity);
    }

    return { error: null };
}

/**
 * Clear all items from a cart
 */
export async function clearCart(cartId: number) {
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId);

    return { error };
}
