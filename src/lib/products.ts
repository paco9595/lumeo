export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description?: string;
    images?: string[];
}

export const PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Basic Tee',
        price: 35.00,
        image: 'https://placehold.co/600x800/png?text=Basic+Tee',
        category: 'Clothing',
        description: 'A timeless classic, our Basic Tee is crafted from 100% premium cotton for a soft, breathable feel. Designed with a relaxed fit and durable stitching, it’s the perfect staple for any wardrobe. Available in a range of neutral tones to complement your minimalist style.',
        images: [
            'https://placehold.co/600x800/png?text=Basic+Tee+1',
            'https://placehold.co/600x800/png?text=Basic+Tee+2',
            'https://placehold.co/600x800/png?text=Basic+Tee+3',
        ]
    },
    {
        id: '2',
        name: 'Linen Shirt',
        price: 89.00,
        image: 'https://placehold.co/600x800/png?text=Linen+Shirt',
        category: 'Clothing',
        description: 'Elevate your summer wardrobe with our Linen Shirt. Made from high-quality, lightweight linen, this shirt offers superior breathability and a sophisticated texture. Features a button-down collar and a tailored fit that looks great tucked in or worn loose.',
        images: [
            'https://placehold.co/600x800/png?text=Linen+Shirt+1',
            'https://placehold.co/600x800/png?text=Linen+Shirt+2',
        ]
    },
    {
        id: '3',
        name: 'Canvas Sneakers',
        price: 120.00,
        image: 'https://placehold.co/600x800/png?text=Canvas+Sneakers',
        category: 'Footwear',
        description: 'Step out in style with our Canvas Sneakers. These versatile shoes feature a durable canvas upper, a cushioned insole for all-day comfort, and a grippy rubber outsole. The clean, minimalist design pairs perfectly with jeans, chinos, or shorts.',
        images: [
            'https://placehold.co/600x800/png?text=Sneakers+1',
            'https://placehold.co/600x800/png?text=Sneakers+2',
        ]
    },
    {
        id: '4',
        name: 'Leather Tote',
        price: 250.00,
        image: 'https://placehold.co/600x800/png?text=Leather+Tote',
        category: 'Accessories',
        description: 'Carry your essentials in luxury with our Leather Tote. Handcrafted from full-grain leather, this spacious bag features a sturdy construction, comfortable handles, and an interior pocket for organization. It develops a beautiful patina over time, making it truly unique.',
        images: [
            'https://placehold.co/600x800/png?text=Leather+Tote+1',
            'https://placehold.co/600x800/png?text=Leather+Tote+2',
        ]
    },
    {
        id: '5',
        name: 'Minimalist Watch',
        price: 150.00,
        image: 'https://placehold.co/600x800/png?text=Minimalist+Watch',
        category: 'Accessories',
        description: 'Keep time in style with our Minimalist Watch. Featuring a sleek stainless steel case, a clean dial with simple markers, and a genuine leather strap, this watch is the epitome of understated elegance. Water-resistant and built to last.',
        images: [
            'https://placehold.co/600x800/png?text=Watch+1',
            'https://placehold.co/600x800/png?text=Watch+2',
        ]
    },
    {
        id: '6',
        name: 'Denim Jacket',
        price: 110.00,
        image: 'https://placehold.co/600x800/png?text=Denim+Jacket',
        category: 'Clothing',
        description: 'A wardrobe essential, our Denim Jacket is made from sturdy, high-quality denim that softens with wear. It features classic detailing, including button-flap chest pockets and adjustable waist tabs. Perfect for layering over a tee or hoodie.',
        images: [
            'https://placehold.co/600x800/png?text=Denim+Jacket+1',
            'https://placehold.co/600x800/png?text=Denim+Jacket+2',
        ]
    },
];

export function getProductById(id: string): Product | undefined {
    return PRODUCTS.find(product => product.id === id);
}

export function getRelatedProducts(currentId: string, limit: number = 4): Product[] {
    return PRODUCTS.filter(product => product.id !== currentId).slice(0, limit);
}
