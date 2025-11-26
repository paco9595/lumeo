export default function Features() {
    const features = [
        {
            icon: '🚚',
            title: 'Worldwide Shipping',
            description: 'Order above $200',
        },
        {
            icon: '💰',
            title: 'Money Back Guarantee',
            description: 'Guarantee within 30 days',
        },
        {
            icon: '🎁',
            title: 'Offers and Discounts',
            description: 'Best Returns on 7 Days',
        },
        {
            icon: '💬',
            title: '24/7 Support Services',
            description: 'Any time Support',
        },
    ];

    return (
        <section className="py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center text-center p-8 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <div className="text-3xl mb-4 grayscale opacity-80">{feature.icon}</div>
                        <div>
                            <h3 className="font-medium text-gray-900 mb-2 tracking-wide">{feature.title}</h3>
                            <p className="text-sm text-gray-500 font-light">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
