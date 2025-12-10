'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageData {
    id?: string;
    url: string;
    position: number;
}

interface MultipleImageUploadProps {
    images: ImageData[];
    onChange: (images: ImageData[]) => void;
}

export default function MultipleImageUpload({ images, onChange }: MultipleImageUploadProps) {
    const [newImageUrl, setNewImageUrl] = useState('');
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleAddImage = () => {
        if (!newImageUrl.trim()) return;

        const newImage: ImageData = {
            url: newImageUrl,
            position: images.length,
        };

        onChange([...images, newImage]);
        setNewImageUrl('');
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        // Reajustar posiciones
        const reindexedImages = updatedImages.map((img, i) => ({
            ...img,
            position: i,
        }));
        onChange(reindexedImages);
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...images];
        const draggedImage = newImages[draggedIndex];
        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedImage);

        // Reajustar posiciones
        const reindexedImages = newImages.map((img, i) => ({
            ...img,
            position: i,
        }));

        onChange(reindexedImages);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <label htmlFor="image-url-input" className="block text-sm font-semibold text-gray-700">
                    Imágenes del Producto
                </label>
                <span className="text-xs text-gray-500">
                    (Arrastra para reordenar)
                </span>
            </div>

            {/* Add new image */}
            <div className="flex gap-2">
                <input
                    id="image-url-input"
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddImage();
                        }
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://ejemplo.com/imagen.jpg"
                />
                <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                    Agregar
                </button>
            </div>

            {/* Images grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`relative group cursor-move border-2 rounded-lg overflow-hidden transition-all ${draggedIndex === index
                                ? 'border-purple-500 opacity-50'
                                : 'border-gray-200 hover:border-purple-300'
                                }`}
                        >
                            {/* Position badge */}
                            <div className="absolute top-2 left-2 z-10 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {index + 1}
                            </div>

                            {/* Primary badge */}
                            {index === 0 && (
                                <div className="absolute top-2 right-2 z-10 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    Principal
                                </div>
                            )}

                            {/* Image */}
                            <div className="aspect-square bg-gray-100">
                                <Image
                                    src={image.url}
                                    alt={`Producto ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://placehold.co/400x400/png?text=Error';
                                    }}
                                />
                            </div>

                            {/* Remove button */}
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                            >
                                <div className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {images.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                        No hay imágenes agregadas
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Agrega una URL de imagen arriba
                    </p>
                </div>
            )}

            <p className="text-xs text-gray-500">
                💡 <strong>Tip:</strong> La primera imagen será la imagen principal del producto.
                Arrastra las imágenes para cambiar su orden.
            </p>
        </div>
    );
}
