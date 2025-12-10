import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/createServerClient';
import { hasPermission } from '@/lib/roles';

export async function GET() {
    try {
        // Check if user has permission to manage products
        const canManage = await hasPermission('canManageProducts');
        if (!canManage) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const supabase = await createClient();

        const { data: products, error } = await supabase
            .from('products')
            .select(`
                id,
                name,
                price,
                description,
                image_url,
                stock,
                category_id,
                created_at,
                updated_at,
                categories (
                    id,
                    name,
                    slug
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ products });
    } catch (error) {
        console.error('Error in products API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
