import Image from 'next/image';
import Link from 'next/link';

const CATEGORIES = [
    { name: 'Watch', count: '8 Products', image: 'https://placehold.co/200x200/png?text=Watch' },
    { name: 'Fashionable', count: '12 Products', image: 'https://placehold.co/200x200/png?text=Fashion' },
    { name: 'Ethnic Wear', count: '6 Products', image: 'https://placehold.co/200x200/png?text=Ethnic' },
    { name: 'Goggles', count: '4 Products', image: 'https://placehold.co/200x200/png?text=Goggles' },
    { name: 'Tote Bag', count: '9 Products', image: 'https://placehold.co/200x200/png?text=Bag' },
    { name: 'Shoes', count: '11 Products', image: 'https://placehold.co/200x200/png?text=Shoes' },
];

export default function Categories() {
    return (
        <section className="py-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Best For Your Categories</h2>
                <p className="text-gray-500">Mauris quis ante elit. Sed rutrum auctor libero, in maximus finibus.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {CATEGORIES.map((category) => (
                    <Link
                        key={category.name}
                        href="/catalog"
                        className="flex flex-col items-center group"
                    >
                        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-pastel-pink/20 to-pastel-purple/20 mb-3 group-hover:shadow-lg group-hover:shadow-pastel-purple/30 transition-all group-hover:scale-105">
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
                        <p className="text-xs text-gray-500">{category.count}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
