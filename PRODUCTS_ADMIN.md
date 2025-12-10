# 🛍️ Panel de Administración de Productos - Documentación

## ✅ Implementación Completada

Se ha creado un **panel completo de administración de productos** con todas las funcionalidades CRUD (Crear, Leer, Actualizar, Eliminar).

---

## 📁 Estructura de Archivos Creados

```
src/
├── app/
│   ├── admin/
│   │   └── products/
│   │       ├── page.tsx                    # Lista de productos
│   │       ├── new/
│   │       │   └── page.tsx               # Crear producto
│   │       └── edit/
│   │           └── [id]/
│   │               └── page.tsx           # Editar producto
│   └── api/
│       ├── admin/
│       │   └── products/
│       │       ├── route.ts               # GET productos
│       │       ├── save/
│       │       │   └── route.ts          # POST crear/actualizar
│       │       └── delete/
│       │           └── route.ts          # DELETE eliminar
│       └── categories/
│           └── route.ts                   # GET categorías
```

---

## 🎯 Funcionalidades Implementadas

### 1. **Lista de Productos** (`/admin/products`)

#### Características

- ✅ Tabla completa con todos los productos de Supabase
- ✅ Búsqueda en tiempo real por nombre y descripción
- ✅ Estadísticas visuales:
  - Total de productos
  - Productos en stock
  - Productos sin stock
- ✅ Vista de imagen miniatura
- ✅ Información de categoría
- ✅ Indicador de stock con colores:
  - 🟢 Verde: >10 unidades
  - 🟡 Amarillo: 1-10 unidades
  - 🔴 Rojo: Sin stock
- ✅ Acciones rápidas (Editar/Eliminar)
- ✅ Estado vacío con mensaje amigable
- ✅ Responsive design

#### Permisos

- Requiere permiso `canManageProducts`
- Accesible para roles: **Admin** y **Seller**

---

### 2. **Crear Producto** (`/admin/products/new`)

#### Características

- ✅ Formulario completo con validación
- ✅ Campos disponibles:
  - Nombre (requerido)
  - Precio (requerido)
  - Categoría (opcional)
  - Stock (opcional)
  - URL de imagen (opcional)
  - Descripción (opcional)
- ✅ Vista previa de imagen en tiempo real
- ✅ Validación de campos requeridos
- ✅ Selector de categorías desde Supabase
- ✅ Manejo de errores
- ✅ Botón de cancelar

#### Validaciones

- Nombre y precio son obligatorios
- Precio debe ser numérico y positivo
- Stock debe ser numérico y no negativo
- URL de imagen debe ser válida

---

### 3. **Editar Producto** (`/admin/products/edit/[id]`)

#### Características

- ✅ Carga automática de datos existentes
- ✅ Mismo formulario que crear producto
- ✅ Actualización en tiempo real
- ✅ Vista previa de imagen
- ✅ Preserva datos no modificados

---

### 4. **Eliminar Producto**

#### Características

- ✅ Confirmación antes de eliminar
- ✅ Eliminación directa de la base de datos
- ✅ Actualización automática de la lista
- ✅ Feedback visual durante la eliminación

---

## 🔌 APIs Creadas

### 1. `GET /api/admin/products`

**Descripción:** Obtiene todos los productos con información de categoría

**Respuesta:**

```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Producto",
      "price": 99.99,
      "description": "Descripción",
      "image_url": "https://...",
      "stock": 50,
      "category_id": 1,
      "created_at": "2024-...",
      "updated_at": "2024-...",
      "categories": {
        "id": 1,
        "name": "Categoría",
        "slug": "categoria"
      }
    }
  ]
}
```

**Permisos:** Requiere `canManageProducts`

---

### 2. `POST /api/admin/products/save`

**Descripción:** Crea o actualiza un producto

**Body:**

```json
{
  "id": "uuid",              // Opcional, si existe actualiza
  "name": "Producto",        // Requerido
  "price": 99.99,           // Requerido
  "description": "...",     // Opcional
  "image_url": "https://...", // Opcional
  "stock": 50,              // Opcional
  "category_id": 1          // Opcional
}
```

**Respuesta:**

```json
{
  "success": true,
  "product": { ... }
}
```

**Permisos:** Requiere `canManageProducts`

---

### 3. `DELETE /api/admin/products/delete?id={productId}`

**Descripción:** Elimina un producto

**Query Params:**

- `id`: ID del producto a eliminar

**Respuesta:**

```json
{
  "success": true
}
```

**Permisos:** Requiere `canManageProducts`

---

### 4. `GET /api/categories`

**Descripción:** Obtiene todas las categorías (pública)

**Respuesta:**

```json
{
  "categories": [
    {
      "id": 1,
      "name": "Categoría",
      "slug": "categoria"
    }
  ]
}
```

**Permisos:** Pública (sin restricciones)

---

## 🎨 Diseño y UX

### Características Visuales

- ✅ Diseño moderno con gradientes purple-pink
- ✅ Tarjetas con sombras y bordes suaves
- ✅ Iconos SVG personalizados
- ✅ Estados de carga con spinners
- ✅ Feedback visual en todas las acciones
- ✅ Colores semánticos:
  - Púrpura/Rosa: Acciones principales
  - Verde: Stock disponible
  - Amarillo: Stock bajo
  - Rojo: Sin stock / Eliminar
  - Azul: Categorías

### Responsive

- ✅ Móvil: Diseño en columna
- ✅ Tablet: Grid de 2 columnas
- ✅ Desktop: Grid de 3-4 columnas
- ✅ Tabla con scroll horizontal en móvil

---

## 🔐 Seguridad

### Protección de Rutas

- ✅ Middleware verifica rol antes de acceder
- ✅ APIs validan permisos en cada request
- ✅ Solo Admin y Seller pueden gestionar productos

### Validación de Datos

- ✅ Validación en frontend (HTML5)
- ✅ Validación en backend (API)
- ✅ Sanitización de inputs
- ✅ Manejo de errores

---

## 📊 Integración con Supabase

### Tablas Utilizadas

1. **products**
   - id (uuid)
   - name (text)
   - price (numeric)
   - description (text)
   - image_url (text)
   - stock (integer)
   - category_id (integer)
   - created_at (timestamp)
   - updated_at (timestamp)

2. **categories**
   - id (integer)
   - name (text)
   - slug (text)

### Relaciones

- `products.category_id` → `categories.id`

---

## 🚀 Cómo Usar

### 1. Acceder al Panel

```
https://tu-dominio.com/admin/products
```

### 2. Crear un Producto

1. Click en "Nuevo Producto"
2. Llenar el formulario
3. Click en "Crear Producto"

### 3. Editar un Producto

1. En la lista, click en "Editar"
2. Modificar los campos deseados
3. Click en "Guardar Cambios"

### 4. Eliminar un Producto

1. En la lista, click en "Eliminar"
2. Confirmar la acción

### 5. Buscar Productos

1. Usar la barra de búsqueda
2. Escribe nombre o descripción
3. Resultados en tiempo real

---

## 📝 Próximas Mejoras Sugeridas

### Funcionalidades Pendientes

- [ ] Carga de múltiples imágenes
- [ ] Sistema de variantes (tallas, colores)
- [ ] Gestión de stock por variante
- [ ] Sistema de SKU único
- [ ] Importación masiva (CSV/Excel)
- [ ] Exportación de productos
- [ ] Duplicar producto
- [ ] Historial de cambios
- [ ] Productos destacados
- [ ] Ordenamiento personalizado

### Mejoras de UX

- [ ] Drag & drop para imágenes
- [ ] Editor WYSIWYG para descripción
- [ ] Vista previa del producto
- [ ] Filtros avanzados en la lista
- [ ] Paginación
- [ ] Acciones masivas (eliminar múltiples)

---

## 🐛 Solución de Problemas

### No veo productos

1. Verifica que tienes productos en Supabase
2. Revisa la consola del navegador
3. Verifica permisos de la tabla en Supabase

### No puedo crear productos

1. Verifica que tienes rol Admin o Seller
2. Revisa que todos los campos requeridos estén llenos
3. Verifica la conexión con Supabase

### Las imágenes no se muestran

1. Verifica que la URL sea válida
2. Verifica que la imagen sea accesible públicamente
3. Revisa CORS si es necesario

---

## 📚 Recursos Relacionados

- **Sistema de Roles:** `ROLES_SYSTEM.md`
- **Setup de Roles:** `SETUP_ROLES.md`
- **TODO General:** `ECOMMERCE_TODO.md`

---

## ✅ Checklist de Implementación

- [x] API para listar productos
- [x] API para crear productos
- [x] API para actualizar productos
- [x] API para eliminar productos
- [x] API para listar categorías
- [x] Página de lista de productos
- [x] Página de crear producto
- [x] Página de editar producto
- [x] Búsqueda de productos
- [x] Estadísticas visuales
- [x] Validación de formularios
- [x] Manejo de errores
- [x] Protección por roles
- [x] Diseño responsive
- [x] Feedback visual

---

**Última actualización:** 2025-12-07
