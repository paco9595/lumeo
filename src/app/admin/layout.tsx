import { ReactNode } from 'react';
import Link from 'next/link';
import { getCurrentUserProfile } from '@/lib/roles';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const { data: profile } = await getCurrentUserProfile();

    if (!profile) {
        redirect('/sign-in');
    }

    return (
        <div className="min-h-screen">
            {/* Admin Header */}
            <header className="sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-8">
                            <Link href="/admin" className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Panel de Administración
                            </Link>
                            <nav className="hidden md:flex gap-6">
                                <Link href="/admin" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                                    Dashboard
                                </Link>
                                <Link href="/admin/users" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                                    Usuarios
                                </Link>
                                <Link href="/admin/products" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                                    Productos
                                </Link>
                                <Link href="/admin/orders" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                                    Pedidos
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 hidden sm:block">
                                {profile.first_name} {profile.last_name}
                            </span>
                            <Link
                                href="/"
                                className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                            >
                                Ver Tienda
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
