import { createBrowserClient } from "./supabase/createBrowserClient";

export async function getCategories() {
    const supabase = await createBrowserClient();
    const { data: categories } = await supabase.from('categories').select('*');
    return categories;
}