# 🚀 Guía Rápida de Configuración del Sistema de Roles

## Paso 1: Ejecutar la Migración SQL

1. Abre tu proyecto en Supabase: <https://app.supabase.com>
2. Ve a **SQL Editor** en el menú lateral
3. Crea una nueva query
4. Copia y pega el contenido del archivo `migrations/add_user_roles.sql`
5. Ejecuta la query

## Paso 2: Asignar tu Primer Admin

Después de ejecutar la migración, asigna el rol de admin a tu usuario:

```sql
-- Reemplaza 'tu-email@example.com' con tu email real
UPDATE profiles 
SET role = 'admin', is_admin = true 
WHERE email = 'tu-email@example.com';
```

## Paso 3: Verificar la Instalación

1. Inicia sesión en tu aplicación
2. Navega a `/admin`
3. Deberías ver el panel de administración

## Paso 4: Gestionar Usuarios

1. Ve a `/admin/users`
2. Verás una lista de todos los usuarios
3. Puedes cambiar el rol de cualquier usuario usando el dropdown

## Roles Disponibles

- **Admin**: Acceso completo
- **Seller**: Puede gestionar productos y pedidos
- **Client**: Usuario estándar (sin acceso al panel)

## Rutas Protegidas

- `/admin/*` - Solo Admin
- `/seller/*` - Seller y Admin
- Todas las demás rutas - Todos los usuarios

## Documentación Completa

Para más detalles, consulta `ROLES_SYSTEM.md`

## Solución de Problemas

### No puedo acceder a /admin

1. Verifica que ejecutaste la migración SQL
2. Verifica que tu usuario tiene `role = 'admin'` en la tabla `profiles`
3. Cierra sesión y vuelve a iniciar sesión

### Los cambios de rol no se reflejan

1. Cierra sesión
2. Vuelve a iniciar sesión
3. El middleware verificará el rol actualizado

## Próximos Pasos

1. ✅ Ejecutar migración SQL
2. ✅ Asignar primer admin
3. ✅ Probar acceso a `/admin`
4. ✅ Asignar roles a otros usuarios
5. 🔜 Personalizar permisos según necesites
