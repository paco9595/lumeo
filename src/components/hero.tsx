import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative w-full bg-gradient-to-r from-pastel-pink/20 to-pastel-purple/20 overflow-hidden rounded-3xl my-6">
      <div className="container mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Text Content */}
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <p className="text-sm font-semibold text-pastel-accent uppercase tracking-wider">This Week's Highlights</p>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Limited Edition For Queen Styles Fashion
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
              Discover our exclusive collection of premium styles designed to elevate your wardrobe with elegance and charm.
            </p>
            <Link
              href="/catalog"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all hover:shadow-lg"
            >
              SHOP NOW
            </Link>
          </div>

          {/* Image Content */}
          <div className="md:w-1/2 relative">
            <div className="relative w-full h-[400px] md:h-[500px]">
              <Image
                src="https://placehold.co/600x700/png?text=Fashion+Model"
                alt="Hero Fashion"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}