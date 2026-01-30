'use server'

import { createClient } from './supabase/server'
import { v4 } from 'uuid'
import { revalidatePath } from 'next/cache'

export type EmailCampaign = {
    id: string
    name: string
    subAccountId: string
    subject?: string | null
    description?: string | null
    content?: any
    htmlContent?: string | null
    previewImage?: string | null
    status: 'DRAFT' | 'SCHEDULED' | 'SENT'
    scheduledAt?: string | null
    sentAt?: string | null
    createdAt: string
    updatedAt: string
}

export type EmailTemplate = {
    id: string
    name: string
    description?: string | null
    thumbnail?: string | null
    category: string
    content?: any
    isPublic: boolean
    createdBy?: string | null
    createdAt: string
}

export const getEmailCampaigns = async (subaccountId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('EmailCampaign')
        .select('*')
        .eq('subAccountId', subaccountId)
        .order('createdAt', { ascending: false })

    if (error) {
        console.error('Error fetching email campaigns:', error)
        return []
    }
    return data as EmailCampaign[]
}

export const getEmailCampaign = async (campaignId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('EmailCampaign')
        .select('*')
        .eq('id', campaignId)
        .single()

    if (error) {
        console.error('Error fetching email campaign:', error)
        return null
    }
    return data as EmailCampaign
}

export const upsertEmailCampaign = async (campaign: Partial<EmailCampaign>) => {
    const supabase = createClient()
    const payload = {
        ...campaign,
        updatedAt: new Date().toISOString(),
    }

    if (!payload.id) {
        payload.id = v4()
        payload.createdAt = new Date().toISOString()
    }

    const { data, error } = await supabase
        .from('EmailCampaign')
        .upsert(payload)
        .select()
        .single()

    if (error) {
        console.error('Error upserting email campaign:', error)
        throw new Error('Failed to save email campaign')
    }

    revalidatePath(`/subaccount/${campaign.subAccountId}/campaigns/builder/email-builder`)
    return data as EmailCampaign
}

export const deleteEmailCampaign = async (campaignId: string, subaccountId: string) => {
    const supabase = createClient()
    const { error } = await supabase
        .from('EmailCampaign')
        .delete()
        .eq('id', campaignId)

    if (error) {
        console.error('Error deleting email campaign:', error)
        throw new Error('Failed to delete email campaign')
    }

    revalidatePath(`/subaccount/${subaccountId}/campaigns/builder/email-builder`)
    return true
}

export const getEmailTemplates = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('EmailTemplate')
        .select('*')
        .eq('isPublic', true)
        .order('createdAt', { ascending: false })

    if (error) {
        console.error('Error fetching email templates:', error)
        return []
    }
    return data as EmailTemplate[]
}
