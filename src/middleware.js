// =============================================================================
// TEMPORARY AUTHENTICATION BYPASS FOR TESTING
// =============================================================================
// This middleware currently allows dashboard access without authentication.
// 
// TO ENABLE AUTHENTICATION REQUIREMENT:
// 1. Set TEMP_ALLOW_DASHBOARD_WITHOUT_AUTH = false (line ~16)
// 2. In dashboard/page.js: Set DEMO_MODE_ENABLED = false
// 
// The middleware will then redirect unauthenticated users to /login
// =============================================================================

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BASE_URL = process.env.BASE_URL;

// TEMPORARY DEMO MODE CONFIGURATION - TODO: Remove when authentication is required
const TEMP_ALLOW_DASHBOARD_WITHOUT_AUTH = true; // Set to false to require authentication

export async function middleware(request) {

    const currentSession = (await cookies()).get('session')?.value;

    let session = false;
    
    if (currentSession) {
        try {
            const validateSession = await fetch(`${BASE_URL}/api/validateSession`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session: currentSession }),
            });
            session = validateSession.ok;
        } catch (error) {
            console.log('Session validation failed:', error);
            session = false;
        }
    }

    const pathname = request.nextUrl.pathname;

    if (session && (pathname === '/login' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!session && pathname.startsWith('/dashboard')) {
        // TEMPORARY: Allow demo access to dashboard for testing
        // TODO: Remove this entire section when authentication is required
        if (TEMP_ALLOW_DASHBOARD_WITHOUT_AUTH) {
            console.log('Allowing dashboard access without auth (temp mode)');
            return NextResponse.next();
        }
        
        // Normal behavior: require authentication
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/signup'],
};
