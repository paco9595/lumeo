import { Product } from "./Product";

export interface CartItem extends Product {
    id: string; // Product ID
    quantity: number;
    variant_id?: string;
    sku?: string;
}