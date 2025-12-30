import { Product, ProductVariantSummary } from "@/types/Product";
import { Database } from "./database.types";
import { createClient } from "./supabase/createServerClient";


export type ProductEntity = Database['public']['Tables']['products']['Row'];
export async function getProductById(id: string): Promise<Product | undefined> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("product_variants_summary_1")
        .select(`
            *,
            products:(*),
            product_variants(*),
            product_categories(*),
            product_images(*),
            product_related(*),
            product_options(*),
            product_option_values(*)
        `)
        .eq("product_id", id)
        .single();

    if (error) {
        console.error("Error fetching product:", error);
        return undefined;
    }
    console.log({ data })
    // Reformateo como lo tenías
    // const flatProduct = {
    //     ...data.product,
    //     product_categories: data.product_categories.map((pc) => pc.categories.name),
    //     product_options: data.product_options.reduce((acc, po) => ({
    //         ...acc,
    //         [po.name]: po.product_option_values.map((pov) => pov.value)
    //     }), {} as Record<string, string[]>),
    //     product_variants: (data.product_variants as any).map((v: any) => ({
    //         ...v,
    //         product_variant_options: v.product_variant_options.reduce((acc: any, vo: any) => ({
    //             ...acc,
    //             [vo.product_option_values.product_options.name]: vo.product_option_values.value
    //         }), {} as Record<string, string>)
    //     }))
    // };

    return data as unknown as Product;
}

export async function getRelatedProducts(currentId: string, limit: number = 4) {
    const supabase = await createClient();
    const { data: relatedProducts } = await supabase.from('product_related').select(`
        related_product:products!product_related_related_product_id_fkey (
            id,
            name,
            price,
            product_images(*)
        )
    `).limit(limit).eq('product_id', currentId);
    console.log({ relatedProducts });
    return relatedProducts?.map((relatedProduct) => relatedProduct.related_product);
}

export async function getProducts() {
    const supabase = await createClient();
    const { data: products, error } = await supabase.from('products').select('*, product_images(*)');
    console.log({ products, error });
    return products;
}

export async function getVariants(productId: string): Promise<Product[]> {
    const supabase = await createClient();
    const { data: variants, error } = await supabase
        .from("product_variants_summary_1")
        .select(`*`)
        .eq("product_id", productId);
    if (error) {
        console.error("Error fetching variants:", error);
        return [];
    }
    console.log({ variants });
    return variants as unknown as Product[];
}