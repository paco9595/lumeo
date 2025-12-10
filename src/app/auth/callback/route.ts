import { createServerClient } from '@/lib/supabase/createServerClient';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = await createServerClient();
        await supabase.auth.exchangeCodeForSession(code);
    }

    // URL to redirect to after sign in process completes
    const redirectUrl = requestUrl.searchParams.get('redirect');
    if (redirectUrl) {
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    return NextResponse.redirect(requestUrl.origin);
}
