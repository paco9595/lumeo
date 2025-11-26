import Image from 'next/image';
import Link from 'next/link';

const CATEGORIES = [
    { name: 'Stickers', count: '50+ Designs', image: 'https://placehold.co/200x200/png?text=Stickers' },
    { name: 'Cake Toppers', count: '30+ Designs', image: 'https://placehold.co/200x200/png?text=Toppers' },
    { name: 'T-Shirts', count: '25+ Designs', image: 'https://placehold.co/200x200/png?text=Tshirts' },
    { name: 'Custom', count: 'Your Design', image: 'https://placehold.co/200x200/png?text=Custom' },
];

export default function Categories() {
    return (
        <section className="py-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Categories</h2>
                <p className="text-gray-500">Discover our wide variety of custom products</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {CATEGORIES.map((category) => (
                    <Link
                        key={category.name}
                        href="/catalog"
                        className="flex flex-col items-center group"
                    >
                        <div className="relative w-36 h-36 rounded-full overflow-hidden bg-gray-100 mb-4 group-hover:ring-1 group-hover:ring-gray-300 transition-all">
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                        <h3 className="font-medium text-gray-900 text-sm tracking-wide group-hover:text-black transition-colors">{category.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{category.count}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
