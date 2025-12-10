import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/createServerClient';
import { hasPermission } from '@/lib/roles';

type ImageData = {
    id?: string;
    url: string;
    position: number;
};

export async function POST(request: NextRequest) {
    try {
        // Check if user has permission to manage products
        const canManage = await hasPermission('canManageProducts');
        if (!canManage) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { id, name, price, description, image_url, stock, category_id, images } = body;

        // Validation
        if (!name || !price) {
            return NextResponse.json(
                { error: 'Name and price are required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        let result;
        let productId = id;

        if (id) {
            // Update existing product
            const { data, error } = await supabase
                .from('products')
                .update({
                    name,
                    price: parseFloat(price),
                    description,
                    image_url: images && images.length > 0 ? images[0].url : image_url,
                    stock: stock ? parseInt(stock) : null,
                    category_id: category_id || null,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select()
                .single();

            result = { data, error };
        } else {
            // Create new product
            const { data, error } = await supabase
                .from('products')
                .insert({
                    name,
                    price: parseFloat(price),
                    description,
                    image_url: images && images.length > 0 ? images[0].url : image_url,
                    stock: stock ? parseInt(stock) : null,
                    category_id: category_id || null,
                })
                .select()
                .single();

            result = { data, error };
            if (data) {
                productId = data.id;
            }
        }

        if (result.error) {
            console.error('Error saving product:', result.error);
            return NextResponse.json(
                { error: result.error.message },
                { status: 500 }
            );
        }

        // Handle product images if provided
        if (images && Array.isArray(images) && productId) {
            // Delete existing images for this product
            await supabase
                .from('product_images')
                .delete()
                .eq('product_id', productId);

            // Insert new images
            if (images.length > 0) {
                const imagesToInsert = images.map((img: ImageData) => ({
                    product_id: productId,
                    image_url: img.url,
                    position: img.position,
                }));

                const { error: imagesError } = await supabase
                    .from('product_images')
                    .insert(imagesToInsert);

                if (imagesError) {
                    console.error('Error saving product images:', imagesError);
                    // Don't fail the whole operation, just log the error
                }
            }
        }

        return NextResponse.json({
            success: true,
            product: result.data
        });
    } catch (error) {
        console.error('Error in save product API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
