import { type NextRequest } from 'next/server'

import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    const { supabase, response } = createClient(request)
    // Refresh user's session if expired
    await supabase.auth.getSession()
    return response
}