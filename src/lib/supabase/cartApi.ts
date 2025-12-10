'use server';

import type { CartItem } from '@/context/CartContext';
import { createClient } from './createServerClient';



/**
 * Get or create a cart for the user
 */
export async function getOrCreateCart(userId: string) {
    const supabase = await createClient();
    // First, try to get existing cart
    console.log('userId', userId);
    const { data: existingCart, error } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userId)

    console.log('existingCart', existingCart);
    console.log('error', error);
    if (existingCart) {
        return { data: existingCart[0], error: null };
    }
    return { data: null, error };
}

/**
 * Create a new cart for the user
 */
export async function createCart(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('carts')
        .insert({ user_id: userId })
        .select('id')
        .single();
    console.log('data', data);
    console.log('error', error);
    if (error) {
        console.error('Error creating cart:', error);
        return { data: null, error };
    }
    return { data, error: null };
}
/**
 * Get all items in a cart with product details
 */
export async function getCartItems(cartId: string) {
    const supabase = await createClient(true);
    const { data, error } = await supabase.from('cart_items')
        .select(`
            id,
            quantity,
            product_id,
            variant_id,
            products (
                id,
                name,
                price,
                image_url,
                stock
            ),
            product_variants (
                id,
                price,
                stock,
                image_url
            )
        `)
        .eq('cart_id', cartId);
    console.log('data', data);
    console.log('error', error);
    if (error) {
        console.error('Error fetching cart items:', error);
        return { data: null, error };
    }

    // Transform to CartItem format
    const cartItems: CartItem[] = data
        .filter(item => item.products !== null) // Filter out items with missing products
        .map((item) => {
            const variant = item.product_variants;
            const product = item.products!;

            // Check if variant object is empty or null (it can be an array if relationship is one-to-many, but here it's likely single or null)
            // The type definition says referencedRelation: "product_variants" isOneToOne: false, so it might be returned as an array or object depending on query.
            // But since product_variants.id is PK, cart_items.variant_id is FK, it's Many-to-One from cart_items to product_variants.
            // So getting `product_variants` should return a single object or null.
            const variantData = Array.isArray(variant) ? variant[0] : variant;

            return {
                id: product.id.toString(),
                name: product.name,
                // If variant has specific price/image, use it, otherwise fallback to product
                price: variantData?.price ?? product.price,
                image: variantData?.image_url ?? product.image_url ?? '/placeholder.jpg',
                quantity: item.quantity,
                stock: variantData?.stock ?? product.stock ?? 0,
                variantId: item.variant_id,
                variantName: item.variant_id ? 'Variant' : undefined
            };
        });

    return { data: cartItems, error: null };
}

/**
 * Add or update an item in the cart
 */
export async function addCartItem(cartId: string, { id, quantity, variantId }: CartItem) {
    const supabase = await createClient(true);

    // Check if item already exists
    let query = supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cartId)
        .eq('product_id', id);

    if (variantId) {
        query = query.eq('variant_id', variantId);
    } else {
        query = query.is('variant_id', null);
    }

    const { data: existingItem, error: existingItemError } = await query;

    if (existingItemError) {
        console.error('Error fetching existing item:', existingItemError);
        return { error: existingItemError };
    }

    if (existingItem && existingItem.length > 0) {
        // Update quantity
        const { error } = await supabase
            .from('cart_items')
            .update({ quantity: existingItem[0].quantity + quantity })
            .eq('id', existingItem[0].id);

        return { error };
    }

    // Insert new item
    const { error } = await supabase
        .from('cart_items')
        .insert({
            cart_id: cartId,
            product_id: id,
            quantity,
            variant_id: variantId || null
        });

    return { error };
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(cartId: string, productId: string, quantity: number, variantId?: string | null) {
    const supabase = await createClient(true);

    let query = supabase
        .from('cart_items')
        .update({ quantity })
        .eq('cart_id', cartId)
        .eq('product_id', productId);

    if (variantId) {
        query = query.eq('variant_id', variantId);
    } else {
        query = query.is('variant_id', null);
    }

    const { error } = await query;

    return { error };
}

/**
 * Remove an item from the cart
 */
export async function removeCartItem(cartId: string, productId: string, variantId?: string | null) {
    const supabase = await createClient(true);
    let removeCart = null;

    let query = supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId)
        .eq('product_id', productId);

    if (variantId) {
        query = query.eq('variant_id', variantId);
    } else {
        query = query.is('variant_id', null);
    }

    const { error } = await query;


    // Check if cart is empty
    const { data: remainingItems } = await supabase
        .from('cart_items')
        .select('id')
        .eq('cart_id', cartId);

    if (remainingItems?.length === 0) {
        const { error: removeCartError } = await supabase
            .from('carts')
            .delete()
            .eq('id', cartId);
        removeCart = removeCartError;
    }
    return { error: error || removeCart };
}

/**
 * Sync local cart items to Supabase
 */
export async function syncLocalCartToSupabase(userId: string, localItems: CartItem[]) {
    // Get or create cart
    const { data: cart, error: cartError } = await getOrCreateCart(userId);
    console.log('cart', cart);
    console.log('cartError', cartError);
    if (cartError || !cart) {
        console.error('Error getting/creating cart:', cartError);
        return { error: cartError };
    }

    // Add each local item to Supabase
    for (const item of localItems) {
        await addCartItem(cart.id, item);
    }

    return { error: null };
}

/**
 * Clear all items from a cart
 */
export async function clearCart(cartId: string) {
    const supabase = await createClient(true);
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId);

    return { error };
}
