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

export const getDocComments = async (docId: string) => {
    const { data, error } = await supabaseAdmin
        .from('ClientDocComment' as any)
        .select('*, User(name, avatarUrl)')
        .eq('documentId', docId)
        .order('createdAt', { ascending: true })

    if (error) {
        console.error('Error fetching comments:', error)
        return []
    }
    return data
}

export const createDocComment = async (comment: any) => {
    const { data, error } = await supabaseAdmin
        .from('ClientDocComment' as any)
        .insert(comment)
        .select('*, User(name, avatarUrl)')
        .single()

    if (error) {
        console.error('Error creating comment:', error)
        throw error
    }
    return data
}

export const getDocVersions = async (docId: string) => {
    const { data, error } = await supabaseAdmin
        .from('ClientDocVersion' as any)
        .select('*, User(name)')
        .eq('documentId', docId)
        .order('createdAt', { ascending: false })

    if (error) {
        console.error('Error fetching versions:', error)
        return []
    }
    return data
}

export const createDocVersion = async (version: any) => {
    const { data, error } = await supabaseAdmin
        .from('ClientDocVersion' as any)
        .insert(version)
        .select()
        .single()

    if (error) {
        console.error('Error creating version:', error)
        throw error
    }
    return data
}

export const getAgencyTeams = async (agencyId: string, userId: string) => {
    const { data, error } = await supabaseAdmin
        .from('Team' as any)
        .select(`
            *,
            TeamUser!inner (
                userId,
                User (
                    name,
                    avatarUrl
                )
            )
        `)
        .eq('agencyId', agencyId)
        .eq('TeamUser.userId', userId)

    if (error) {
        console.error('Error fetching agency teams:', error)
        return []
    }
    return data
}

export const getAgencyTeamMembers = async (agencyId: string) => {
    const { data, error } = await supabaseAdmin
        .from('User')
        .select('*')
        .eq('agencyId', agencyId)

    if (error) {
        console.error('Error fetching agency members:', error)
        return []
    }
    return data
}
