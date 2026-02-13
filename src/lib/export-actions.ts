'use server'

import { createClient } from '@/lib/supabase/server'
import { WebsitePage } from './website-queries'

export interface WebsiteTemplate {
    id: string
    name: string
    description: string | null
    thumbnail: string | null
    category: string
    content: any
    isPublic: boolean
    createdBy: string | null
    createdAt: string
}

export interface CreateTemplatePayload {
    name: string
    description?: string
    category?: string
    thumbnail?: string
    content: any
    isPublic: boolean
}

export interface PublishWebsitePayload {
    websiteId: string
    domain?: string
    subdomain?: string
}

/**
 * Create a template from a website
 */
export async function createTemplateFromWebsite(
    payload: CreateTemplatePayload,
    userId: string
): Promise<{ success: boolean; error?: string; templateId?: string }> {
    try {
        const supabase = await createClient()

        console.log('--- CREATING TEMPLATE ---')
        console.log('Table: WebsiteTemplate')
        const insertData: any = {
            name: payload.name,
            description: payload.description || null,
            category: payload.category || 'General',
            thumbnail: payload.thumbnail || null,
            content: payload.content,
            'isPublic': payload.isPublic,
            'createdBy': userId,
        }

        // --- SCHEMA INTROSPECTION ---
        console.log('--- SCHEMA INTROSPECTION ---')
        const { data: schemaTest, error: schemaError } = await supabase
            .from('WebsiteTemplate')
            .select('*')
            .limit(1)

        if (schemaError) {
            console.error('SCHEMA ERROR:', JSON.stringify(schemaError, null, 2))
        } else if (schemaTest && schemaTest.length > 0) {
            console.log('Detected Columns:', Object.keys(schemaTest[0]))
        } else {
            console.log('No existing rows to detect columns from.')
        }

        console.log('Payload (REVERTED TO camelCase):', JSON.stringify({
            ...insertData,
            content: 'PROJECT_DATA_HIDDEN',
            thumbnail: insertData.thumbnail ? 'EXISTS' : 'NONE',
        }, null, 2))

        const { data, error } = await supabase
            .from('WebsiteTemplate')
            .insert(insertData)
            .select()
            .single()

        if (error) {
            console.error('SUPABASE ERROR:', JSON.stringify(error, null, 2))

            // One last attempt to see column names if insert fails
            const { data: cols } = await supabase.from('WebsiteTemplate').select('*').limit(1)
            const colNames = cols && cols.length > 0 ? Object.keys(cols[0]).join(', ') : 'unknown'

            return {
                success: false,
                error: `${error.message}${error.details ? ': ' + error.details : ''} (Expected columns: ${colNames})`
            }
        }

        return { success: true, templateId: data.id }
    } catch (error) {
        console.error('Error creating template:', error)
        return { success: false, error: 'Failed to create template' }
    }
}

/**
 * Publish a website
 */
export async function publishWebsite(
    payload: PublishWebsitePayload
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient()

        const updateData: any = {
            published: true,
            updatedAt: new Date().toISOString(),
        }

        if (payload.domain) {
            updateData.domain = payload.domain
        }

        if (payload.subdomain) {
            updateData.subdomain = payload.subdomain
        }

        const { error } = await supabase
            .from('Website')
            .update(updateData)
            .eq('id', payload.websiteId)

        if (error) {
            console.error('Error publishing website:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error('Error publishing website:', error)
        return { success: false, error: 'Failed to publish website' }
    }
}

/**
 * Generate website data for ZIP export (client-side will handle ZIP creation)
 */
export async function getWebsiteExportData(websiteId: string): Promise<{
    success: boolean
    error?: string
    data?: {
        websiteName: string
        pages: Array<{
            name: string
            pathName: string
            html: string
            css: string
        }>
    }
}> {
    try {
        const supabase = await createClient()

        // Get website details
        const { data: website, error: websiteError } = await supabase
            .from('Website')
            .select('name')
            .eq('id', websiteId)
            .single()

        if (websiteError) {
            return { success: false, error: websiteError.message }
        }

        // Get all pages
        const { data: pages, error: pagesError } = await supabase
            .from('WebsitePage')
            .select('name, pathName, htmlContent, cssContent')
            .eq('websiteId', websiteId)
            .order('order', { ascending: true })

        if (pagesError) {
            return { success: false, error: pagesError.message }
        }

        const exportPages = pages.map((page) => ({
            name: page.name,
            pathName: page.pathName,
            html: page.htmlContent || '',
            css: page.cssContent || '',
        }))

        return {
            success: true,
            data: {
                websiteName: website.name,
                pages: exportPages,
            },
        }
    } catch (error) {
        console.error('Error getting export data:', error)
        return { success: false, error: 'Failed to get export data' }
    }
}

/**
 * Generate project JSON for export
 */
export async function getProjectJsonExport(websiteId: string): Promise<{
    success: boolean
    error?: string
    data?: {
        websiteName: string
        website: any
        pages: any[]
    }
}> {
    try {
        const supabase = await createClient()

        // Get website details
        const { data: website, error: websiteError } = await supabase
            .from('Website')
            .select('*')
            .eq('id', websiteId)
            .single()

        if (websiteError) {
            return { success: false, error: websiteError.message }
        }

        // Get all pages with full content
        const { data: pages, error: pagesError } = await supabase
            .from('WebsitePage')
            .select('*')
            .eq('websiteId', websiteId)
            .order('order', { ascending: true })

        if (pagesError) {
            return { success: false, error: pagesError.message }
        }

        return {
            success: true,
            data: {
                websiteName: website.name,
                website,
                pages,
            },
        }
    } catch (error) {
        console.error('Error getting project JSON:', error)
        return { success: false, error: 'Failed to get project JSON' }
    }
}

/**
 * Get all public website templates
 */
export async function getWebsiteTemplates(): Promise<WebsiteTemplate[]> {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('WebsiteTemplate')
            .select('*')
            .eq('isPublic', true)
            .order('createdAt', { ascending: false })

        if (error) {
            console.error('Error fetching templates:', error)
            return []
        }

        return data as WebsiteTemplate[]
    } catch (error) {
        console.error('Error fetching templates:', error)
        return []
    }
}

/**
 * Get a single template by ID
 */
export async function getWebsiteTemplate(id: string): Promise<WebsiteTemplate | null> {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('WebsiteTemplate')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            console.error('Error fetching template:', error)
            return null
        }

        return data as WebsiteTemplate
    } catch (error) {
        console.error('Error fetching template:', error)
        return null
    }
}
