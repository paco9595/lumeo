'use server';

import { createClient } from './supabase/createServerClient';
import { UserRole, ROLE_PERMISSIONS, type RolePermissions } from '@/types/roles';

/**
 * Get the current user's profile including role information
 */
export async function getCurrentUserProfile() {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { data: null, error: userError };
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, is_admin, role, image_url')
        .eq('id', user.id)
        .single();

    if (profileError) {
        return { data: null, error: profileError };
    }

    return { data: profile, error: null };
}

/**
 * Get user role from profile
 */
export async function getUserRole(userId?: string): Promise<UserRole> {
    const supabase = await createClient();

    let targetUserId = userId;

    if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return UserRole.CLIENT;
        targetUserId = user.id;
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_admin')
        .eq('id', targetUserId)
        .single();

    if (!profile) return UserRole.CLIENT;

    // Backward compatibility: if role field doesn't exist but is_admin is true
    if (profile.is_admin && !profile.role) {
        return UserRole.ADMIN;
    }

    return (profile.role as UserRole) || UserRole.CLIENT;
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: UserRole, userId?: string): Promise<boolean> {
    const userRole = await getUserRole(userId);
    return userRole === role;
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId?: string): Promise<boolean> {
    return hasRole(UserRole.ADMIN, userId);
}

/**
 * Check if user is seller
 */
export async function isSeller(userId?: string): Promise<boolean> {
    return hasRole(UserRole.SELLER, userId);
}

/**
 * Get user permissions based on role
 */
export async function getUserPermissions(userId?: string): Promise<RolePermissions> {
    const role = await getUserRole(userId);
    return ROLE_PERMISSIONS[role];
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(
    permission: keyof RolePermissions,
    userId?: string
): Promise<boolean> {
    const permissions = await getUserPermissions(userId);
    return permissions[permission];
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(targetUserId: string, newRole: UserRole) {
    const supabase = await createClient();

    // Check if current user is admin
    const isCurrentUserAdmin = await isAdmin();
    if (!isCurrentUserAdmin) {
        return { data: null, error: new Error('Unauthorized: Only admins can update roles') };
    }

    const { data, error } = await supabase
        .from('profiles')
        .update({
            role: newRole,
            is_admin: newRole === UserRole.ADMIN
        })
        .eq('id', targetUserId)
        .select()
        .single();

    return { data, error };
}
