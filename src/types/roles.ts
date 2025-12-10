export enum UserRole {
    ADMIN = 'admin',
    SELLER = 'seller',
    CLIENT = 'client'
}

export type RolePermissions = {
    canAccessAdmin: boolean;
    canManageProducts: boolean;
    canManageOrders: boolean;
    canManageUsers: boolean;
    canViewAnalytics: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
    [UserRole.ADMIN]: {
        canAccessAdmin: true,
        canManageProducts: true,
        canManageOrders: true,
        canManageUsers: true,
        canViewAnalytics: true,
    },
    [UserRole.SELLER]: {
        canAccessAdmin: true,
        canManageProducts: true,
        canManageOrders: true,
        canManageUsers: false,
        canViewAnalytics: true,
    },
    [UserRole.CLIENT]: {
        canAccessAdmin: false,
        canManageProducts: false,
        canManageOrders: false,
        canManageUsers: false,
        canViewAnalytics: false,
    },
};
