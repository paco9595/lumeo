'use client';

import { usePathname } from 'next/navigation';
import Footer from './footer';

export default function FooterWrapper() {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    if (isLoginPage) {
        return null;
    }

    return <Footer />;
}
