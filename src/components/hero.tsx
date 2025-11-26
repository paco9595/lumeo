import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative w-full bg-[#F5F5F5] overflow-hidden rounded-none md:rounded-3xl my-0 md:my-6">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="md:w-1/2 text-center md:text-left space-y-8">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.2em]">New Collection 2025</p>
            <h1 className="text-5xl md:text-7xl font-bold text-primary leading-tight tracking-tight">
              Minimalist <br /> <span className="text-gray-400">Elegance</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto md:mx-0 font-light leading-relaxed">
              Discover our exclusive collection of premium styles designed to elevate your wardrobe with timeless simplicity.
            </p>
            <Link
              href="/catalog"
              className="inline-block bg-primary text-white px-10 py-4 rounded-none font-medium hover:bg-gray-800 transition-all hover:shadow-xl text-sm tracking-widest"
            >
              SHOP COLLECTION
            </Link>
          </div>

          {/* Image Content */}
          <div className="md:w-1/2 relative">
            <div className="relative w-full h-[500px] md:h-[600px]">
              <Image
                src="https://placehold.co/600x800/png?text=Fashion+Model"
                alt="Hero Fashion"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}