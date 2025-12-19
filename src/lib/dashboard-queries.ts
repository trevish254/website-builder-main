'use server'

import { getUser as getAuthUser, createClient } from './supabase/server'
import { v4 } from 'uuid'
import { revalidatePath } from 'next/cache'

type AnyRecord = Record<string, any>

// ============================================
// Dashboard Management Queries
// ============================================

/**
 * Get all dashboards for a user with optional filtering
 * @param userId - User ID
 * @param filter - Filter type: 'all' | 'my' | 'assigned' | 'private' | 'favorites'
 */
export const getUserDashboards = async (
    userId: string,
    filter: 'all' | 'my' | 'assigned' | 'private' | 'favorites' = 'all'
) => {
    const supabase = createClient()
    try {
        let query = supabase
            .from('Dashboard')
            .select(`
        *,
        DashboardCard (*)
      `)
            .order('lastAccessedAt', { ascending: false })

        switch (filter) {
            case 'my':
                query = query.eq('userId', userId)
                break
            case 'assigned':
                // Get dashboards shared with this user
                const { data: shares } = await supabase
                    .from('DashboardShare')
                    .select('dashboardId')
                    .eq('sharedWithUserId', userId)

                const sharedIds = shares?.map(s => s.dashboardId) || []
                if (sharedIds.length > 0) {
                    query = query.in('id', sharedIds)
                } else {
                    return [] // No shared dashboards
                }
                break
            case 'private':
                query = query.eq('userId', userId).eq('isPrivate', true)
                break
            case 'favorites':
                query = query.eq('userId', userId).eq('isFavorite', true)
                break
            case 'all':
            default:
                // Get user's own dashboards OR dashboards shared with them
                const { data: userShares } = await supabase
                    .from('DashboardShare')
                    .select('dashboardId')
                    .eq('sharedWithUserId', userId)

                const allSharedIds = userShares?.map(s => s.dashboardId) || []

                // Combine user's dashboards and shared dashboards
                query = query.or(`userId.eq.${userId},id.in.(${allSharedIds.join(',')})`)
                break
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching dashboards:', error)
            return []
        }

        return data || []
    } catch (error) {
        console.error('Error in getUserDashboards:', error)
        return []
    }
}

/**
 * Get a single dashboard by ID with all its cards
 */
export const getDashboardById = async (dashboardId: string) => {
    const supabase = createClient()
    try {
        const { data, error } = await supabase
            .from('Dashboard')
            .select(`
        *,
        DashboardCard (*),
        DashboardShare (
          *,
          User (
            id,
            name,
            email,
            avatarUrl
          )
        )
      `)
            .eq('id', dashboardId)
            .single()

        if (error) {
            console.error('Error fetching dashboard:', error)
            return null
        }

        return data
    } catch (error) {
        console.error('Error in getDashboardById:', error)
        return null
    }
}

/**
 * Create a new dashboard
 */
export const createDashboard = async (dashboardData: {
    userId: string
    agencyId?: string | null
    subAccountId?: string | null
    name: string
    description?: string
    isDefault?: boolean
    isPrivate?: boolean
    isFavorite?: boolean
}) => {
    const supabase = createClient()
    try {
        // If setting as default, unset other defaults for this user
        if (dashboardData.isDefault) {
            const defaultUpdate = await supabase
                .from('Dashboard')
                .update({ isDefault: false } as AnyRecord)
                .eq('userId', dashboardData.userId)
            console.log('🔍 [createDashboard] Reset defaults result:', defaultUpdate)
        }

        // DEBUG: Deep Check auth state
        const authResponse = await supabase.auth.getUser()
        const user = authResponse.data.user

        console.log('🔍 [createDashboard] FULL AUTH DEBUG:', {
            hasUser: !!user,
            userId: user?.id,
            userEmail: user?.email,
            userRole: user?.role,
            sessionError: authResponse.error,
            payloadUserId: dashboardData.userId,
            cookies: 'Attempted access'
        })

        if (!user) {
            console.error('❌ [createDashboard] No authenticated user found. Auth Error:', authResponse.error)
            // If no user, we can't create a dashboard under 'undefined', RLS simply blocks it.
            // Returning early with helpful error.
            return null
        }

        if (user.id !== dashboardData.userId) {
            console.warn('⚠️ [createDashboard] User ID mismatch: Session', user.id, 'vs Payload', dashboardData.userId, '- Defaulting to session ID')
            dashboardData.userId = user.id
        }

        const newDashboard = {
            id: v4(),
            userId: user.id, // FORCE use of session user ID
            agencyId: dashboardData.agencyId || null,
            subAccountId: dashboardData.subAccountId || null,
            name: dashboardData.name,
            description: dashboardData.description || null,
            isDefault: dashboardData.isDefault || false,
            isPrivate: dashboardData.isPrivate !== undefined ? dashboardData.isPrivate : true,
            isFavorite: dashboardData.isFavorite || false,
            lastAccessedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        console.log('🔍 [createDashboard] Attempting INSERT:', JSON.stringify(newDashboard, null, 2))

        const { data, error } = await supabase
            .from('Dashboard')
            .insert(newDashboard as AnyRecord)
            .select()
            .single()

        if (error) {
            console.error('❌ [createDashboard] INSERT FAILED:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            })
            // console.log('Checking if table exists...')
            // const { error: tableError } = await supabase.from('Dashboard').select('count').limit(1)
            // console.log('Table check:', tableError)
            return null
        }

        revalidatePath('/dashboards')
        return data
    } catch (error) {
        console.error('Error in createDashboard:', error)
        return null
    }
}

/**
 * Update dashboard metadata
 */
export const updateDashboard = async (
    dashboardId: string,
    updates: {
        name?: string
        description?: string
        isDefault?: boolean
        isPrivate?: boolean
        isFavorite?: boolean
        lastAccessedAt?: string
    }
) => {
    const supabase = createClient()
    try {
        // If setting as default, get the dashboard's userId first
        if (updates.isDefault) {
            const { data: dashboard } = await supabase
                .from('Dashboard')
                .select('userId')
                .eq('id', dashboardId)
                .single()

            if (dashboard) {
                // Unset other defaults for this user
                await supabase
                    .from('Dashboard')
                    .update({ isDefault: false } as AnyRecord)
                    .eq('userId', dashboard.userId)
            }
        }

        const { data, error } = await supabase
            .from('Dashboard')
            .update({
                ...updates,
                updatedAt: new Date().toISOString(),
            } as AnyRecord)
            .eq('id', dashboardId)
            .select()
            .single()

        if (error) {
            console.error('Error updating dashboard:', error)
            return null
        }

        revalidatePath('/dashboards')
        revalidatePath(`/dashboards/${dashboardId}`)
        return data
    } catch (error) {
        console.error('Error in updateDashboard:', error)
        return null
    }
}

/**
 * Delete a dashboard (prevents deleting default dashboard)
 */
export const deleteDashboard = async (dashboardId: string) => {
    const supabase = createClient()
    try {
        // Check if it's a default dashboard
        const { data: dashboard } = await supabase
            .from('Dashboard')
            .select('isDefault, userId')
            .eq('id', dashboardId)
            .single()

        if (dashboard?.isDefault) {
            console.error('Cannot delete default dashboard')
            return { success: false, error: 'Cannot delete default dashboard' }
        }

        const { error } = await supabase
            .from('Dashboard')
            .delete()
            .eq('id', dashboardId)

        if (error) {
            console.error('Error deleting dashboard:', error)
            return { success: false, error: error.message }
        }

        revalidatePath('/dashboards')
        return { success: true }
    } catch (error) {
        console.error('Error in deleteDashboard:', error)
        return { success: false, error: 'Failed to delete dashboard' }
    }
}

/**
 * Set a dashboard as the user's default
 */
export const setDefaultDashboard = async (userId: string, dashboardId: string) => {
    const supabase = createClient()
    try {
        // Unset all defaults for this user
        await supabase
            .from('Dashboard')
            .update({ isDefault: false } as AnyRecord)
            .eq('userId', userId)

        // Set new default
        const { data, error } = await supabase
            .from('Dashboard')
            .update({ isDefault: true, updatedAt: new Date().toISOString() } as AnyRecord)
            .eq('id', dashboardId)
            .eq('userId', userId)
            .select()
            .single()

        if (error) {
            console.error('Error setting default dashboard:', error)
            return null
        }

        revalidatePath('/dashboards')
        return data
    } catch (error) {
        console.error('Error in setDefaultDashboard:', error)
        return null
    }
}

/**
 * Toggle dashboard favorite status
 */
export const toggleFavoriteDashboard = async (dashboardId: string) => {
    const supabase = createClient()
    try {
        const { data: dashboard } = await supabase
            .from('Dashboard')
            .select('isFavorite')
            .eq('id', dashboardId)
            .single()

        if (!dashboard) return null

        const { data, error } = await supabase
            .from('Dashboard')
            .update({
                isFavorite: !dashboard.isFavorite,
                updatedAt: new Date().toISOString()
            } as AnyRecord)
            .eq('id', dashboardId)
            .select()
            .single()

        if (error) {
            console.error('Error toggling favorite:', error)
            return null
        }

        revalidatePath('/dashboards')
        return data
    } catch (error) {
        console.error('Error in toggleFavoriteDashboard:', error)
        return null
    }
}

/**
 * Share a dashboard with another user
 */
export const shareDashboard = async (
    dashboardId: string,
    sharedWithUserId: string,
    permission: 'view' | 'edit' = 'view'
) => {
    const supabase = createClient()
    try {
        const share = {
            id: v4(),
            dashboardId,
            sharedWithUserId,
            permission,
            createdAt: new Date().toISOString(),
        }

        const { data, error } = await supabase
            .from('DashboardShare')
            .insert(share as AnyRecord)
            .select()
            .single()

        if (error) {
            console.error('Error sharing dashboard:', error)
            return null
        }

        revalidatePath('/dashboards')
        revalidatePath(`/dashboards/${dashboardId}`)
        return data
    } catch (error) {
        console.error('Error in shareDashboard:', error)
        return null
    }
}

/**
 * Remove dashboard share
 */
export const removeDashboardShare = async (shareId: string) => {
    const supabase = createClient()
    try {
        const { error } = await supabase
            .from('DashboardShare')
            .delete()
            .eq('id', shareId)

        if (error) {
            console.error('Error removing share:', error)
            return { success: false }
        }

        revalidatePath('/dashboards')
        return { success: true }
    } catch (error) {
        console.error('Error in removeDashboardShare:', error)
        return { success: false }
    }
}

/**
 * Create a dashboard card
 */
export const createDashboardCard = async (cardData: {
    dashboardId: string
    cardType: string
    positionX?: number
    positionY?: number
    width?: number
    height?: number
    config?: any
    order?: number
}) => {
    const supabase = createClient()
    try {
        const newCard = {
            id: v4(),
            dashboardId: cardData.dashboardId,
            cardType: cardData.cardType,
            positionX: cardData.positionX || 0,
            positionY: cardData.positionY || 0,
            width: cardData.width || 4,
            height: cardData.height || 4,
            config: cardData.config || {},
            order: cardData.order || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        const { data, error } = await supabase
            .from('DashboardCard')
            .insert(newCard as AnyRecord)
            .select()
            .single()

        if (error) {
            console.error('Error creating dashboard card:', error)
            return null
        }

        revalidatePath(`/dashboards/${cardData.dashboardId}`)
        return data
    } catch (error) {
        console.error('Error in createDashboardCard:', error)
        return null
    }
}

/**
 * Update dashboard card
 */
export const updateDashboardCard = async (
    cardId: string,
    updates: {
        positionX?: number
        positionY?: number
        width?: number
        height?: number
        config?: any
        order?: number
    }
) => {
    const supabase = createClient()
    try {
        const { data, error } = await supabase
            .from('DashboardCard')
            .update({
                ...updates,
                updatedAt: new Date().toISOString(),
            } as AnyRecord)
            .eq('id', cardId)
            .select()
            .single()

        if (error) {
            console.error('Error updating dashboard card:', error)
            return null
        }

        // Get dashboard ID for revalidation
        if (data) {
            revalidatePath(`/dashboards/${data.dashboardId}`)
        }

        return data
    } catch (error) {
        console.error('Error in updateDashboardCard:', error)
        return null
    }
}

/**
 * Delete a dashboard card
 */
export const deleteDashboardCard = async (cardId: string) => {
    const supabase = createClient()
    try {
        const { error } = await supabase
            .from('DashboardCard')
            .delete()
            .eq('id', cardId)

        if (error) {
            console.error('Error deleting dashboard card:', error)
            return { success: false }
        }

        return { success: true }
    } catch (error) {
        console.error('Error in deleteDashboardCard:', error)
        return { success: false }
    }
}

/**
 * Get all dashboard templates
 */
export const getDashboardTemplates = async () => {
    const supabase = createClient()
    try {
        const { data, error } = await supabase
            .from('DashboardTemplate')
            .select('*')
            .eq('isPublic', true)
            .order('category')

        if (error) {
            console.error('Error fetching templates:', error)
            return []
        }

        return data || []
    } catch (error) {
        console.error('Error in getDashboardTemplates:', error)
        return []
    }
}

/**
 * Create default dashboard for new user
 */
export const createDefaultDashboard = async (
    userId: string,
    agencyId?: string | null,
    subAccountId?: string | null
) => {
    const supabase = createClient()
    try {
        // Check if user already has a default dashboard
        const { data: existing } = await supabase
            .from('Dashboard')
            .select('id')
            .eq('userId', userId)
            .eq('isDefault', true)
            .single()

        if (existing) {
            console.log('User already has a default dashboard')
            return existing
        }

        // Create default dashboard
        const dashboard = await createDashboard({
            userId,
            agencyId,
            subAccountId,
            name: 'Default Dashboard',
            description: 'Your main dashboard',
            isDefault: true,
            isPrivate: true,
            isFavorite: true,
        })

        if (!dashboard) return null

        // Add default cards
        const defaultCards = [
            {
                dashboardId: dashboard.id,
                cardType: 'count',
                positionX: 0,
                positionY: 0,
                width: 3,
                height: 2,
                config: { title: 'Total Income', metric: 'income', icon: 'dollar' },
                order: 0,
            },
            {
                dashboardId: dashboard.id,
                cardType: 'count',
                positionX: 3,
                positionY: 0,
                width: 3,
                height: 2,
                config: { title: 'Active Clients', metric: 'clients', icon: 'users' },
                order: 1,
            },
            {
                dashboardId: dashboard.id,
                cardType: 'graph',
                positionX: 0,
                positionY: 2,
                width: 6,
                height: 4,
                config: { title: 'Revenue Over Time', chartType: 'line', dataSource: 'revenue' },
                order: 2,
            },
            {
                dashboardId: dashboard.id,
                cardType: 'list',
                positionX: 6,
                positionY: 0,
                width: 6,
                height: 6,
                config: { title: 'Recent Activity', dataSource: 'activity', limit: 10 },
                order: 3,
            },
        ]

        for (const card of defaultCards) {
            await createDashboardCard(card)
        }

        return dashboard
    } catch (error) {
        console.error('Error in createDefaultDashboard:', error)
        return null
    }
}

/**
 * Get user's default dashboard
 */
export const getDefaultDashboard = async (userId: string) => {
    const supabase = createClient()
    try {
        const { data, error } = await supabase
            .from('Dashboard')
            .select('*')
            .eq('userId', userId)
            .eq('isDefault', true)
            .single()

        if (error || !data) {
            // No default dashboard, return the most recently accessed one
            const { data: recent } = await supabase
                .from('Dashboard')
                .select('*')
                .eq('userId', userId)
                .order('lastAccessedAt', { ascending: false })
                .limit(1)
                .single()

            return recent
        }

        return data
    } catch (error) {
        console.error('Error in getDefaultDashboard:', error)
        return null
    }
}

/**
 * Populate a dashboard with default cards
 */
export const populateDashboardWithDefaults = async (dashboardId: string) => {
    try {
        const defaultCards = [
            {
                dashboardId,
                cardType: 'count',
                positionX: 0,
                positionY: 0,
                width: 3,
                height: 2,
                config: { title: 'Total Income', metric: 'income', icon: 'dollar' },
                order: 0,
            },
            {
                dashboardId,
                cardType: 'count',
                positionX: 3,
                positionY: 0,
                width: 3,
                height: 2,
                config: { title: 'Active Clients', metric: 'clients', icon: 'users' },
                order: 1,
            },
            {
                dashboardId,
                cardType: 'graph',
                positionX: 0,
                positionY: 2,
                width: 6,
                height: 4,
                config: { title: 'Revenue Over Time', chartType: 'line', dataSource: 'revenue' },
                order: 2,
            },
            {
                dashboardId,
                cardType: 'list',
                positionX: 6,
                positionY: 0,
                width: 6,
                height: 6,
                config: { title: 'Recent Activity', dataSource: 'activity', limit: 10 },
                order: 3,
            },
        ]

        for (const card of defaultCards) {
            await createDashboardCard(card)
        }

        revalidatePath(`/dashboards/${dashboardId}`)
        return { success: true }
    } catch (error) {
        console.error('Error populating dashboard:', error)
        return { success: false, error: 'Failed to populate dashboard' }
    }
}
