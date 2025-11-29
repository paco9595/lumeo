export type Profile = {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    created_at: string;
};

export type Product = {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    stock: number;
    category_id: number | null;
    created_at: string;
    updated_at: string;
};

export type Category = {
    id: number;
    name: string;
    slug: string;
    created_at: string;
};

export type Cart = {
    id: number;
    user_id: string;
    created_at: string;
};

export type CartItem = {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    cart_id: number;
    product_id: number;
};

export type CartItemWithProduct = {
    id: number;
    quantity: number;
    product_id: number;
    products: {
        id: number;
        name: string;
        price: number;
        image_url: string | null;
    } | null; // puede ser null si la relación falla
};