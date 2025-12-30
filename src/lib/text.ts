`

            id,
            name,
            description,
            price,
            stock,
            created_at,
            updated_at,

            product_images(*),

            product_categories:product_categories!product_categories_product_id_fkey (
            categories:categories!product_categories_category_id_fkey (
                id,
                name,
                slug
            )
            ),

            product_related:product_related!product_related_product_id_fkey (
            id,
            product_id,
            related_product_id,
            position,
            related_product:products!product_related_related_product_id_fkey (
                id,
                name,
                price,
                stock,
                product_images(*)
            )
            ),

            product_options(*,
            product_option_values(*)
            ),

            product_variants(
                id,
                product_id,
                sku,
                price,
                stock,
                product_variant_options (
                    product_option_values (
                        value,
                        product_options (
                            name
                        )
                    )
                )
            )
`