'use server'

import { supabase, supabaseAdmin } from './supabase'

export const getClientDocs = async (agencyId: string) => {
    const { data, error } = await supabaseAdmin
        .from('ClientDoc' as any)
        .select('*')
        .eq('agencyId', agencyId)
        .order('createdAt', { ascending: false })

    if (error) {
        console.error('Error fetching client docs:', error)
        return []
    }
    return data
}

export const getClientDocDetails = async (docId: string) => {
    const { data, error } = await supabaseAdmin
        .from('ClientDoc' as any)
        .select('*')
        .eq('id', docId)
        .single()

    if (error) {
        console.error('Error fetching client doc:', error)
        return null
    }
    return data
}

export const upsertClientDoc = async (doc: any) => {
    // Prepare the document with required fields
    const docData = {
        ...doc,
        createdAt: doc.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin
        .from('ClientDoc' as any)
        .upsert(docData)
        .select()
        .single()

    if (error) {
        console.error('Error upserting client doc:', error)
        throw error
    }
    return data
}

export const deleteClientDoc = async (docId: string) => {
    const { error } = await supabaseAdmin
        .from('ClientDoc' as any)
        .delete()
        .eq('id', docId)

    if (error) {
        console.error('Error deleting client doc:', error)
        throw error
    }
    return true
}
