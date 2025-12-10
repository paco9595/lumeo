'use client';

import { usePathname } from 'next/navigation';
import Footer from './footer';

export default function FooterWrapper() {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';
    const isAdminPage = pathname?.startsWith('/admin');

    if (isLoginPage || isAdminPage) {
        return null;
    }

    return <Footer />;
}
