import FilterSidebar from '@/components/catalog/FilterSidebar';
import ProductGrid from '@/components/catalog/ProductGrid';
import { getProducts } from '@/lib/products';


export default async function CatalogPage() {
  const products = await getProducts()
  return (
    <div className="min-h-screen py-8">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Catalog</h1>
          <p className="text-gray-600">Discover our curated collection of {products?.length} products</p>
        </div>

        {/* Unified Container */}
        <div className="">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Area */}
            <aside className="w-full md:w-64 flex-shrink-0">
              <FilterSidebar />
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow">
              <ProductGrid products={products || []} />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}