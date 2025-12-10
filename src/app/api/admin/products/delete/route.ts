import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/createServerClient';
import { hasPermission } from '@/lib/roles';

export async function DELETE(request: NextRequest) {
    try {
        // Check if user has permission to manage products
        const canManage = await hasPermission('canManageProducts');
        if (!canManage) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('id');

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Soft delete: just mark as deleted or actually delete
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);

        if (error) {
            console.error('Error deleting product:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in delete product API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
