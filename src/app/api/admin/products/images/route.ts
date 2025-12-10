import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/createServerClient';

type ProductImage = {
    id: string;
    image_url: string;
    position: number | null;
};

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const searchParams = request.nextUrl.searchParams;
        const productId = searchParams.get('product_id');

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        // Fetch images for the product
        const { data: images, error } = await supabase
            .from('product_images')
            .select('id, image_url, position')
            .eq('product_id', productId)
            .order('position', { ascending: true });

        if (error) {
            console.error('Error fetching product images:', error);
            return NextResponse.json(
                { error: 'Failed to fetch product images' },
                { status: 500 }
            );
        }

        // Transform to match frontend format
        const transformedImages = (images as ProductImage[]).map((img: ProductImage) => ({
            id: img.id,
            url: img.image_url,
            position: img.position
        }));

        return NextResponse.json({ images: transformedImages });
    } catch (error) {
        console.error('Error in product images API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
