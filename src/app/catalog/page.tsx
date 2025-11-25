import FilterSidebar from '@/components/catalog/FilterSidebar';
import ProductGrid from '@/components/catalog/ProductGrid';

const DUMMY_PRODUCTS = [
  {
    id: '1',
    name: 'Minimalist Leather Watch',
    price: 129.99,
    image: 'https://placehold.co/600x600/png',
    category: 'Accessories'
  },
  {
    id: '2',
    name: 'Wireless Noise-Cancelling Headphones',
    price: 249.99,
    image: 'https://placehold.co/600x600/png',
    category: 'Electronics'
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    image: 'https://placehold.co/600x600/png',
    category: 'Clothing'
  },
  {
    id: '4',
    name: 'Smart Home Speaker',
    price: 89.99,
    image: 'https://placehold.co/600x600/png',
    category: 'Electronics'
  },
  {
    id: '5',
    name: 'Ceramic Coffee Mug Set',
    price: 34.99,
    image: 'https://placehold.co/600x600/png',
    category: 'Home & Garden'
  },
  {
    id: '6',
    name: 'Yoga Mat',
    price: 45.00,
    image: 'https://placehold.co/600x600/png',
    category: 'Sports'
  },
  {
    id: '7',
    name: 'Polarized Sunglasses',
    price: 159.50,
    image: 'https://placehold.co/600x600/png',
    category: 'Accessories'
  },
  {
    id: '8',
    name: 'Running Shoes',
    price: 110.00,
    image: 'https://placehold.co/600x600/png',
    category: 'Sports'
  }
];

export default function CatalogPage() {
  return (
    <div className="min-h-screen py-8">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Catalog</h1>
          <p className="text-gray-600">Discover our curated collection of {DUMMY_PRODUCTS.length} products</p>
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
              <ProductGrid products={DUMMY_PRODUCTS} />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}