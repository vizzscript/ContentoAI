import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Simple in-memory storage for rate limiting (reset on server reboot)
const rateLimitMap = new Map<string, { count: number, lastRequest: number }>()

const RATE_LIMIT = 100 // 100 requests
const WINDOW_MS = 60 * 1000 // 1 minute

export function middleware(request: NextRequest) {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : (request as any).ip || '127.0.0.1'
    const now = Date.now()

    const record = rateLimitMap.get(ip) || { count: 0, lastRequest: now }

    // Reset window if it expires
    if (now - record.lastRequest > WINDOW_MS) {
        record.count = 0
        record.lastRequest = now
    }

    record.count++
    rateLimitMap.set(ip, record)

    if (record.count > RATE_LIMIT) {
        return new NextResponse('Too Many Requests', { status: 429 })
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/api/:path*',
}
