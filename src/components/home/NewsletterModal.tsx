'use client';

import { useState, useEffect } from 'react';

export default function NewsletterModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Check if user has already seen/closed the modal
        const hasSeenModal = localStorage.getItem('hasSeenNewsletterModal');

        if (!hasSeenModal) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 3000); // Show after 3 seconds

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('hasSeenNewsletterModal', 'true');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle the newsletter subscription logic
        console.log('Subscribed with:', email);
        handleClose();
        alert('Thank you for subscribing!');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white w-full max-w-md p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Unlock 15% Off</h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Join our newsletter to receive exclusive discounts, style tips, and early access to new collections.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-black transition-colors text-center"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                        >
                            Subscribe Now
                        </button>
                    </form>

                    <button
                        onClick={handleClose}
                        className="text-xs text-gray-400 hover:text-black underline decoration-gray-300 underline-offset-4 transition-colors"
                    >
                        No thanks, I prefer paying full price
                    </button>
                </div>
            </div>
        </div>
    );
}
