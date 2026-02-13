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
    subdomain?: string | null
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
    const mainDomain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000'

    // Decode URL component because Next.js dynamic params are encoded (e.g. %3A for colon)
    const decodedDomain = decodeURIComponent(domain)
    const decodedMain = decodeURIComponent(mainDomain)

    // Normalize: strip ports for matching logic
    const domainWithoutPort = decodedDomain.split(':')[0]
    const mainDomainWithoutPort = decodedMain.split(':')[0]

    console.log(`[getWebsiteByDomain] Normalized search:
  - Raw Domain: ${domain}
  - Decoded: ${decodedDomain}
  - Domain No Port: ${domainWithoutPort}
  - Main No Port: ${mainDomainWithoutPort}`)

    // 1. Try finding by the full string (e.g. custom domain or exact subdomain)
    let { data, error } = await supabase
        .from('Website')
        .select('*, WebsitePage(*)')
        .eq('subdomain', domainWithoutPort)
        .maybeSingle()

    if (data) {
        console.log(`[getWebsiteByDomain] Found by exact subdomain: ${data.id} (published: ${data.published})`)
        return data as Website & { WebsitePage: WebsitePage[] }
    }
    if (error && error.code !== 'PGRST116') {
        console.error(`[getWebsiteByDomain] DB Error (subdomain search):`, error)
    }

    const { data: customData, error: customError } = await supabase
        .from('Website')
        .select('*, WebsitePage(*)')
        .eq('domain', domainWithoutPort)
        .maybeSingle()

    if (customData) {
        console.log(`[getWebsiteByDomain] Found by custom domain: ${customData.id} (published: ${customData.published})`)
        return customData as Website & { WebsitePage: WebsitePage[] }
    }
    if (customError && customError.code !== 'PGRST116') {
        console.error(`[getWebsiteByDomain] DB Error (custom domain search):`, customError)
    }

    // 2. Try stripping the base domain for multi-level subdomains
    // e.g. energy.fea6ec4.localhost:3000 -> energy.fea6ec4
    let subdomainPart = domainWithoutPort
    if (domainWithoutPort.endsWith(mainDomainWithoutPort)) {
        // Remove the main domain suffix (and the preceding dot)
        subdomainPart = domainWithoutPort.replace(new RegExp(`\\.?${mainDomainWithoutPort}$`), '')
        console.log(`[getWebsiteByDomain] Suffix matched. Testing subdomainPart: "${subdomainPart}"`)

        if (subdomainPart) {
            const { data: subdomainData, error: subError } = await supabase
                .from('Website')
                .select('*, WebsitePage(*)')
                .eq('subdomain', subdomainPart)
                .maybeSingle()

            if (subdomainData) {
                console.log(`[getWebsiteByDomain] Found match by internal subdomain: ${subdomainData.id} (published: ${subdomainData.published})`)
                if (!subdomainData.published) {
                    console.warn(`[getWebsiteByDomain] Website found but is NOT marked as published in DB.`)
                }
                return subdomainData as Website & { WebsitePage: WebsitePage[] }
            }
            if (subError && subError.code !== 'PGRST116') {
                console.error(`[getWebsiteByDomain] DB Error (subdomainPart search):`, subError)
            }
        }
    } else {
        console.log(`[getWebsiteByDomain] Host "${domainWithoutPort}" does not end with "${mainDomainWithoutPort}"`)
    }

    // 3. Try matching fallback pattern: {slug}.{idSnippet}
    // This handles old websites that don't have the subdomain column populated yet
    if (subdomainPart.includes('.')) {
        const parts = subdomainPart.split('.')
        // The snippet is usually the second-to-last or last part before our main domain
        // For energy.fea6ec4 -> fea6ec4 is the snippet
        const idSnippet = parts[parts.length - 1].toLowerCase()

        if (idSnippet.length >= 4 && idSnippet.length <= 36) {
            console.log(`[getWebsiteByDomain] Testing fallback ID snippet: ${idSnippet}`)

            // Fixed range query for UUID
            const pad0 = '00000000-0000-0000-0000-000000000000'.substring(idSnippet.length)
            const padF = 'ffffffff-ffff-ffff-ffff-ffffffffffff'.substring(idSnippet.length)
            const low = `${idSnippet}${pad0}`
            const high = `${idSnippet}${padF}`

            console.log(`[getWebsiteByDomain] ID Range: [${low}] to [${high}]`)

            const { data: idMatches, error: idError } = await supabase
                .from('Website')
                .select('*, WebsitePage(*)')
                .gte('id', low)
                .lte('id', high)
                .limit(1)

            if (idMatches && idMatches.length > 0) {
                console.log(`[getWebsiteByDomain] Found match by ID range: ${idMatches[0].id} (published: ${idMatches[0].published})`)
                return idMatches[0] as Website & { WebsitePage: WebsitePage[] }
            }
            if (idError) {
                console.error(`[getWebsiteByDomain] DB Error (ID range search):`, idError)
            }
        } else {
            console.log(`[getWebsiteByDomain] Snippet "${idSnippet}" failed length check`)
        }
    }

    console.warn(`[getWebsiteByDomain] No match found for hostname: ${domainWithoutPort}`)
    return null
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
