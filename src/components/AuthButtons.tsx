'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProfileUser from './autentication/profileUser';

export default function AuthButtons() {
    const { user } = useAuth();

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <ProfileUser />
            </div>
        );
    }

    return (
        <Link
            href="/sign-in"
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
        >
            Sign In
        </Link>
    );
}
