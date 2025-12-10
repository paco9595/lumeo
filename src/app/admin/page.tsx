import { createClient } from '@/lib/supabase/createServerClient';
import { getUserPermissions } from '@/lib/roles';

async function getStats() {
    const supabase = await createClient();

    // Get total users
    const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    // Get total products
    const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    // Get total orders
    const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

    // Get total revenue
    const { data: orders } = await supabase
        .from('orders')
        .select('total');

    const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;

    return {
        users: usersCount || 0,
        products: productsCount || 0,
        orders: ordersCount || 0,
        revenue: totalRevenue,
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();
    const permissions = await getUserPermissions();

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">
                    Bienvenido al panel de administración
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users */}
                {permissions.canManageUsers && (
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Usuarios
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats.users}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                {/* Total Products */}
                {permissions.canManageProducts && (
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Productos
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats.products}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                {/* Total Orders */}
                {permissions.canManageOrders && (
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Pedidos
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats.orders}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                {/* Total Revenue */}
                {permissions.canViewAnalytics && (
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Ingresos Totales
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    ${stats.revenue.toLocaleString()}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-pink-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Acciones Rápidas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {permissions.canManageProducts && (
                        <a
                            href="/admin/products/new"
                            className="flex items-center gap-3 p-4 rounded-lg border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all group"
                        >
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <svg
                                    className="w-5 h-5 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </div>
                            <span className="font-medium text-gray-900">
                                Agregar Producto
                            </span>
                        </a>
                    )}

                    {permissions.canManageOrders && (
                        <a
                            href="/admin/orders"
                            className="flex items-center gap-3 p-4 rounded-lg border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all group"
                        >
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <svg
                                    className="w-5 h-5 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                            </div>
                            <span className="font-medium text-gray-900">
                                Ver Pedidos
                            </span>
                        </a>
                    )}

                    {permissions.canManageUsers && (
                        <a
                            href="/admin/users"
                            className="flex items-center gap-3 p-4 rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                        >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <svg
                                    className="w-5 h-5 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            </div>
                            <span className="font-medium text-gray-900">
                                Gestionar Usuarios
                            </span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
