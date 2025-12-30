import { Database } from "@/lib/database.types";

type varianteRow = Database['public']['Views']['product_variants_summary']['Row'];

export function groupVariants(variantes: varianteRow[]) {
    const atributosAgrupados = variantes.reduce((acc, variante) => {
        // Cast attributes to Record<string, string> as it is typed as Json | null
        const attributes = variante.attributes as Record<string, string>[] | null;
        if (attributes) {
            attributes.forEach(({ option_name: key, option_value: value }) => {
                if (!acc[key]) {
                    acc[key] = new Set<string>();
                }
                if (value) {
                    acc[key].add(value);
                }
            })
        }
        return acc;
    }, {} as Record<string, Set<string>>);

    // Convert Sets to Arrays for serialization
    return Object.fromEntries(
        Object.entries(atributosAgrupados).map(([key, value]) => [key, Array.from(value)])
    );
}