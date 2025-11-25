import CarouselProducts from "@/components/product/carouselProducts";
import ProductDetail from "@/components/product/productDetail";

export default function ProductPage() {
  return (
    <div className="p-8 mt-10">
      <h1 className="text-3xl font-bold mb-6">Product Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 ">
        <div>
          <CarouselProducts />
        </div>
        <div className="">
          <ProductDetail />
        </div>
      </div>
    </div>
  );
}