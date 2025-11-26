import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 mt-20 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <span className="text-xl font-bold text-white">L</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Elevating your everyday style with timeless minimalist designs. Quality craftsmanship meets modern aesthetics.
            </p>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="/catalog" className="hover:text-black transition-colors">New Arrivals</Link></li>
              <li><Link href="/catalog" className="hover:text-black transition-colors">Best Sellers</Link></li>
              <li><Link href="/catalog" className="hover:text-black transition-colors">Accessories</Link></li>
              <li><Link href="/catalog" className="hover:text-black transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Help</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-black transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Size Guide</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Newsletter</h4>
            <p className="text-gray-500 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
              <button className="bg-black text-white px-6 py-3 text-sm font-medium uppercase tracking-widest hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Lumeo. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-400 hover:text-black transition-colors text-sm">Privacy Policy</Link>
            <Link href="#" className="text-gray-400 hover:text-black transition-colors text-sm">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}