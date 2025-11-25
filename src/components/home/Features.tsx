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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-4 p-6 bg-pastel-purple/10 rounded-2xl hover:bg-pastel-purple/15 transition-colors"
                    >
                        <div className="text-4xl">{feature.icon}</div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
