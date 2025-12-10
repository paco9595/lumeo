import { ReactNode } from 'react';
import { getCurrentUserProfile } from '@/lib/roles';
import { redirect } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const { data: profile } = await getCurrentUserProfile();

    if (!profile) {
        redirect('/sign-in');
    }

    // Adapt profile type if necessary, or ensure AdminHeader accepts the profile object structure
    // profile from getCurrentUserProfile returns { first_name, last_name, etc }

    return (
        <div className="min-h-screen">
            {/* Admin Header with Mobile Menu */}
            <AdminHeader userProfile={profile} />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
