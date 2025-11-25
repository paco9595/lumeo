import Image from 'next/image';
import Link from 'next/link';

const FEATURED = [
    {
        id: 1,
        tag: 'DEAL FASHIONS',
        title: 'Lacoste Men Blue T-shirt',
        image: 'https://placehold.co/400x500/png?text=Blue+Tshirt',
    },
    {
        id: 2,
        tag: 'STYLISH SHOES',
        title: 'Saletheworld Women Sneakers Shoes',
        image: 'https://placehold.co/400x500/png?text=Sneakers',
    },
    {
        id: 3,
        tag: 'HANDMADE FASHION',
        title: 'Saletheworld Beige Small Bag',
        image: 'https://placehold.co/400x500/png?text=Bag',
    },
];

export default function FeaturedCards() {
    return (
        <section className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {FEATURED.map((item) => (
                    <div
                        key={item.id}
                        className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-pastel-pink/10 to-pastel-purple/10 group"
                    >
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <p className="text-xs font-semibold uppercase tracking-wider mb-2">{item.tag}</p>
                            <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                            <Link
                                href="/catalog"
                                className="inline-block bg-white text-gray-900 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                            >
                                SHOP NOW
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
