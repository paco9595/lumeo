import type { Database } from "@/lib/database.types";

type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductImageRow = Database['public']['Tables']['product_images']['Row'];
type ProductRelatedRow = Database['public']['Tables']['product_related']['Row'];
type ProductCategoryRow = Database['public']['Tables']['product_categories']['Row'];
type ProductVariantRow = Database['public']['Tables']['product_variants']['Row'];
type CategoryRow = Database['public']['Tables']['categories']['Row'];


export type ProductVariantSummary = Database['public']['Views']['product_variants_summary_1']['Row'];

export type ProductWithImages = Pick<ProductRow, 'id' | 'name' | 'price'> & {
    product_images: ProductImageRow[];
};

type ProductVariant = ProductVariantRow & {
    product_variant_options?: Record<string, string>;
};

export type Product = Omit<ProductVariantSummary, 'categories'> & {
    categories: CategoryRow[] | null;
    // Join con product_id
    product_images?: ProductImageRow[];
    // Join con related_product_id
    related_product?: ProductWithImages[];
    // Join con variant_id
    product_options?: Record<string, string[]>
    product_variants?: ProductVariant[]
};