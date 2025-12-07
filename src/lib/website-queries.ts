'use server'

import { createClient } from './supabase/server'
import { v4 } from 'uuid'
import { revalidatePath } from 'next/cache'

// Types (Manual definition to match SQL until types are generated)
export type Website = {
    id: string
    name: string
    subAccountId: string
    published: boolean
    domain?: string | null
    favicon?: string | null
    settings?: any
    customHead?: string | null
    customBody?: string | null
    createdAt: string
    updatedAt: string
}

export type WebsitePage = {
    id: string
    websiteId: string
    name: string
    pathName: string
    content?: any
    htmlContent?: string | null
    cssContent?: string | null
    previewImage?: string | null
    order: number
    customHead?: string | null
    customBody?: string | null
    createdAt: string
    updatedAt: string
}

export const getWebsites = async (subaccountId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('Website')
        .select('*, WebsitePage(*)')
        .eq('subAccountId', subaccountId)
        .order('createdAt', { ascending: false })

    if (error) {
        console.error('Error fetching websites:', error)
        return []
    }
    return data as (Website & { WebsitePage: WebsitePage[] })[]
}

export const getWebsite = async (websiteId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('Website')
        .select('*')
        .eq('id', websiteId)
        .single()

    if (error) {
        console.error('Error fetching website:', error)
        return null
    }
    return data as Website
}

export const getWebsiteByDomain = async (domain: string) => {
    const supabase = createClient()

    // Try finding by subdomain first
    // Note: We select WebsitePage to get the pages for rendering
    let { data, error } = await supabase
        .from('Website')
        .select('*, WebsitePage(*)')
        .eq('subdomain', domain)
        .single()

    if (data) return data as Website & { WebsitePage: WebsitePage[] }

    // Try finding by custom domain
    const { data: customData } = await supabase
        .from('Website')
        .select('*, WebsitePage(*)')
        .eq('domain', domain)
        .single()

    return customData as Website & { WebsitePage: WebsitePage[] }
}

export const upsertWebsite = async (website: Partial<Website>) => {
    const supabase = createClient()
    const payload = {
        ...website,
        updatedAt: new Date().toISOString(),
    }

    if (!payload.id) {
        payload.id = v4()
        payload.createdAt = new Date().toISOString()
    }

    const { data, error } = await supabase
        .from('Website')
        .upsert(payload)
        .select()
        .single()

    if (error) {
        console.error('Error upserting website:', error)
        throw new Error('Failed to save website')
    }

    revalidatePath(`/subaccount/${website.subAccountId}/websites`)
    return data as Website
}

export const deleteWebsite = async (websiteId: string) => {
    const supabase = createClient()
    const { error } = await supabase
        .from('Website')
        .delete()
        .eq('id', websiteId)

    if (error) {
        console.error('Error deleting website:', error)
        throw new Error('Failed to delete website')
    }
    return true
}

export const getWebsitePages = async (websiteId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('WebsitePage')
        .select('*')
        .eq('websiteId', websiteId)
        .order('order', { ascending: true })

    if (error) {
        console.error('Error fetching website pages:', error)
        return []
    }
    return data as WebsitePage[]
}

export const getWebsitePage = async (pageId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('WebsitePage')
        .select('*')
        .eq('id', pageId)
        .single()

    if (error) {
        console.error('Error fetching website page:', error)
        return null
    }
    return data as WebsitePage
}

export const upsertWebsitePage = async (page: Partial<WebsitePage>) => {
    const supabase = createClient()
    const payload = {
        ...page,
        updatedAt: new Date().toISOString(),
    }

    if (!payload.id) {
        payload.id = v4()
        payload.createdAt = new Date().toISOString()
    }

    const { data, error } = await supabase
        .from('WebsitePage')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single()

    if (error) {
        console.error('Error upserting website page:', error)
        throw new Error('Failed to save page: ' + error.message)
    }

    return data as WebsitePage
}

export const deleteWebsitePage = async (pageId: string) => {
    const supabase = createClient()
    const { error } = await supabase
        .from('WebsitePage')
        .delete()
        .eq('id', pageId)

    if (error) {
        console.error('Error deleting website page:', error)
        throw new Error('Failed to delete page')
    }
    return true
}
