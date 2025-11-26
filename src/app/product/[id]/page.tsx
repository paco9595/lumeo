import { notFound } from 'next/navigation';
import { getProductById, getRelatedProducts } from '@/lib/products';
import ProductInfo from '@/components/product/ProductInfo';
import ProductCard from '@/components/catalog/ProductCard';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(id);

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12 md:py-20">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-black transition-colors">Home</a>
          <span className="mx-2">/</span>
          <a href="/catalog" className="hover:text-black transition-colors">Catalog</a>
          <span className="mx-2">/</span>
          <span className="text-black">{product.name}</span>
        </div>

        {/* Main Product Info */}
        <ProductInfo product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center tracking-tight">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}