import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { getProductById, getRelatedProducts } from '@/lib/products';
import ProductInfo from '@/components/product/ProductInfo';
import ProductCard from '@/components/catalog/ProductCard';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: 'Producto No Encontrado',
    };
  }

  return {
    title: product.name,
    description: product.description || `Compra ${product.name} en Lumeo. ${product.category} personalizado - $${product.price.toFixed(2)}. Diseños únicos, calidad premium.`,
    openGraph: {
      title: `${product.name} | Lumeo`,
      description: product.description || `Compra ${product.name} personalizado en Lumeo`,
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || `Compra ${product.name} personalizado en Lumeo`,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(id);

  // JSON-LD structured data for SEO
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Lumeo',
    },
    offers: {
      '@type': 'Offer',
      url: `https://lumeo.com/product/${product.id}`,
      priceCurrency: 'USD',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Lumeo',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="min-h-screen bg-[#F5F5F5] py-12 md:py-20">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/catalog" className="hover:text-black transition-colors">Catalog</Link>
            <span className="mx-2">/</span>
            <span className="text-black">{product.name}</span>
          </div>

          {/* Main Product Info */}
          <ProductInfo product={product} />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-gray-200 pt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center tracking-tight">También Te Puede Interesar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}