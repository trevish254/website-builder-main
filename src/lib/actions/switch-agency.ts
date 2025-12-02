'use server'

import { getUser as getAuthUser } from '../supabase/server'
import { supabase } from '../supabase'
import { revalidatePath } from 'next/cache'

type AnyRecord = Record<string, any>

// Switch user to a different agency they have access to
export const switchUserAgency = async (targetAgencyId: string) => {
    console.log('🔄 switchUserAgency called with:', targetAgencyId)
    const user = await getAuthUser()
    if (!user) {
        console.error('No authenticated user found')
        return { success: false, error: 'Not authenticated' }
    }

    console.log('👤 Current user:', user.id, user.email)

    // Check if user has access to this agency (either owns it or was invited)
    const { data: invitation } = await supabase
        .from('Invitation')
        .select('*')
        .eq('email', user.email)
        .eq('agencyId', targetAgencyId)
        .eq('status', 'ACCEPTED')
        .maybeSingle()

    console.log('📧 Invitation check:', invitation)

    const { data: userRecord } = await supabase
        .from('User')
        .select('id, agencyId')
        .eq('id', user.id)
        .single()

    console.log('👤 User record:', userRecord)

    // Check if this is the user's own agency or they have an accepted invitation
    const hasAccess = invitation || (userRecord as any)?.agencyId === targetAgencyId

    console.log('🔐 Has access:', hasAccess)

    if (!hasAccess) {
        console.error(`❌ User ${user.id} attempted to switch to agency ${targetAgencyId} without access`)
        throw new Error('You do not have access to this agency')
    }

    // CRITICAL FIX: Do NOT update the user's agencyId in the database.
    // Updating agencyId changes the user's "Home" agency and can overwrite their role,
    // leading to security issues (e.g. accessing subaccounts they shouldn't) and
    // potential lockout from their own agency.
    //
    // Instead, we just verify access here and let the client navigate.
    // The layout and page components will handle context based on the URL params.

    console.log(`✅ Access verified for agency ${targetAgencyId}. Revalidating cache...`)

    // Revalidate paths to clear cached data
    revalidatePath('/', 'layout') // Clear all layout caches
    revalidatePath(`/agency/${targetAgencyId}`)

    return { success: true }
}
