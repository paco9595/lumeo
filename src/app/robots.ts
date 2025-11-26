import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/checkout/', '/login/'],
            },
        ],
        sitemap: 'https://lumeo.com/sitemap.xml',
    }
}
