import { NextRequest, NextResponse } from 'next/server';
import { updateUserRole } from '@/lib/roles';
import { UserRole } from '@/types/roles';

export async function POST(request: NextRequest) {
    try {
        const { userId, role } = await request.json();

        if (!userId || !role) {
            return NextResponse.json(
                { error: 'Missing userId or role' },
                { status: 400 }
            );
        }

        // Validate role
        if (!Object.values(UserRole).includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 400 }
            );
        }

        const { data, error } = await updateUserRole(userId, role);

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: error.message.includes('Unauthorized') ? 403 : 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
