import Image from 'next/image';
import Link from 'next/link';

const FEATURED = [
    {
        id: 1,
        tag: 'Cake Toppers',
        title: 'K-pop artist',
        image: 'https://fmjxrdhqiklcgglddpme.supabase.co/storage/v1/object/public/lumeo_products/IMG_0335.jpg',
    },
    {
        id: 2,
        tag: 'Halloween decoration',
        title: 'spooky buttle',
        image: 'https://fmjxrdhqiklcgglddpme.supabase.co/storage/v1/object/public/lumeo_products/IMG_0039.jpg',
    },
    {
        id: 3,
        tag: 'candy box',
        title: 'cath all the candys',
        image: 'https://fmjxrdhqiklcgglddpme.supabase.co/storage/v1/object/public/lumeo_products/IMG_0313.jpg',
    },
];

export default function FeaturedCards() {
    return (
        <section className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {FEATURED.map((item) => (
                    <div
                        key={item.id}
                        className="relative h-96 group overflow-hidden"
                    >
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] mb-3 opacity-90">{item.tag}</p>
                            <h3 className="text-2xl font-light mb-6">{item.title}</h3>
                            <Link
                                href={`/product/${item.id}`}
                                className="inline-block border-b border-white pb-1 text-sm font-medium hover:text-gray-200 transition-colors opacity-0 group-hover:opacity-100 duration-500 delay-100"
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
