'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MultipleImageUpload from '@/components/admin/MultipleImageUpload';

type Category = {
    id: number;
    name: string;
    slug: string;
};

type Product = {
    id: string;
    name: string;
    price: number;
    description: string | null;
    image_url: string | null;
    stock: number | null;
    category_id: number | null;
};

type ImageData = {
    id?: string;
    url: string;
    position: number;
};

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: '',
        description: '',
        image_url: '',
        stock: '',
        category_id: '',
    });
    const [images, setImages] = useState<ImageData[]>([]);

    useEffect(() => {
        fetchCategories();
        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function fetchCategories() {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    async function fetchProduct() {
        try {
            const response = await fetch('/api/admin/products');
            const data = await response.json();
            const product = data.products?.find((p: Product) => p.id === id);

            if (product) {
                setFormData({
                    id: product.id,
                    name: product.name,
                    price: product.price.toString(),
                    description: product.description || '',
                    image_url: product.image_url || '',
                    stock: product.stock?.toString() || '',
                    category_id: product.category_id?.toString() || '',
                });

                // Fetch product images
                const imagesResponse = await fetch(`/api/admin/products/images?product_id=${id}`);
                if (imagesResponse.ok) {
                    const imagesData = await imagesResponse.json();
                    setImages(imagesData.images || []);
                }
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setFetching(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare data with images
            const productData = {
                ...formData,
                images: images.map(img => ({
                    id: img.id,
                    url: img.url,
                    position: img.position
                }))
            };

            const response = await fetch('/api/admin/products/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                router.push('/admin/products');
            } else {
                const data = await response.json();
                alert(data.error || 'Error al actualizar el producto');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error al actualizar el producto');
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/products"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Editar Producto
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Actualiza la información del producto
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 border border-gray-100 space-y-6">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre del Producto *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ej: Camiseta Básica"
                    />
                </div>

                {/* Price */}
                <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                        Precio *
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                        </span>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            required
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="category_id" className="block text-sm font-semibold text-gray-700 mb-2">
                        Categoría
                    </label>
                    <select
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="">Sin categoría</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Stock */}
                <div>
                    <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-2">
                        Stock
                    </label>
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0"
                    />
                </div>

                {/* Multiple Images */}
                <MultipleImageUpload
                    images={images}
                    onChange={setImages}
                />

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={5}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        placeholder="Describe el producto..."
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                    <Link
                        href="/admin/products"
                        className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 text-center"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
}
