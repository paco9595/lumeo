import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/createServerClient';
import { isAdmin } from '@/lib/roles';

export async function GET() {
    try {
        // Check if user is admin
        const userIsAdmin = await isAdmin();
        if (!userIsAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const supabase = await createClient();

        const { data: users, error } = await supabase
            .from('profiles')
            .select('id, email, first_name, last_name, role, is_admin, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
