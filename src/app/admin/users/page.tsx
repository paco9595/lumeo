'use client';

import { useState, useEffect } from 'react';
import { UserRole } from '@/types/roles';

type User = {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    role: UserRole | null;
    is_admin: boolean | null;
    created_at: string | null;
};

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const response = await fetch('/api/admin/users');
            const data = await response.json();
            setUsers(data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }

    async function updateUserRole(userId: string, newRole: UserRole) {
        setUpdatingUserId(userId);
        try {
            const response = await fetch('/api/admin/users/update-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole }),
            });

            if (response.ok) {
                // Update local state
                setUsers(users.map(user =>
                    user.id === userId
                        ? { ...user, role: newRole, is_admin: newRole === UserRole.ADMIN }
                        : user
                ));
            } else {
                alert('Error al actualizar el rol del usuario');
            }
        } catch (error) {
            console.error('Error updating user role:', error);
            alert('Error al actualizar el rol del usuario');
        } finally {
            setUpdatingUserId(null);
        }
    }

    const getRoleBadgeColor = (role: UserRole | null) => {
        switch (role) {
            case UserRole.ADMIN:
                return 'bg-red-100 text-red-800 border-red-200';
            case UserRole.SELLER:
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case UserRole.CLIENT:
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getRoleLabel = (role: UserRole | null, isAdmin: boolean | null) => {
        if (isAdmin && !role) return 'Admin (Legacy)';
        return role || 'Cliente';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Gestión de Usuarios
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Administra los roles y permisos de los usuarios
                    </p>
                </div>
                <div className="text-sm text-gray-600">
                    Total: {users.length} usuarios
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Rol Actual
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Cambiar Rol
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Fecha de Registro
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                                                {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.first_name} {user.last_name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}>
                                            {getRoleLabel(user.role, user.is_admin)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={user.role || UserRole.CLIENT}
                                            onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                                            disabled={updatingUserId === user.id}
                                            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value={UserRole.CLIENT}>Cliente</option>
                                            <option value={UserRole.SELLER}>Vendedor</option>
                                            <option value={UserRole.ADMIN}>Administrador</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.created_at
                                            ? new Date(user.created_at).toLocaleDateString('es-ES')
                                            : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Role Descriptions */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Descripción de Roles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <h3 className="font-semibold text-red-900 mb-2">Administrador</h3>
                        <ul className="text-sm text-red-800 space-y-1">
                            <li>• Acceso completo al panel</li>
                            <li>• Gestionar usuarios y roles</li>
                            <li>• Gestionar productos</li>
                            <li>• Ver analíticas</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-blue-900 mb-2">Vendedor</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Gestionar productos</li>
                            <li>• Gestionar pedidos</li>
                            <li>• Ver analíticas</li>
                            <li>• Sin acceso a usuarios</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h3 className="font-semibold text-green-900 mb-2">Cliente</h3>
                        <ul className="text-sm text-green-800 space-y-1">
                            <li>• Comprar productos</li>
                            <li>• Ver sus pedidos</li>
                            <li>• Gestionar perfil</li>
                            <li>• Sin acceso al panel</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
