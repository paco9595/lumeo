# Sistema de Roles y Permisos

Este documento describe el sistema de roles implementado en la aplicación de e-commerce.

## Roles Disponibles

### 1. **Admin (Administrador)**

- Acceso completo al panel de administración
- Puede gestionar usuarios y asignar roles
- Puede gestionar productos
- Puede gestionar pedidos
- Puede ver analíticas y reportes

### 2. **Seller (Vendedor)**

- Acceso al panel de administración
- Puede gestionar productos
- Puede gestionar pedidos
- Puede ver analíticas
- **NO** puede gestionar usuarios ni roles

### 3. **Client (Cliente)**

- Acceso estándar a la tienda
- Puede comprar productos
- Puede ver sus pedidos
- Puede gestionar su perfil
- **NO** tiene acceso al panel de administración

## Estructura de Archivos

```
src/
├── types/
│   └── roles.ts                    # Definiciones de roles y permisos
├── lib/
│   └── roles.ts                    # Funciones utilitarias de roles
├── middleware.ts                   # Protección de rutas basada en roles
├── app/
│   ├── admin/
│   │   ├── layout.tsx             # Layout del panel admin
│   │   ├── page.tsx               # Dashboard principal
│   │   └── users/
│   │       └── page.tsx           # Gestión de usuarios
│   ├── unauthorized/
│   │   └── page.tsx               # Página de acceso no autorizado
│   └── api/
│       └── admin/
│           └── users/
│               ├── route.ts       # API para listar usuarios
│               └── update-role/
│                   └── route.ts   # API para actualizar roles
└── migrations/
    └── add_user_roles.sql         # Script de migración SQL
```

## Configuración Inicial

### 1. Ejecutar Migración de Base de Datos

Ejecuta el script SQL en tu base de datos Supabase:

```sql
-- Ver archivo: migrations/add_user_roles.sql
```

Puedes ejecutarlo desde:

- El SQL Editor en el dashboard de Supabase
- O usando el CLI de Supabase: `supabase db push`

### 2. Asignar Primer Admin

Después de ejecutar la migración, asigna el rol de admin a tu usuario:

```sql
UPDATE profiles 
SET role = 'admin', is_admin = true 
WHERE email = 'tu-email@example.com';
```

## Uso del Sistema

### Verificar Rol del Usuario

```typescript
import { getUserRole, isAdmin, isSeller } from '@/lib/roles';

// Obtener el rol del usuario actual
const role = await getUserRole();

// Verificar si es admin
const userIsAdmin = await isAdmin();

// Verificar si es vendedor
const userIsSeller = await isSeller();
```

### Verificar Permisos

```typescript
import { getUserPermissions, hasPermission } from '@/lib/roles';

// Obtener todos los permisos
const permissions = await getUserPermissions();

// Verificar permiso específico
const canManageProducts = await hasPermission('canManageProducts');
```

### Actualizar Rol de Usuario (Solo Admin)

```typescript
import { updateUserRole } from '@/lib/roles';
import { UserRole } from '@/types/roles';

const result = await updateUserRole(userId, UserRole.SELLER);
```

### Proteger Componentes del Cliente

```typescript
import { getUserPermissions } from '@/lib/roles';

export default async function MyComponent() {
    const permissions = await getUserPermissions();
    
    return (
        <div>
            {permissions.canManageProducts && (
                <button>Agregar Producto</button>
            )}
        </div>
    );
}
```

### Proteger Rutas API

```typescript
import { isAdmin } from '@/lib/roles';

export async function POST(request: Request) {
    const userIsAdmin = await isAdmin();
    
    if (!userIsAdmin) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 403 }
        );
    }
    
    // Continuar con la lógica...
}
```

## Rutas Protegidas

El middleware protege automáticamente las siguientes rutas:

- `/admin/*` - Solo accesible para usuarios con rol **Admin**
- `/seller/*` - Accesible para usuarios con rol **Seller** o **Admin**

Si un usuario intenta acceder a una ruta sin los permisos necesarios:

1. Si no está autenticado → Redirige a `/sign-in`
2. Si no tiene permisos → Redirige a `/unauthorized`

## Permisos por Rol

| Permiso | Admin | Seller | Client |
|---------|-------|--------|--------|
| canAccessAdmin | ✅ | ✅ | ❌ |
| canManageProducts | ✅ | ✅ | ❌ |
| canManageOrders | ✅ | ✅ | ❌ |
| canManageUsers | ✅ | ❌ | ❌ |
| canViewAnalytics | ✅ | ✅ | ❌ |

## Panel de Administración

### Acceso

- URL: `/admin`
- Requiere rol: **Admin**

### Funcionalidades

1. **Dashboard** (`/admin`)
   - Estadísticas generales
   - Acciones rápidas
   - Métricas de negocio

2. **Gestión de Usuarios** (`/admin/users`)
   - Lista de todos los usuarios
   - Cambiar roles de usuarios
   - Ver información de usuarios

3. **Gestión de Productos** (`/admin/products`)
   - Crear, editar, eliminar productos
   - Gestionar inventario

4. **Gestión de Pedidos** (`/admin/orders`)
   - Ver todos los pedidos
   - Actualizar estados de pedidos

## Seguridad

- ✅ Middleware protege rutas automáticamente
- ✅ APIs verifican roles antes de ejecutar acciones
- ✅ Componentes del cliente verifican permisos
- ✅ Base de datos tiene Row Level Security (RLS)
- ✅ Solo admins pueden cambiar roles

## Próximos Pasos

1. Ejecutar la migración SQL
2. Asignar rol de admin a tu usuario
3. Acceder a `/admin` para gestionar usuarios
4. Asignar roles según sea necesario

## Soporte

Si tienes problemas con el sistema de roles, verifica:

1. ✅ La migración SQL se ejecutó correctamente
2. ✅ Tu usuario tiene el rol correcto en la tabla `profiles`
3. ✅ Estás autenticado correctamente
4. ✅ Las políticas RLS de Supabase permiten las operaciones
