import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from './lib/supabase/createServerClient'

export async function middleware(request: NextRequest) {
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = await createServerClient()

    // Refresh session if expired
    const { data: { user } } = await supabase.auth.getUser()
    const path = request.nextUrl.pathname

    // Protected admin routes
    const isAdminRoute = path.startsWith('/admin')
    const isSellerRoute = path.startsWith('/seller')

    if (isAdminRoute || isSellerRoute) {
        if (!user) {
            // Redirect to sign-in if not authenticated
            const redirectUrl = new URL('/sign-in', request.url)
            redirectUrl.searchParams.set('redirect', path)
            return NextResponse.redirect(redirectUrl)
        }

        // Check user role
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('role, is_admin')
            .eq('id', user.id)
        if (error) {
            console.error('Error fetching profile:', error)
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        if (profile.length === 0) {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        // Check admin access
        if (isAdminRoute) {
            const hasAdminAccess = profile[0].role === 'admin' || profile[0].is_admin === true
            if (!hasAdminAccess) {
                return NextResponse.redirect(new URL('/unauthorized', request.url))
            }
        }

        // Check seller access (sellers and admins can access)
        if (isSellerRoute) {
            const hasSellerAccess =
                profile[0].role === 'seller' ||
                profile[0].role === 'admin' ||
                profile[0].is_admin === true
            if (!hasSellerAccess) {
                return NextResponse.redirect(new URL('/unauthorized', request.url))
            }
        }
    }

    return response
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
