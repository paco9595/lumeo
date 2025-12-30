'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProfileUser from './autentication/profileUser';

export default function AuthButtons() {
    const { user } = useAuth();
    const initials = user?.user_metadata.name?.split(' ').map((name: string) => name[0]).join('');
    if (user) {
        return (
            <div className="flex items-center gap-4">
                <ProfileUser name={initials} image={user.user_metadata.image} />
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
