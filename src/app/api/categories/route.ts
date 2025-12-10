import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/createServerClient';

export async function GET() {
    try {
        const supabase = await createClient();

        const { data: categories, error } = await supabase
            .from('categories')
            .select('id, name, slug')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Error in categories API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
