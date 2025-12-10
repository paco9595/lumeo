# 📸 Sistema de Carga Múltiple de Imágenes de Productos

## Descripción General

Se ha implementado un sistema completo de gestión de múltiples imágenes para productos en el panel de administración. Esta funcionalidad permite a los administradores agregar, ordenar y eliminar múltiples imágenes para cada producto.

---

## 🎯 Características Implementadas

### 1. **Componente MultipleImageUpload**

Un componente reutilizable que proporciona:

- ✅ **Agregar imágenes por URL**: Campo de entrada para agregar nuevas imágenes
- ✅ **Vista previa en tiempo real**: Visualización inmediata de las imágenes agregadas
- ✅ **Drag & Drop para reordenar**: Arrastra las imágenes para cambiar su orden
- ✅ **Eliminación individual**: Botón para eliminar imágenes específicas
- ✅ **Indicador de imagen principal**: Badge verde en la primera imagen
- ✅ **Numeración de posición**: Cada imagen muestra su posición en el orden
- ✅ **Estado vacío**: Mensaje informativo cuando no hay imágenes
- ✅ **Manejo de errores**: Placeholder cuando una imagen no carga

### 2. **Integración en Formularios**

#### Formulario de Nuevo Producto (`/admin/products/new`)

- Reemplaza el campo de URL de imagen única
- Permite agregar múltiples imágenes desde el inicio
- La primera imagen se establece automáticamente como `image_url` principal del producto

#### Formulario de Edición de Producto (`/admin/products/edit/[id]`)

- Carga automáticamente las imágenes existentes del producto
- Permite agregar, eliminar y reordenar imágenes
- Actualiza las imágenes al guardar los cambios

### 3. **API Routes**

#### `GET /api/admin/products/images`

**Propósito**: Obtener todas las imágenes de un producto específico

**Parámetros**:

- `product_id` (query string): ID del producto

**Respuesta**:

```json
{
  "images": [
    {
      "id": "uuid",
      "url": "https://...",
      "position": 0
    }
  ]
}
```

#### `POST /api/admin/products/save` (Actualizado)

**Propósito**: Guardar o actualizar un producto con sus imágenes

**Body adicional**:

```json
{
  "images": [
    {
      "id": "uuid",  // opcional, solo en edición
      "url": "https://...",
      "position": 0
    }
  ]
}
```

**Comportamiento**:

1. Guarda/actualiza el producto
2. Establece la primera imagen como `image_url` principal
3. Elimina todas las imágenes existentes del producto
4. Inserta las nuevas imágenes con sus posiciones

---

## 🗄️ Estructura de Base de Datos

### Tabla `product_images`

```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  position INTEGER
);
```

**Campos**:

- `id`: Identificador único de la imagen
- `product_id`: Referencia al producto (con eliminación en cascada)
- `image_url`: URL de la imagen
- `position`: Orden de la imagen (0 = principal)

---

## 💻 Uso del Componente

### Importación

```typescript
import MultipleImageUpload from '@/components/admin/MultipleImageUpload';
```

### Ejemplo de Uso

```typescript
import { useState } from 'react';

type ImageData = {
    id?: string;
    url: string;
    position: number;
};

function MyForm() {
    const [images, setImages] = useState<ImageData[]>([]);

    return (
        <MultipleImageUpload
            images={images}
            onChange={setImages}
        />
    );
}
```

### Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `images` | `ImageData[]` | Array de imágenes a mostrar |
| `onChange` | `(images: ImageData[]) => void` | Callback cuando cambian las imágenes |

---

## 🎨 Interfaz de Usuario

### Características Visuales

1. **Grid Responsivo**
   - 2 columnas en móvil
   - 3 columnas en tablet
   - 4 columnas en desktop

2. **Badges Informativos**
   - Badge morado con número de posición
   - Badge verde "Principal" en la primera imagen

3. **Interacciones**
   - Hover effect en imágenes
   - Botón de eliminar aparece al hacer hover
   - Cursor de arrastre para reordenar
   - Feedback visual durante el drag

4. **Estados**
   - Loading state durante operaciones
   - Estado vacío con icono y mensaje
   - Error state para imágenes que no cargan

---

## 🔄 Flujo de Trabajo

### Crear Nuevo Producto con Imágenes

1. Usuario navega a `/admin/products/new`
2. Completa información del producto
3. Agrega URLs de imágenes usando el componente
4. Arrastra para ordenar si es necesario
5. Al guardar:
   - Se crea el producto
   - La primera imagen se establece como `image_url`
   - Todas las imágenes se guardan en `product_images`

### Editar Producto Existente

1. Usuario navega a `/admin/products/edit/[id]`
2. El sistema carga:
   - Datos del producto
   - Imágenes existentes desde `product_images`
3. Usuario puede:
   - Agregar nuevas imágenes
   - Eliminar imágenes existentes
   - Reordenar arrastrando
4. Al guardar:
   - Se actualiza el producto
   - Se eliminan todas las imágenes antiguas
   - Se insertan las nuevas imágenes con posiciones actualizadas

---

## 🔒 Seguridad y Permisos

- ✅ Requiere permiso `canManageProducts`
- ✅ Validación de datos en el servidor
- ✅ Protección contra inyección SQL (usando Supabase)
- ✅ Validación de URLs en el cliente

---

## 📝 Notas Técnicas

### Gestión de Estado

- Las imágenes se mantienen en estado local del componente
- Se sincronizan con el servidor solo al guardar el producto
- El reordenamiento actualiza las posiciones automáticamente

### Optimizaciones

- Las imágenes se cargan de forma lazy
- Placeholder inmediato para errores de carga
- Operaciones de base de datos en transacción implícita

### Limitaciones Actuales

- ⚠️ Solo soporta URLs de imágenes (no carga de archivos)
- ⚠️ No hay límite en el número de imágenes
- ⚠️ No hay validación de tamaño/formato de imagen

---

## 🚀 Mejoras Futuras Sugeridas

1. **Carga de Archivos**
   - Integrar con Supabase Storage
   - Permitir drag & drop de archivos
   - Compresión automática de imágenes

2. **Validaciones**
   - Límite máximo de imágenes por producto
   - Validación de formato y tamaño
   - Verificación de URLs antes de guardar

3. **Optimizaciones**
   - Lazy loading de imágenes en el grid
   - Thumbnails optimizados
   - CDN para imágenes

4. **UX Mejorada**
   - Crop/edición básica de imágenes
   - Zoom en vista previa
   - Galería lightbox

---

## 📚 Archivos Relacionados

### Componentes

- `src/components/admin/MultipleImageUpload.tsx` - Componente principal

### Páginas

- `src/app/admin/products/new/page.tsx` - Formulario de nuevo producto
- `src/app/admin/products/edit/[id]/page.tsx` - Formulario de edición

### API Routes

- `src/app/api/admin/products/save/route.ts` - Guardar producto con imágenes
- `src/app/api/admin/products/images/route.ts` - Obtener imágenes de producto

### Tipos

- `src/lib/database.types.ts` - Tipos de base de datos (incluye `product_images`)

---

## ✅ Testing

### Casos de Prueba Sugeridos

1. **Agregar Imágenes**
   - [ ] Agregar una imagen válida
   - [ ] Agregar múltiples imágenes
   - [ ] Intentar agregar URL vacía
   - [ ] Agregar URL inválida

2. **Reordenar Imágenes**
   - [ ] Arrastrar primera imagen a última posición
   - [ ] Arrastrar última imagen a primera posición
   - [ ] Verificar que la posición se actualiza correctamente

3. **Eliminar Imágenes**
   - [ ] Eliminar imagen del medio
   - [ ] Eliminar primera imagen
   - [ ] Eliminar última imagen
   - [ ] Verificar reindexación de posiciones

4. **Guardar Producto**
   - [ ] Crear producto con imágenes
   - [ ] Editar producto agregando imágenes
   - [ ] Editar producto eliminando imágenes
   - [ ] Verificar persistencia en base de datos

---

**Fecha de Implementación**: 2025-12-07  
**Versión**: 1.0  
**Estado**: ✅ Completado
