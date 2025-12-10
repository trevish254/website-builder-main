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

        const { data, error } = await supabase
            .from('WebsiteTemplate')
            .insert({
                name: payload.name,
                description: payload.description || null,
                category: payload.category || 'General',
                thumbnail: payload.thumbnail || null,
                content: payload.content,
                isPublic: payload.isPublic,
                createdBy: userId,
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating template:', error)
            return { success: false, error: error.message }
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
