'use server'

import { getUser as getAuthUser, createClient } from './supabase/server'
import { supabase, supabaseAdmin } from './supabase'
import { redirect } from 'next/navigation'
import { v4 } from 'uuid'
import {
  CreateFunnelFormSchema,
  CreateMediaType,
  UpsertFunnelPage,
} from './types'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { cache } from 'react'
import { paystack } from './paystack'

// Type helper to avoid 'never' type issues
type AnyRecord = Record<string, any>

export const getAuthUserDetails = cache(async () => {
  try {
    const user = await getAuthUser()
    if (!user) {
      console.log('ℹ️ No user found in getAuthUserDetails')
      return
    }

    try {
      const { data, error } = await supabase
        .from('User')
        .select(`
        id,
        name,
        avatarUrl,
        email,
        role,
        agencyId,
        createdAt,
        updatedAt,
        Agency (
          id,
          name,
          agencyLogo,
          address,
          companyEmail,
          companyPhone,
          goal,
          createdAt,
          updatedAt,
          Subscription (*),
          AgencySidebarOption (
            id,
            name,
            link,
            icon,
            agencyId,
            createdAt,
            updatedAt
          ),
          SubAccount (
            id,
            name,
            subAccountType,
            companyName,
            subAccountLogo,
            address,
            companyEmail,
            companyPhone,
            goal,
            agencyId,
            createdAt,
            updatedAt,
            SubAccountSidebarOption (
              id,
              name,
              link,
              icon,
              subAccountId,
              createdAt,
              updatedAt
            )
          )
        ),
        Permissions (
          id,
          email,
          subAccountId,
          access,
          SubAccount (
            id,
            name,
            subAccountType,
            companyName,
            subAccountLogo,
            agencyId,
            SubAccountSidebarOption (*)
          )
        )
      `)
        .eq('email', user.email || '')
        .single()

      if (error) {
        // PGRST116 means no rows found - this is expected for new users
        if (error.code === 'PGRST116') {
          console.log('ℹ️ User not found in database yet - this is normal for new signups')
          return null
        }
        console.error('Error fetching user details:', error)
        return null
      }

      // If user has an agency but no sidebar options, create them
      const agency = (data as AnyRecord)?.Agency as AnyRecord | null
      if (agency && (!agency.AgencySidebarOption || agency.AgencySidebarOption.length === 0)) {
        console.log('🔧 Creating missing sidebar options for existing agency')
        await createDefaultSidebarOptions(agency.id)

        // Refetch user details to get the new sidebar options
        const { data: updatedData, error: refetchError } = await supabase
          .from('User')
          .select(`
            *,
            Agency (
              *,
              Subscription (*),
              AgencySidebarOption (*),
              SubAccount (
                *,
                SubAccountSidebarOption (*)
              )
            ),
            Permissions (*)
          `)
          .eq('email', user.email || '')
          .single()

        if (!refetchError && updatedData) {
          return updatedData
        }
      }

      // Check if agency has sidebar options but is missing Messages or Government Services
      if (agency && agency.AgencySidebarOption && agency.AgencySidebarOption.length > 0) {
        const hasMessages = agency.AgencySidebarOption.some(
          (option: any) => option.name === 'Messages'
        )
        const hasGovernmentServices = agency.AgencySidebarOption.some(
          (option: any) => option.name === 'Government Services'
        )

        let shouldRefetch = false

        if (!hasMessages) {
          console.log('🔧 Adding Messages to existing agency sidebar options')
          await addMessagesToExistingAgency(agency.id)
          shouldRefetch = true
        }

        if (!hasGovernmentServices) {
          console.log('🔧 Adding Government Services to existing agency sidebar options')
          await addGovernmentServicesToExistingAgency(agency.id)
          await addGovernmentServicesToExistingAgency(agency.id)
          shouldRefetch = true
        }

        const hasFinance = agency.AgencySidebarOption.some(
          (option: any) => option.name === 'Finance'
        )

        if (!hasFinance) {
          console.log('🔧 Adding Finance to existing agency sidebar options')
          await addFinanceToExistingAgency(agency.id)
          shouldRefetch = true
        }

        if (shouldRefetch) {
          // Refetch user details to get the updated sidebar options
          const { data: updatedData, error: refetchError } = await supabase
            .from('User')
            .select(`
              *,
              Agency (
                *,
                Subscription (*),
                AgencySidebarOption (*),
                SubAccount (
                  *,
                  SubAccountSidebarOption (*)
                )
              ),
              Permissions (*)
            `)
            .eq('email', user.email || '')
            .single()

          if (!refetchError && updatedData) {
            return updatedData
          }
        }
      }

      // Check for missing subaccount sidebar options and create them
      // Check for missing subaccount sidebar options and create them
      if (agency && agency.SubAccount) {
        const subAccounts = agency.SubAccount as AnyRecord[]
        let shouldRefetchSubAccount = false

        for (const subAccount of subAccounts) {
          if (!subAccount.SubAccountSidebarOption || subAccount.SubAccountSidebarOption.length === 0) {
            console.log('🔧 Creating missing sidebar options for subaccount:', subAccount.id)
            await createDefaultSubAccountSidebarOptions(subAccount.id)
            shouldRefetchSubAccount = true
          } else {
            // Check for malformed links and fix them
            const expectedLinks: Record<string, string> = {
              'Funnels': `/subaccount/${subAccount.id}/funnels`,
              'Pipelines': `/subaccount/${subAccount.id}/pipelines`,
              'Contacts': `/subaccount/${subAccount.id}/contacts`,
              'Media': `/subaccount/${subAccount.id}/media`,
              'Automations': `/subaccount/${subAccount.id}/automations`,
              'Settings': `/subaccount/${subAccount.id}/settings`,
            }

            for (const option of subAccount.SubAccountSidebarOption) {
              const expectedLink = expectedLinks[option.name]
              if (expectedLink && option.link !== expectedLink) {
                console.log(`🔧 Fixing malformed ${option.name} link for subaccount:`, subAccount.id)
                await supabase
                  .from('SubAccountSidebarOption')
                  .update({ link: expectedLink } as AnyRecord)
                  .eq('id', option.id)
                shouldRefetchSubAccount = true
              }
            }

            const hasFinance = subAccount.SubAccountSidebarOption.some(
              (option: any) => option.name === 'Finance'
            )

            if (!hasFinance) {
              console.log('🔧 Adding Finance to existing subaccount sidebar options')
              await addFinanceToExistingSubAccount(subAccount.id)
              shouldRefetchSubAccount = true
            }

            const hasWebsites = subAccount.SubAccountSidebarOption.some(
              (option: any) => option.name === 'Websites'
            )

            if (!hasWebsites) {
              console.log('🔧 Adding Websites to existing subaccount sidebar options')
              await addWebsitesToExistingSubAccount(subAccount.id)
              shouldRefetchSubAccount = true
            }

            const hasOrders = subAccount.SubAccountSidebarOption.some(
              (option: any) => option.name === 'Orders'
            )

            if (!hasOrders) {
              console.log('🔧 Adding Orders to existing subaccount sidebar options')
              await addOrdersToExistingSubAccount(subAccount.id)
              shouldRefetchSubAccount = true
            }
          }
        }

        if (shouldRefetchSubAccount) {
          console.log('🔄 Refetching user details to include new subaccount sidebar options')
          const { data: updatedData, error: refetchError } = await supabase
            .from('User')
            .select(`
              *,
              Agency (
                *,
                Subscription (*),
                AgencySidebarOption (*),
                SubAccount (
                  *,
                  SubAccountSidebarOption (*)
                )
              ),
              Permissions (*)
            `)
            .eq('email', user.email || '')
            .single()

          if (!refetchError && updatedData) {
            return updatedData
          }
        }
      }

      // Fetch agencies where the user is an invited member
      const { data: invitations } = await supabase
        .from('Invitation')
        .select('agencyId, role')
        .eq('email', user.email || '')
        .eq('status', 'ACCEPTED')

      const invitedAgencyIds = invitations?.map((i) => i.agencyId) || []
      let invitedAgencies: any[] = []

      if (invitedAgencyIds.length > 0) {
        const { data: agencies } = await supabase
          .from('Agency')
          .select(`
            id,
            name,
            agencyLogo,
            address,
            AgencySidebarOption (
              id,
              name,
              link,
              icon,
              agencyId
            )
          `)
          .in('id', invitedAgencyIds)

        invitedAgencies = agencies?.map((agency) => {
          const invite = invitations?.find((i) => i.agencyId === agency.id)
          return { ...agency, role: invite?.role }
        }) || []
      }

      return {
        ...data,
        InvitedAgencies: invitedAgencies
      }


    } catch (dbError) {
      console.error('Database connection failed for user details:', dbError)
      // Return null to trigger agency creation flow
      return null
    }
  } catch (clerkError) {
    console.error('❌ Error in getAuthUserDetails (likely Clerk):', clerkError)
    return null
  }
})

export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subaccountId,
}: {
  agencyId: string
  description: string
  subaccountId?: string
}) => {
  const user = await getAuthUser()
  if (!user) return

  // Skip notification creation if no valid agencyId
  if (!agencyId || agencyId === '') {
    console.log('Skipping notification creation - no agencyId provided')
    return null
  }

  const { data, error } = await supabase
    .from('Notification')
    .insert({
      id: v4(),
      notification: description,
      agencyId,
      subAccountId: subaccountId || null,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as AnyRecord)
    .select()
    .single()

  if (error) {
    console.error('Error creating notification:', error)
  }

  return data
}

export const createTeamUser = async (agencyId: string, userData: any) => {
  if (userData.role === 'AGENCY_OWNER') return null

  const { data, error } = await supabase
    .from('User')
    .insert(userData)
    .select()
    .single()

  if (error) {
    console.error('Error creating team user:', error)
    return null
  }

  return data
}

export const verifyAndAcceptInvitation = async () => {
  const user = await getAuthUser()
  if (!user) return null

  const { data: invitation } = await supabase
    .from('Invitation')
    .select('*')
    .eq('email', user.email)
    .eq('status', 'PENDING')
    .single()

  if (invitation) {
    const invitationData = invitation as AnyRecord

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('User')
      .select('*')
      .eq('email', user.email)
      .single()

    if (existingUser) {
      // CRITICAL: Only update agencyId for AGENCY_OWNER/ADMIN invitations
      // SUBACCOUNT users should keep their original agencyId
      const isAgencyRole = invitationData.role === 'AGENCY_OWNER' || invitationData.role === 'AGENCY_ADMIN'

      if (isAgencyRole) {
        // User is joining as agency staff - update their agencyId
        const { error: updateError } = await supabase
          .from('User')
          .update({
            agencyId: invitationData.agencyId,
            role: invitationData.role,
            updatedAt: new Date().toISOString()
          } as AnyRecord)
          .eq('id', user.id)

        if (updateError) {
          console.error('Error updating user agency:', updateError)
        }
      }
      // For SUBACCOUNT roles, don't update agencyId - they access via Permissions table

      // Accept the invitation
      await supabase
        .from('Invitation')
        .update({ status: 'ACCEPTED' } as AnyRecord)
        .eq('id', invitation.id)

      await saveActivityLogsNotification({
        agencyId: invitationData?.agencyId,
        description: `Joined`,
        subaccountId: undefined,
      })

      return invitationData.agencyId
    }

    // User doesn't exist, create new user
    const userDetails = await createTeamUser(invitationData.agencyId, {
      email: invitationData.email,
      agencyId: invitationData.agencyId,
      avatarUrl: user.user_metadata.avatar_url,
      id: user.id,
      name: user.user_metadata.full_name || `${user.user_metadata.name || ''} `,
      role: invitationData.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await saveActivityLogsNotification({
      agencyId: invitationData?.agencyId,
      description: `Joined`,
      subaccountId: undefined,
    })

    if (userDetails) {
      const userDetailsData = userDetails as AnyRecord
      // Update Supabase user metadata instead of Clerk
      const supabaseClient = createClient()
      await supabaseClient.auth.updateUser({
        data: {
          role: userDetailsData.role || 'SUBACCOUNT_USER',
        }
      })

      await supabase
        .from('Invitation')
        .delete()
        .eq('email', userDetailsData.email)

      return userDetailsData.agencyId
    } else return null
  } else {
    const { data: agency } = await supabase
      .from('User')
      .select('agencyId')
      .eq('email', user.email)
      .maybeSingle()

    return agency ? (agency as AnyRecord)?.agencyId || null : null
  }
}

export const updateAgencyDetails = async (
  agencyId: string,
  agencyDetails: Partial<any>
) => {
  const { data, error } = await supabase
    .from('Agency')
    .update(agencyDetails as AnyRecord)
    .eq('id', agencyId)
    .select()
    .single()

  if (error) {
    console.error('Error updating agency details:', error)
    return null
  }

  return data
}


export const deleteAgency = async (agencyId: string) => {
  const { error } = await supabase
    .from('Agency')
    .delete()
    .eq('id', agencyId)

  if (error) {
    console.error('Error deleting agency:', error)
    return false
  }

  return true
}

export const getConversationsWithParticipants = async (
  userId: string,
  opts: { subAccountId?: string } = {}
) => {
  const user = await getAuthUser()
  if (!user) return []

  try {
    // 1. Get conversation IDs where user is a participant
    const { data: userParticipations, error: partError } = await supabaseAdmin
      .from('ConversationParticipant')
      .select('conversationId')
      .eq('userId', userId)

    if (partError) {
      console.error('[QUERY] Error fetching user conversations:', partError)
      return []
    }

    const conversationIds = userParticipations?.map((p) => p.conversationId) || []
    if (conversationIds.length === 0) return []

    // 2. Fetch conversations
    let query = supabaseAdmin
      .from('Conversation')
      .select('*')
      .in('id', conversationIds)
      .order('lastMessageAt', { ascending: false })

    if (opts.subAccountId) query = query.eq('subAccountId', opts.subAccountId)

    const { data: conversations, error: convError } = await query

    if (convError) {
      console.error('[QUERY] Error fetching conversations:', convError)
      return []
    }

    // 3. Fetch all participants
    const { data: allParticipants, error: partDetailError } = await supabaseAdmin
      .from('ConversationParticipant')
      .select('conversationId, userId, joinedAt, lastReadAt, role')
      .in('conversationId', conversationIds)

    if (partDetailError) {
      console.error('[QUERY] Error fetching participants:', partDetailError)
      return []
    }

    // 4. Fetch user details for all participants
    const userIds = Array.from(new Set(allParticipants?.map((p) => p.userId) || []))
    const { data: allUsers, error: userError } = await supabaseAdmin
      .from('User')
      .select('id, name, email, avatarUrl')
      .in('id', userIds)

    if (userError) {
      console.error('[QUERY] Error fetching user details:', userError)
      return []
    }

    const userMap = new Map(allUsers?.map((u) => [u.id, u]))

    // 5. Fetch all messages (or counts) for these conversations to calculate unread status
    // Optimization: In a real app with many messages, you'd use a grouped count query.
    // For now, we'll fetch messages from the last 7 days or similar to calculate unread counts.
    const { data: allRecentMessages } = await supabaseAdmin
      .from('Message')
      .select('id, conversationId, createdAt, senderId, content')
      .in('conversationId', conversationIds)
      .order('createdAt', { ascending: false })
      .limit(1000)

    // 6. Map everything together
    const result = conversations?.map((conv) => {
      const participants = allParticipants?.filter((p: any) => p.conversationId === conv.id) || []
      const participantsWithUsers = participants.map((p: any) => ({
        ...p,
        User: userMap.get(p.userId) || null
      }))

      const me = participants.find((p: any) => p.userId === userId)
      const lastReadAt = me?.lastReadAt ? new Date(me.lastReadAt).getTime() : 0

      const convMessages = allRecentMessages?.filter((m: any) => m.conversationId === conv.id) || []
      const lastMessage = convMessages[0]

      const unreadCount = convMessages.filter((m: any) => {
        const msgTime = new Date(m.createdAt).getTime()
        return m.senderId !== userId && msgTime > lastReadAt
      }).length

      return {
        ...conv,
        ConversationParticipant: participantsWithUsers,
        Message: lastMessage ? [lastMessage] : [],
        unreadCount
      }
    })

    return result || []
  } catch (error) {
    console.error('[QUERY] Error in getConversationsWithParticipants:', error)
    return []
  }
}

export const getMessagesForConversation = async (conversationIds: string | string[], limit = 50) => {
  let query = supabaseAdmin
    .from('Message')
    .select('*')
    .order('createdAt', { ascending: true })
    .limit(limit)

  if (Array.isArray(conversationIds)) {
    query = query.in('conversationId', conversationIds)
  } else {
    query = query.eq('conversationId', conversationIds)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return data
}

export const sendMessage = async (payload: {
  conversationId: string
  senderId: string
  content: string
  type?: string
  metadata?: Record<string, unknown> | null
}) => {
  const messageData = {
    id: v4(),
    conversationId: payload.conversationId,
    senderId: payload.senderId,
    content: payload.content,
    type: payload.type || 'text',
    metadata: payload.metadata || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isEdited: false,
  }

  const { data, error } = await supabaseAdmin
    .from('Message')
    .insert(messageData)
    .select()
    .single()

  if (error) {
    console.error('Error sending message:', error)
    return null
  }

  // Update conversation lastMessageAt
  await supabaseAdmin
    .from('Conversation')
    .update({ lastMessageAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    .eq('id', payload.conversationId)

  return data
}

export const initUser = async (newUser: Partial<any>) => {
  try {
    // Get current user from Supabase to get proper user data
    const user = await getAuthUser()
    if (!user) {
      console.error('No current user found for initialization')
      return null
    }

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('User')
      .select('*')
      .eq('id', user.id)
      .single()

    if (existingUser) {
      // User exists, update with agency information if provided
      if (newUser.agencyId) {
        const { data: updatedUser, error: updateError } = await supabase
          .from('User')
          .update({
            agencyId: newUser.agencyId,
            role: newUser.role || 'AGENCY_OWNER',
            updatedAt: new Date().toISOString(),
          } as AnyRecord)
          .eq('id', user.id)
          .select()
          .single()

        if (updateError) {
          console.error('Error updating user:', updateError)
          return existingUser // Return existing user data
        }
        return updatedUser
      }
      return existingUser
    }

    // User doesn't exist, create new user
    const userData = {
      id: user.id,
      name: user.user_metadata.full_name || `${user.user_metadata.name || ''} `.trim() || 'User',
      avatarUrl: user.user_metadata.avatar_url || '/placeholder-avatar.png',
      email: user.email || '',
      role: newUser.role || 'AGENCY_OWNER',
      agencyId: newUser.agencyId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('User')
      .insert(userData as AnyRecord)
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return null
    }

    return data
  } catch (dbError) {
    console.error('Database connection failed for user init:', dbError)
    return null
  }
}

export const upsertAgency = async (agency: Partial<any>) => {
  console.log('🔍 upsertAgency called with:', {
    hasCompanyEmail: !!agency.companyEmail,
    companyEmail: agency.companyEmail,
    hasName: !!agency.name,
    name: agency.name,
    allKeys: Object.keys(agency),
  })

  if (!agency.companyEmail || agency.companyEmail.trim() === '') {
    console.error('❌ Agency creation failed: companyEmail is required')
    console.error('📋 Received agency object:', JSON.stringify(agency, null, 2))
    throw new Error('Company email is required')
  }

  if (!agency.name || agency.name.trim() === '') {
    console.error('❌ Agency creation failed: name is required')
    console.error('📋 Received agency object:', JSON.stringify(agency, null, 2))
    throw new Error('Agency name is required')
  }

  try {
    // First, ensure the user exists in the database
    // First, ensure the user exists in the database
    const user = await getAuthUser()
    if (!user) {
      console.error('No authenticated user found for agency creation')
      throw new Error('User authentication required')
    }

    // Create or get the user first
    const userData = await initUser({
      agencyId: null, // Will be set after agency creation
      role: 'AGENCY_OWNER',
    })

    if (!userData) {
      console.error('Failed to create/initialize user')
      return null
    }

    console.log('✅ User initialized:', userData.id)

    // Now create the agency
    const { data, error } = await supabase
      .from('Agency')
      .upsert(agency as AnyRecord)
      .select()
      .single()

    if (error) {
      console.error('Error upserting agency:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      throw new Error(`Failed to create agency: ${error.message || 'Unknown error'} `)
    }

    // After creating the agency, link the user to this agency
    if (data) {
      const agencyData = data as AnyRecord
      const { error: updateError } = await supabase
        .from('User')
        .update({
          agencyId: agencyData.id,
          role: 'AGENCY_OWNER',
          updatedAt: new Date().toISOString(),
        } as AnyRecord)
        .eq('id', user.id)

      if (updateError) {
        console.error('Error linking user to agency:', updateError)
        console.error('Update error details:', JSON.stringify(updateError, null, 2))
        // Don't fail the whole operation, but log the error
      } else {
        console.log('✅ User successfully linked to agency:', agencyData.id)
      }

      // Create default sidebar options for the agency
      await createDefaultSidebarOptions(agencyData.id)
    }

    return data
  } catch (dbError) {
    console.error('Database connection failed:', dbError)
    throw dbError // Re-throw to let the caller handle it
  }
}

export const createDefaultSidebarOptions = async (agencyId: string) => {
  try {
    const defaultOptions = [
      {
        id: `sidebar-${agencyId}-1`,
        name: 'Dashboard',
        link: `/agency/${agencyId}`,
        icon: 'home',
        agencyId: agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sidebar-${agencyId}-2`,
        name: 'Launchpad',
        link: `/agency/${agencyId}/launchpad`,
        icon: 'compass',
        agencyId: agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sidebar-${agencyId}-3`,
        name: 'Sub Accounts',
        link: `/agency/${agencyId}/all-subaccounts`,
        icon: 'person',
        agencyId: agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sidebar-${agencyId}-4`,
        name: 'Team',
        link: `/agency/${agencyId}/team`,
        icon: 'shield',
        agencyId: agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sidebar-${agencyId}-finance`,
        name: 'Finance',
        link: `/agency/${agencyId}/finance`,
        icon: 'payment',
        agencyId: agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sidebar-${agencyId}-5`,
        name: 'Current Plan',
        link: `/agency/${agencyId}/billing`,
        icon: 'rocket',
        agencyId: agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sidebar-${agencyId}-billing-available`,
        name: 'Available Plans',
        link: `/agency/${agencyId}/billing/available-plans`,
        icon: 'payment',
        agencyId: agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sidebar-${agencyId}-billing-history`,
        name: 'Billing History',
        link: `/agency/${agencyId}/billing/history`,
        icon: 'receipt',
        agencyId: agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sidebar-${agencyId}-messages`,
        name: 'Messages',
        link: `/agency/${agencyId}/messages`,
        icon: 'messages',
        agencyId: agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sidebar-${agencyId}-gov-services`,
        name: 'Government Services',
        link: `/agency/${agencyId}/government-services`,
        icon: 'shield',
        agencyId: agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sidebar-${agencyId}-7`,
        name: 'Settings',
        link: `/agency/${agencyId}/settings`,
        icon: 'settings',
        agencyId: agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    const { error: insertError } = await supabase
      .from('AgencySidebarOption')
      .insert(defaultOptions as AnyRecord[])

    if (insertError) {
      console.error('Error creating default sidebar options:', insertError)
    } else {
      console.log('✅ Default sidebar options created for agency:', agencyId)
    }
  } catch (error) {
    console.error('Error creating default sidebar options:', error)
  }
}

export const addMessagesToExistingAgency = async (agencyId: string) => {
  try {
    // Check if Messages option already exists
    const { data: existingOption, error: checkError } = await supabase
      .from('AgencySidebarOption')
      .select('id')
      .eq('agencyId', agencyId)
      .eq('name', 'Messages')
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking for existing Messages option:', checkError)
      return
    }

    // If option doesn't exist, add it
    if (!existingOption) {
      const messagesOption = {
        id: `sidebar-${agencyId}-messages`,
        name: 'Messages',
        link: `/agency/${agencyId}/messages`,
        icon: 'messages',
        agencyId: agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const { error: insertError } = await supabase
        .from('AgencySidebarOption')
        .insert(messagesOption as AnyRecord)

      if (insertError) {
        console.error('Error adding Messages option:', insertError)
      } else {
        console.log('✅ Messages option added to agency:', agencyId)
      }
    } else {
      console.log('✅ Messages option already exists for agency:', agencyId)
    }
  } catch (error) {
    console.error('Error adding Messages to existing agency:', error)
  }
}

export const addGovernmentServicesToExistingAgency = async (agencyId: string) => {
  try {
    // Check if Government Services option already exists
    const { data: existingOption, error: checkError } = await supabase
      .from('AgencySidebarOption')
      .select('id')
      .eq('agencyId', agencyId)
      .eq('name', 'Government Services')
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking for existing Government Services option:', checkError)
      return
    }

    // If option doesn't exist, add it
    if (!existingOption) {
      const governmentServicesOption = {
        id: `sidebar-${agencyId}-gov-services`,
        name: 'Government Services',
        link: `/agency/${agencyId}/government-services`,
        icon: 'shield',
        agencyId: agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const { error: insertError } = await supabase
        .from('AgencySidebarOption')
        .insert(governmentServicesOption as AnyRecord)

      if (insertError) {
        console.error('Error adding Government Services option:', insertError)
      } else {
        console.log('✅ Government Services option added to agency:', agencyId)
      }
    } else {
      console.log('✅ Government Services option already exists for agency:', agencyId)
    }
  } catch (error) {
    console.error('Error adding Government Services to existing agency:', error)
  }
}

export const addFinanceToExistingAgency = async (agencyId: string) => {
  try {
    const { data: existingOption, error: checkError } = await supabase
      .from('AgencySidebarOption')
      .select('id')
      .eq('agencyId', agencyId)
      .eq('name', 'Finance')
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing Finance option:', checkError)
      return
    }

    if (!existingOption) {
      const financeOption = {
        id: `sidebar-${agencyId}-finance`,
        name: 'Finance',
        link: `/agency/${agencyId}/finance`,
        icon: 'payment',
        agencyId: agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const { error: insertError } = await supabase
        .from('AgencySidebarOption')
        .insert(financeOption as AnyRecord)

      if (insertError) {
        console.error('Error adding Finance option:', insertError)
      } else {
        console.log('✅ Finance option added to agency:', agencyId)
      }
    }
  } catch (error) {
    console.error('Error adding Finance to existing agency:', error)
  }
}

export const createDefaultSubAccountSidebarOptions = async (subAccountId: string) => {
  try {
    const defaultOptions = [
      {
        id: `sub-sidebar-${subAccountId}-1`,
        name: 'Overview',
        link: `/subaccount/${subAccountId}`,
        icon: 'home',
        subAccountId: subAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sub-sidebar-${subAccountId}-2`,
        name: 'Funnels',
        link: `/subaccount/${subAccountId}/funnels`,
        icon: 'pipelines',
        subAccountId: subAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sub-sidebar-${subAccountId}-3`,
        name: 'Pipelines',
        link: `/subaccount/${subAccountId}/pipelines`,
        icon: 'chart',
        subAccountId: subAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sub-sidebar-${subAccountId}-4`,
        name: 'Contacts',
        link: `/subaccount/${subAccountId}/contacts`,
        icon: 'person',
        subAccountId: subAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sub-sidebar-${subAccountId}-finance`,
        name: 'Finance',
        link: `/subaccount/${subAccountId}/finance`,
        icon: 'payment',
        subAccountId: subAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sub-sidebar-${subAccountId}-5`,
        name: 'Media',
        link: `/subaccount/${subAccountId}/media`,
        icon: 'database',
        subAccountId: subAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sub-sidebar-${subAccountId}-6`,
        name: 'Automations',
        link: `/subaccount/${subAccountId}/automations`,
        icon: 'settings',
        subAccountId: subAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sub-sidebar-${subAccountId}-7`,
        name: 'Settings',
        link: `/subaccount/${subAccountId}/settings`,
        icon: 'settings',
        subAccountId: subAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sub-sidebar-${subAccountId}-inventory`,
        name: 'Inventory',
        link: `/subaccount/${subAccountId}/inventory`,
        icon: 'category',
        subAccountId: subAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `sub-sidebar-${subAccountId}-orders`,
        name: 'Orders',
        link: `/subaccount/${subAccountId}/orders`,
        icon: 'clipboardIcon',
        subAccountId: subAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    const { error: insertError } = await supabase
      .from('SubAccountSidebarOption')
      .insert(defaultOptions as AnyRecord[])

    if (insertError) {
      console.error('Error creating default subaccount sidebar options:', insertError)
    } else {
      console.log('✅ Default subaccount sidebar options created for:', subAccountId)
    }
  } catch (error) {
    console.error('Error creating default subaccount sidebar options:', error)
  }
}

export const addWebsitesToExistingSubAccount = async (subAccountId: string) => {
  try {
    // Check if Websites option already exists
    const { data: existingOption, error: checkError } = await supabase
      .from('SubAccountSidebarOption')
      .select('id')
      .eq('subAccountId', subAccountId)
      .eq('name', 'Websites')
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking for existing Websites option:', checkError)
      return
    }

    // If option doesn't exist, add it
    if (!existingOption) {
      const websitesOption = {
        id: `sub-sidebar-${subAccountId}-websites`,
        name: 'Websites',
        link: `/subaccount/${subAccountId}/websites`,
        icon: 'compass',
        subAccountId: subAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const { error: insertError } = await supabase
        .from('SubAccountSidebarOption')
        .insert(websitesOption as AnyRecord)

      if (insertError) {
        console.error('Error adding Websites option:', insertError)
      } else {
        console.log('✅ Websites option added to subaccount:', subAccountId)
      }
    } else {
      console.log('✅ Websites option already exists for subaccount:', subAccountId)
    }
  } catch (error) {
    console.error('Error adding Websites to existing subaccount:', error)
  }
}

export const addOrdersToExistingSubAccount = async (subAccountId: string) => {
  try {
    // Check if Orders option already exists
    const { data: existingOption, error: checkError } = await supabase
      .from('SubAccountSidebarOption')
      .select('id')
      .eq('subAccountId', subAccountId)
      .eq('name', 'Orders')
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking for existing Orders option:', checkError)
      return
    }

    // If option doesn't exist, add it
    if (!existingOption) {
      const ordersOption = {
        id: `sub-sidebar-${subAccountId}-orders`,
        name: 'Orders',
        link: `/subaccount/${subAccountId}/orders`,
        icon: 'clipboardIcon',
        subAccountId: subAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const { error: insertError } = await supabase
        .from('SubAccountSidebarOption')
        .insert(ordersOption as AnyRecord)

      if (insertError) {
        console.error('Error adding Orders option:', insertError)
      } else {
        console.log('✅ Orders option added to subaccount:', subAccountId)
      }
    } else {
      console.log('✅ Orders option already exists for subaccount:', subAccountId)
    }
  } catch (error) {
    console.error('Error adding Orders to existing subaccount:', error)
  }
}

export const addFinanceToExistingSubAccount = async (subAccountId: string) => {
  try {
    const { data: existingOption, error: checkError } = await supabase
      .from('SubAccountSidebarOption')
      .select('id')
      .eq('subAccountId', subAccountId)
      .eq('name', 'Finance')
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing Finance option:', checkError)
      return
    }

    if (!existingOption) {
      const financeOption = {
        id: `sub-sidebar-${subAccountId}-finance`,
        name: 'Finance',
        link: `/subaccount/${subAccountId}/finance`,
        icon: 'payment',
        subAccountId: subAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const { error: insertError } = await supabase
        .from('SubAccountSidebarOption')
        .insert(financeOption as AnyRecord)

      if (insertError) {
        console.error('Error adding Finance option to subaccount:', insertError)
      } else {
        console.log('✅ Finance option added to subaccount:', subAccountId)
      }
    }
  } catch (error) {
    console.error('Error adding Finance to existing subaccount:', error)
  }
}

export const getNotificationAndUser = async (agencyId: string) => {
  const { data, error } = await supabase
    .from('Notification')
    .select(`
      *,
      User (*)
    `)
    .eq('agencyId', agencyId)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }

  return data
}

export const upsertSubAccount = async (subAccount: Partial<any>) => {
  console.log('🔍 upsertSubAccount called with:', {
    hasCompanyEmail: !!subAccount.companyEmail,
    companyEmail: subAccount.companyEmail,
    hasName: !!subAccount.name,
    name: subAccount.name,
    hasAgencyId: !!subAccount.agencyId,
    agencyId: subAccount.agencyId,
    allKeys: Object.keys(subAccount),
  })

  if (!subAccount.companyEmail || subAccount.companyEmail.trim() === '') {
    console.error('❌ Subaccount creation failed: companyEmail is required')
    console.error('📋 Received subaccount object:', JSON.stringify(subAccount, null, 2))
    throw new Error('Company email is required')
  }

  if (!subAccount.name || subAccount.name.trim() === '') {
    console.error('❌ Subaccount creation failed: name is required')
    console.error('📋 Received subaccount object:', JSON.stringify(subAccount, null, 2))
    throw new Error('Subaccount name is required')
  }

  if (!subAccount.agencyId) {
    console.error('❌ Subaccount creation failed: agencyId is required')
    throw new Error('Agency ID is required')
  }

  try {
    const { data: agencyOwner, error: ownerError } = await supabase
      .from('User')
      .select('*')
      .eq('agencyId', subAccount.agencyId)
      .eq('role', 'AGENCY_OWNER')
      .maybeSingle()

    if (ownerError) {
      console.error('Error fetching agency owner:', ownerError)
      throw new Error(`Failed to verify agency owner: ${ownerError.message || 'Unknown error'}`)
    }

    if (!agencyOwner) {
      console.error('❌ No agency owner found for agency:', subAccount.agencyId)
      throw new Error('Agency owner not found. Please ensure you have proper permissions.')
    }

    console.log('✅ Agency owner verified:', agencyOwner.id)

    const { data, error } = await supabase
      .from('SubAccount')
      .upsert(subAccount as AnyRecord)
      .select()
      .single()

    if (error) {
      console.error('Error upserting subaccount:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      throw new Error(`Failed to create subaccount: ${error.message || 'Unknown error'}`)
    }

    // Create default sidebar options for the subaccount
    if (data) {
      const subAccountData = data as AnyRecord
      if (subAccountData.id) {
        console.log('🔧 Creating default sidebar options for new subaccount:', subAccountData.id)
        await createDefaultSubAccountSidebarOptions(subAccountData.id)
      }
    }

    console.log('✅ Subaccount created/updated successfully:', data)
    return data
  } catch (dbError: any) {
    console.error('Database connection failed:', dbError)
    throw dbError // Re-throw to let the caller handle it
  }
}

export const getUserPermissions = async (userId: string) => {
  const { data, error } = await supabase
    .from('Permissions')
    .select('*')
    .eq('email', userId)

  if (error) {
    console.error('Error fetching user permissions:', error)
    return { Permissions: [] }
  }

  return { Permissions: data }
}

export const updateUser = async (user: Partial<any>) => {
  const { data, error } = await supabase
    .from('User')
    .update(user as AnyRecord)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating user:', error)
    return null
  }

  return data
}

export const getDomainContent = async (subDomainName: string) => {
  const { data, error } = await supabase
    .from('Funnel')
    .select(`
      *,
      FunnelPage (
        *
      )
    `)
    .eq('subDomainName', subDomainName)
    .eq('published', true)
    .single()

  if (error) {
    console.error('Error fetching domain content:', error)
    return null
  }

  return data
}

export const changeUserPermissions = async (
  permissionId: string | undefined,
  email: string,
  subAccountId: string,
  permission: boolean
) => {
  if (permissionId) {
    const { data, error } = await supabase
      .from('Permissions')
      .update({ access: permission } as AnyRecord)
      .eq('id', permissionId)
      .select()
      .single()

    if (error) {
      console.error('Error updating permissions:', error)
      return null
    }

    return data
  } else {
    const { data, error } = await supabase
      .from('Permissions')
      .insert({
        id: v4(),
        email,
        subAccountId,
        access: permission,
      } as AnyRecord)
      .select()
      .single()

    if (error) {
      console.error('Error creating permissions:', error)
      return null
    }

    return data
  }
}

export const getSubaccountDetails = async (subAccountId: string) => {
  const { data, error } = await supabase
    .from('SubAccount')
    .select('*')
    .eq('id', subAccountId)
    .single()

  if (error) {
    console.error('Error fetching subaccount details:', error)
    return null
  }

  return data
}

export const deleteSubAccount = async (subAccountId: string) => {
  const { error } = await supabase
    .from('SubAccount')
    .delete()
    .eq('id', subAccountId)

  if (error) {
    console.error('Error deleting subaccount:', error)
    return false
  }

  return true
}

export const updateSubAccountDetails = async (
  subAccountId: string,
  subAccountDetails: Partial<any>
) => {
  const { data, error } = await supabase
    .from('SubAccount')
    .update(subAccountDetails as AnyRecord)
    .eq('id', subAccountId)
    .select()
    .single()

  if (error) {
    console.error('Error updating subaccount details:', error)
    return null
  }

  return data
}

export const createMedia = async (subAccountId: string, mediaFile: CreateMediaType) => {
  try {
    const mediaData: any = {
      id: v4(), // Generate unique ID for the media file
      name: mediaFile.name,
      link: mediaFile.link,
      type: mediaFile.type || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add subAccountId with correct casing - try both versions
    // Supabase might be case-sensitive depending on how the table was created
    mediaData.subAccountId = subAccountId

    console.log('📤 Creating media with data:', mediaData)

    const { data, error } = await supabase
      .from('Media')
      .insert(mediaData as AnyRecord)
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating media:', error)
      console.error('❌ Error details:', JSON.stringify(error, null, 2))
      return null
    }

    console.log('✅ Media created successfully:', data)
    return data
  } catch (error) {
    console.error('❌ Exception creating media:', error)
    return null
  }
}

export const deleteMedia = async (mediaId: string) => {
  const { error } = await supabase
    .from('Media')
    .delete()
    .eq('id', mediaId)

  if (error) {
    console.error('Error deleting media:', error)
    return false
  }

  return true
}

export const getMedia = async (subAccountId: string) => {
  console.log('📤 Fetching media for subaccount:', subAccountId)

  // Try fetching with different column name formats
  let { data, error } = await supabase
    .from('Media')
    .select('*')
    .eq('subAccountId', subAccountId)
    .order('createdAt', { ascending: false })

  // If no data with camelCase, try lowercase
  if ((!data || data.length === 0) && !error) {
    console.log('⚠️ No data with subAccountId, trying subaccountId...')
    const result = await supabase
      .from('Media')
      .select('*')
      .eq('subaccountId', subAccountId)
      .order('createdAt', { ascending: false })
    data = result.data
    error = result.error
  }

  if (error) {
    console.error('❌ Error fetching media:', error)
    console.error('❌ Error details:', JSON.stringify(error, null, 2))
    return { Media: [] }
  }

  console.log('✅ Fetched media:', data?.length || 0, 'files')
  if (data && data.length > 0) {
    console.log('📸 First file:', data[0])
  }

  return { Media: data || [] }
}

export const createPipeline = async (subAccountId: string, pipeline: Partial<any>) => {
  const { data, error } = await supabase
    .from('Pipeline')
    .insert({
      id: pipeline.id || v4(),
      name: pipeline.name,
      subAccountId,
      createdAt: pipeline.createdAt || new Date().toISOString(),
      updatedAt: pipeline.updatedAt || new Date().toISOString(),
    } as AnyRecord)
    .select()
    .single()

  if (error) {
    console.error('Error creating pipeline:', error)
    return null
  }

  return data
}

export const getPipelines = async (subAccountId: string) => {
  const { data, error } = await supabase
    .from('Pipeline')
    .select(`
      *,
      Lane (
        *,
        Ticket (*)
      )
    `)
    .eq('subAccountId', subAccountId)

  if (error) {
    console.error('Error fetching pipelines:', error)
    return []
  }

  return data
}

export const getPipelineDetails = async (pipelineId: string) => {
  console.log('🔍 Fetching pipeline details for ID:', pipelineId)

  const { data, error } = await supabase
    .from('Pipeline')
    .select('*')
    .eq('id', pipelineId)
    .single()

  if (error) {
    console.error('Error fetching pipeline details:', error)
    return null
  }

  console.log('✅ Pipeline details fetched:', data)
  return data
}

export const getLanesWithTicketAndTags = async (pipelineId: string) => {
  // First get all lanes for this pipeline
  const { data: lanes, error: lanesError } = await supabase
    .from('Lane')
    .select('*')
    .eq('pipelineId', pipelineId)
    .order('order')

  console.log('🔍 Fetching lanes for pipeline:', pipelineId)
  console.log('🔍 Lanes query result:', { data: lanes, error: lanesError })

  if (lanesError) {
    console.error('Error fetching lanes:', lanesError)
    return []
  }

  if (!lanes || lanes.length === 0) {
    console.log('🔍 No lanes found for pipeline:', pipelineId)
    return []
  }

  // Get all tickets for these lanes
  const laneIds = (lanes as AnyRecord[]).map((lane: AnyRecord) => lane.id)
  const { data: tickets, error: ticketsError } = await supabase
    .from('Ticket')
    .select('*')
    .in('laneId', laneIds)
    .order('order')

  if (ticketsError) {
    console.error('Error fetching tickets:', ticketsError)
    return (lanes as AnyRecord[]).map((lane: AnyRecord) => ({ ...lane, Tickets: [] }))
  }

  // Get all tags for these tickets
  const ticketIds = (tickets as AnyRecord[])?.map((ticket: AnyRecord) => ticket.id) || []
  let ticketTags: any[] = []

  if (ticketIds.length > 0) {
    const { data: tagsData, error: tagsError } = await supabase
      .from('_TagToTicket')
      .select(`
        *,
        Tag (*)
      `)
      .in('B', ticketIds)

    if (!tagsError && tagsData) {
      ticketTags = tagsData as AnyRecord[]
    }
  }

  // Organize tickets with their tags into lanes
  const lanesWithTickets = (lanes as AnyRecord[]).map((lane: AnyRecord) => {
    const laneTickets = ((tickets as AnyRecord[]) || [])
      .filter((ticket: AnyRecord) => ticket.laneId === lane.id)
      .map((ticket: AnyRecord) => ({
        ...ticket,
        Tags: ticketTags
          .filter((tt: AnyRecord) => tt.B === ticket.id)
          .map((tt: AnyRecord) => tt.Tag)
          .filter(Boolean)
      }))

    return {
      ...lane,
      Tickets: laneTickets
    }
  })

  return lanesWithTickets
}

export const updateLanesOrder = async (lanes: Array<{ id: string; order: number }>) => {
  const updates = lanes.map(lane =>
    supabase
      .from('Lane')
      .update({ order: lane.order } as AnyRecord)
      .eq('id', lane.id)
  )

  const results = await Promise.all(updates)
  const errors = results.filter(result => result.error)

  if (errors.length > 0) {
    console.error('Error updating lanes order:', errors)
    return false
  }

  return true
}

export const updateTicketsOrder = async (tickets: Array<{ id: string; order: number; laneId: string }>) => {
  const updates = tickets.map(ticket =>
    supabase
      .from('Ticket')
      .update({ order: ticket.order, laneId: ticket.laneId } as AnyRecord)
      .eq('id', ticket.id)
  )

  const results = await Promise.all(updates)
  const errors = results.filter(result => result.error)

  if (errors.length > 0) {
    console.error('Error updating tickets order:', errors)
    return false
  }

  return true
}

export const upsertLane = async (lane: Partial<any>) => {
  console.log('🚀 upsertLane called with lane data:', lane)

  if (!lane.pipelineId) {
    console.error('❌ No pipelineId provided')
    return null
  }

  const laneData = {
    ...lane,
    id: lane.id || v4(),
    createdAt: lane.createdAt || new Date().toISOString(),
    updatedAt: lane.updatedAt || new Date().toISOString(),
    order: lane.order || 0,
  }

  console.log('🔍 Upserting lane with data:', laneData)

  const { data, error } = await supabase
    .from('Lane')
    .upsert(laneData as AnyRecord)
    .select()
    .single()

  if (error) {
    console.error('❌ Error upserting lane:', error)
    console.error('   Error code:', error.code)
    console.error('   Error message:', error.message)
    console.error('   Error details:', error.details)
    console.error('   Lane data attempted:', laneData)
    return null
  }

  console.log('✅ Lane upserted successfully:', data)

  // Revalidate paths - try to get subaccount from the pipeline
  try {
    const { data: pipeline } = await supabase
      .from('Pipeline')
      .select('subAccountId')
      .eq('id', lane.pipelineId)
      .maybeSingle()

    if (pipeline) {
      console.log('🔄 Revalidating path for pipeline:', pipeline.subAccountId)
      const pipelineData = pipeline as AnyRecord
      if (pipelineData?.subAccountId) {
        revalidatePath(`/subaccount/${pipelineData.subAccountId}/pipelines/${lane.pipelineId}`)
      }
    }
  } catch (revalidateError) {
    console.log('⚠️ Could not revalidate path:', revalidateError)
  }

  return data
}

export const deleteLane = async (laneId: string) => {
  const { error } = await supabase
    .from('Lane')
    .delete()
    .eq('id', laneId)

  if (error) {
    console.error('Error deleting lane:', error)
    return false
  }

  return true
}

export const getTicketsWithTags = async (pipelineId: string) => {
  // First get all lanes for this pipeline
  const { data: lanes } = await supabase
    .from('Lane')
    .select('id')
    .eq('pipelineId', pipelineId)

  if (!lanes || lanes.length === 0) {
    return []
  }

  const laneIds = lanes.map(lane => lane.id)

  // Then get tickets for those lanes
  const { data, error } = await supabase
    .from('Ticket')
    .select(`
      *,
      Tag (*)
    `)
    .in('laneId', laneIds)

  if (error) {
    console.error('Error fetching tickets:', error)
    return []
  }

  return data
}

export const upsertTicket = async (ticket: Partial<any>) => {
  const ticketData = {
    ...ticket,
    id: ticket.id || v4(),
    createdAt: ticket.createdAt || new Date().toISOString(),
    updatedAt: ticket.updatedAt || new Date().toISOString(),
    order: ticket.order || 0,
  }

  const { data, error } = await supabase
    .from('Ticket')
    .upsert(ticketData as AnyRecord)
    .select()
    .single()

  if (error) {
    console.error('Error upserting ticket:', error)
    return null
  }

  return data
}

export const deleteTicket = async (ticketId: string) => {
  const { error } = await supabase
    .from('Ticket')
    .delete()
    .eq('id', ticketId)

  if (error) {
    console.error('Error deleting ticket:', error)
    return false
  }

  return true
}

export const getTagsForSubaccount = async (subAccountId: string) => {
  const { data, error } = await supabase
    .from('Tag')
    .select('*')
    .eq('subAccountId', subAccountId)

  if (error) {
    console.error('Error fetching tags:', error)
    return []
  }

  return data
}

export const upsertTag = async (subAccountId: string, tag: Partial<any>) => {
  const tagData = {
    ...tag,
    id: tag.id || v4(),
    subAccountId,
    createdAt: tag.createdAt || new Date().toISOString(),
    updatedAt: tag.updatedAt || new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('Tag')
    .upsert(tagData as AnyRecord)
    .select()
    .single()

  if (error) {
    console.error('Error upserting tag:', error)
    return null
  }

  return data
}

export const deleteTag = async (tagId: string) => {
  const { error } = await supabase
    .from('Tag')
    .delete()
    .eq('id', tagId)

  if (error) {
    console.error('Error deleting tag:', error)
    return false
  }

  return true
}

export const getContacts = async (subAccountId: string) => {
  const { data, error } = await supabase
    .from('Contact')
    .select(`
      *,
      Ticket (*)
    `)
    .eq('subAccountId', subAccountId)
    .order('createdAt', { ascending: true })

  if (error) {
    console.error('Error fetching contacts:', error)
    return []
  }

  return data
}

export const getFunnels = async (subAccountId: string) => {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Supabase not configured. Please set up your .env.local file.')
      console.error('See SUPABASE_ENV_FIX.md for instructions.')
      return []
    }

    const { data, error } = await supabase
      .from('Funnel')
      .select(`
        *,
        FunnelPage (
          id,
          name,
          updatedAt,
          previewImage,
          order,
          visits,
          pathName,
          funnelId
        )
      `)
      .eq('subAccountId', subAccountId)

    if (error) {
      console.error('Error fetching funnels:', error)
      return []
    }

    console.log('✅ Fetched funnels for subaccount:', subAccountId, 'Count:', data?.length || 0)
    return data || []
  } catch (dbError) {
    console.error('Database connection failed for getFunnels:', dbError)
    return []
  }
}

export const getFunnel = async (funnelId: string) => {
  try {
    const { data, error } = await supabase
      .from('Funnel')
      .select(`
        *,
        FunnelPage (
          id,
          name,
          updatedAt,
          previewImage,
          order,
          visits,
          pathName,
          funnelId
        )
      `)
      .eq('id', funnelId)
      .single()

    if (error) {
      console.error('Error fetching funnel details:', error)
      return null
    }

    // Sort FunnelPage by order
    const funnelData = data as AnyRecord
    if (funnelData?.FunnelPage) {
      funnelData.FunnelPage = funnelData.FunnelPage.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      console.log('✅ Fetched funnel details:', funnelData?.name, 'with', funnelData?.FunnelPage?.length || 0, 'pages')
      console.log('📄 Pages order:', funnelData?.FunnelPage?.map((p: any) => ({ name: p.name, order: p.order })))
    }

    console.log('✅ Fetched funnel details:', funnelData?.name)
    return funnelData
  } catch (dbError) {
    console.error('Database connection failed for getFunnel:', dbError)
    return null
  }
}

export const upsertFunnel = async (subAccountId: string, funnel: Partial<any>, funnelId?: string) => {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Supabase not configured. Please set up your .env.local file.')
      console.error('See SUPABASE_ENV_FIX.md for instructions.')
      return null
    }

    const funnelDataToUpsert = {
      ...funnel,
      subAccountId,
      id: funnelId || funnel.id || v4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: funnel.published || false, // Default to false if not provided
      subDomainName: funnel.subDomainName || null, // Convert empty string to null to avoid unique constraint violations
    }

    console.log('🔧 Upserting funnel with data:', funnelDataToUpsert)

    const { data, error } = await supabase
      .from('Funnel')
      .upsert(funnelDataToUpsert as AnyRecord)
      .select()
      .single()

    if (error) {
      console.error('Error upserting funnel:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return null
    }

    const funnelData = data as AnyRecord
    console.log('✅ Funnel created/updated successfully:', funnelData?.name)

    // Revalidate the funnels page to ensure it shows the new funnel
    try {
      await revalidatePath(`/subaccount/${subAccountId}/funnels`)
      console.log('🔄 Revalidated funnels page')
    } catch (revalidateError) {
      console.log('⚠️ Could not revalidate page:', revalidateError)
    }

    return data
  } catch (dbError) {
    console.error('Database connection failed for funnel upsert:', dbError)
    return null
  }
}

export const deleteFunnel = async (funnelId: string) => {
  const { error } = await supabase
    .from('Funnel')
    .delete()
    .eq('id', funnelId)

  if (error) {
    console.error('Error deleting funnel:', error)
    return false
  }

  return true
}

export const getFunnelPageDetails = async (funnelPageId: string) => {
  const { data, error } = await supabase
    .from('FunnelPage')
    .select('*')
    .eq('id', funnelPageId)
    .single()

  if (error) {
    console.error('Error fetching funnel page details:', error)
    return null
  }

  return data
}

export const upsertFunnelPage = async (subaccountId: string, funnelPage: UpsertFunnelPage, funnelId: string) => {
  try {
    console.log('🔧 upsertFunnelPage called with:', { funnelPage, funnelId })

    // Generate an ID if not provided (for new records)
    const pageData: any = {
      ...funnelPage,
      id: (funnelPage as any).id || v4(), // Generate ID if missing
      funnelId: funnelId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      visits: 0,
    }

    console.log('🔧 Page data with ID:', pageData)

    const { data, error } = await supabase
      .from('FunnelPage')
      .upsert(pageData)
      .select()
      .single()

    if (error) {
      console.error('❌ Error upserting funnel page:', error)
      throw error
    }

    const pageResult = data as AnyRecord
    console.log('✅ Funnel page created/updated successfully:', pageResult?.name)
    return data
  } catch (dbError) {
    console.error('Database connection failed for funnel page upsert:', dbError)
    return null
  }
}

export const deleteFunnelPage = async (funnelPageId: string) => {
  const { error } = await supabase
    .from('FunnelPage')
    .delete()
    .eq('id', funnelPageId)

  if (error) {
    console.error('Error deleting funnel page:', error)
    return false
  }

  return true
}

export const updateFunnelProducts = async (
  products: string,
  funnelId: string
) => {
  const { data, error } = await supabase
    .from('Funnel')
    .update({ liveProducts: products } as AnyRecord)
    .eq('id', funnelId)
    .select()
    .single()

  if (error) {
    console.error('Error updating funnel products:', error)
    return null
  }

  return data
}

export const createContact = async (contact: Partial<any>) => {
  const { data, error } = await supabase
    .from('Contact')
    .insert(contact as AnyRecord)
    .select()
    .single()

  if (error) {
    console.error('Error creating contact:', error)
    return null
  }

  // Revalidate the contacts page to ensure it shows the new contact
  if (contact.subAccountId) {
    try {
      revalidatePath(`/subaccount/${contact.subAccountId}/contacts`)
      console.log('🔄 Revalidated contacts page')
    } catch (revalidateError) {
      console.log('⚠️ Could not revalidate contacts page:', revalidateError)
    }
  }

  return data
}

export const getUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('User')
    .select(`
      *,
      Agency (
        *,
        AgencySidebarOption (*),
        SubAccount (
          *,
          SubAccountSidebarOption (*)
        )
      ),
      Permissions (*)
    `)
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return data
}

export const deleteUser = async (userId: string) => {
  const { error } = await supabase
    .from('User')
    .delete()
    .eq('id', userId)

  if (error) {
    console.error('Error deleting user:', error)
    return false
  }

  return true
}

export const sendInvitation = async (
  role: 'AGENCY_ADMIN' | 'SUBACCOUNT_USER' | 'SUBACCOUNT_GUEST',
  email: string,
  agencyId: string
) => {
  console.log('📧 sendInvitation called:', { email, role, agencyId })

  // First, check if invitation already exists for this email
  const { data: existingInvitation, error: checkError } = await supabase
    .from('Invitation')
    .select('*')
    .eq('email', email)
    .eq('agencyId', agencyId)
    .eq('status', 'PENDING')
    .single()

  if (checkError && checkError.code !== 'PGRST116') {
    // PGRST116 means no rows found, which is fine
    console.error('❌ Error checking for existing invitation:', checkError)
  }

  if (existingInvitation) {
    console.log('⚠️ Invitation already exists for this email:', existingInvitation)
    return existingInvitation
  }

  // Create invitation in database
  console.log('📧 Creating invitation in database...')
  const { data, error } = await supabase
    .from('Invitation')
    .insert({
      id: v4(),
      email,
      agencyId,
      role,
      status: 'PENDING',
    } as AnyRecord)
    .select()
    .single()

  if (error) {
    console.error('❌ Error creating invitation:', error)
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    })
    throw new Error(`Failed to create invitation: ${error.message || 'Unknown error'}`)
  }

  if (!data) {
    console.error('❌ Invitation creation returned no data')
    throw new Error('Failed to create invitation: No data returned')
  }

  console.log('✅ Invitation created successfully:', data)

  // Send invitation email
  try {
    console.log('📧 Sending invitation email...')
    // Call API route to send invitation email
    const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const emailResponse = await fetch(`${baseUrl}/api/send-invitation-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        invitationId: (data as AnyRecord).id,
        agencyId,
        role,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('⚠️ Failed to send invitation email:', errorText)
      console.error('Email response status:', emailResponse.status)
      // Still return invitation data even if email fails (invitation is created)
      // This allows the user to resend the invitation later if needed
    } else {
      const emailResult = await emailResponse.json()
      console.log('✅ Invitation email sent successfully to:', email)
      console.log('Email response:', emailResult)
    }

    return data
  } catch (emailError: any) {
    console.error('⚠️ Error sending invitation email:', emailError)
    console.error('Email error details:', {
      message: emailError?.message,
      stack: emailError?.stack,
    })
    // Still return the invitation data even if email fails
    // The invitation is created in the database, email can be resent later
    return data
  }
}

// Additional missing functions
export const deletePipeline = async (pipelineId: string) => {
  const { error } = await supabase
    .from('Pipeline')
    .delete()
    .eq('id', pipelineId)

  if (error) {
    console.error('Error deleting pipeline:', error)
    return false
  }

  return true
}

export const upsertPipeline = async (pipeline: Partial<any>) => {
  console.log('🚀 upsertPipeline called with:', pipeline)

  const pipelineData = {
    ...pipeline,
    id: pipeline.id || v4(),
    createdAt: pipeline.createdAt || new Date().toISOString(),
    updatedAt: pipeline.updatedAt || new Date().toISOString(),
  }

  console.log('🔍 Pipeline data to upsert:', pipelineData)

  const { data, error } = await supabase
    .from('Pipeline')
    .upsert(pipelineData as AnyRecord)
    .select()
    .single()

  if (error) {
    console.error('❌ Error upserting pipeline:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return null
  }

  console.log('✅ Pipeline upserted successfully:', data)
  return data
}

export const deleteFunnelePage = async (funnelPageId: string) => {
  const { error } = await supabase
    .from('FunnelPage')
    .delete()
    .eq('id', funnelPageId)

  if (error) {
    console.error('Error deleting funnel page:', error)
    return false
  }

  return true
}

export const getSubAccountTeamMembers = async (subAccountId: string) => {
  // First get all permissions for this subaccount
  const { data: permissions, error: permError } = await supabase
    .from('Permissions')
    .select('email')
    .eq('subAccountId', subAccountId)

  if (permError) {
    console.error('Error fetching permissions:', permError)
    return []
  }

  if (!permissions || permissions.length === 0) {
    return []
  }

  // Then get users with those emails
  const emails = (permissions as AnyRecord[]).map((p: AnyRecord) => p.email)
  const { data, error } = await supabase
    .from('User')
    .select(`
      *,
      Permissions (
        *,
        SubAccount (*)
      )
    `)
    .in('email', emails)

  if (error) {
    console.error('Error fetching team members:', error)
    return []
  }

  // Filter to only include users with permissions for this subaccount
  const filtered = (data || []).filter((user: AnyRecord) => {
    const userPermissions = user.Permissions as AnyRecord[] || []
    return userPermissions.some((perm: AnyRecord) => {
      const subAccount = perm.SubAccount as AnyRecord
      return subAccount?.id === subAccountId
    })
  })

  return filtered
}

export const getAgencyTeamMembers = async (agencyId: string) => {
  // 1. Get direct agency members
  const { data: directMembers, error: directError } = await supabase
    .from('User')
    .select(`
      *,
      Agency (
        *,
        SubAccount (*)
      ),
      Permissions (
        *,
        SubAccount (*)
      )
    `)
    .eq('agencyId', agencyId)
    .order('createdAt', { ascending: false })

  if (directError) {
    console.error('Error fetching agency team members:', directError)
    return []
  }

  // 2. Get members via accepted invitations
  const { data: acceptedInvitations, error: inviteError } = await supabase
    .from('Invitation')
    .select('email, role')
    .eq('agencyId', agencyId)
    .eq('status', 'ACCEPTED')

  if (inviteError) {
    console.error('Error fetching accepted invitations:', inviteError)
    return directMembers || []
  }

  const invitedEmails = acceptedInvitations?.map((inv: any) => inv.email) || []

  let invitedUsers: any[] = []
  if (invitedEmails.length > 0) {
    const { data: users, error: usersError } = await supabase
      .from('User')
      .select(`
        *,
        Agency (
          *,
          SubAccount (*)
        ),
        Permissions (
          *,
          SubAccount (*)
        )
      `)
      .in('email', invitedEmails)

    if (!usersError && users) {
      invitedUsers = users.map(user => {
        const invitation = acceptedInvitations?.find((inv: any) => inv.email === user.email)
        return {
          ...user,
          role: invitation?.role || user.role // Use invitation role if available
        }
      })
    }
  }

  // Combine and deduplicate (prefer direct membership if both exist, though they shouldn't)
  const allMembers = [...(directMembers || [])]

  invitedUsers.forEach(invitedUser => {
    if (!allMembers.find(m => m.id === invitedUser.id)) {
      allMembers.push(invitedUser)
    }
  })

  return allMembers
}

export const getAgencyInvitations = async (agencyId: string) => {
  const { data, error } = await supabase
    .from('Invitation')
    .select('*')
    .eq('agencyId', agencyId)
    .order('id', { ascending: false })

  if (error) {
    console.error('Error fetching invitations:', error)
    return []
  }

  return data || []
}

export const deleteInvitation = async (invitationId: string) => {
  const { error } = await supabase
    .from('Invitation')
    .delete()
    .eq('id', invitationId)

  if (error) {
    console.error('Error deleting invitation:', error)
    return false
  }

  return true
}

export const searchContacts = async (subAccountId: string, searchTerm: string) => {
  const { data, error } = await supabase
    .from('Contact')
    .select('*')
    .eq('subAccountId', subAccountId)
    .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)

  if (error) {
    console.error('Error searching contacts:', error)
    return []
  }

  return data || []
}

// ==========================================
// FINANCE QUERIES
// ==========================================

export const createWallet = async (agencyId?: string, subAccountId?: string) => {
  if (!agencyId && !subAccountId) return null

  const { data, error } = await supabase
    .from('Wallet')
    .insert({
      agencyId: agencyId || null,
      subAccountId: subAccountId || null,
      balance: 0,
    } as AnyRecord)
    .select()
    .single()

  if (error) {
    console.error('Error creating wallet:', error)
    return null
  }
  return data
}

export const getWallet = async (agencyId?: string, subAccountId?: string) => {
  if (!agencyId && !subAccountId) return null

  let query = supabase.from('Wallet').select('*')

  if (agencyId) {
    query = query.eq('agencyId', agencyId)
  } else if (subAccountId) {
    query = query.eq('subAccountId', subAccountId)
  }

  const { data, error } = await query.single()

  if (error && error.code !== 'PGRST116') { // Not found is okay
    console.error('Error fetching wallet:', error)
  }

  return data
}

export const getWalletBalance = async (agencyId?: string, subAccountId?: string) => {
  const wallet = await getWallet(agencyId, subAccountId)
  return wallet ? wallet.balance : 0
}

export const createTransaction = async (
  walletId: string,
  amount: number,
  type: string,
  description?: string,
  reference?: string,
  phoneNumber?: string,
  productId?: string,
  variantId?: string,
  quantity?: number,
  metadata?: any
) => {
  const { data, error } = await supabase
    .from('Transaction')
    .insert({
      walletId,
      amount,
      type,
      description,
      reference,
      phoneNumber,
      productId,
      variantId,
      quantity: quantity || 1,
      metadata,
      status: 'PENDING', // Default status
    } as AnyRecord)
    .select()
    .single()

  if (error) {
    console.error('Error creating transaction:', error)
    return null
  }
  return data
}

export const updateTransactionStatus = async (
  transactionId: string,
  status: string,
  reference?: string
) => {
  const updates: any = { status, updatedAt: new Date().toISOString() }
  if (reference) updates.reference = reference

  const { data, error } = await supabase
    .from('Transaction')
    .update(updates)
    .eq('id', transactionId)
    .select()
    .single()

  if (error) {
    console.error('Error updating transaction status:', error)
    return null
  }
  return data
}

export const getTransactions = async (walletId: string) => {
  const { data, error } = await supabase
    .from('Transaction')
    .select('*')
    .eq('walletId', walletId)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
  return data
}

export const upsertMpesaSettings = async (settings: {
  agencyId?: string
  subAccountId?: string
  shortCode: string
  consumerKey: string
  consumerSecret: string
  passkey?: string
  environment: 'SANDBOX' | 'PRODUCTION'
}) => {
  if (!settings.agencyId && !settings.subAccountId) return null

  // Check if exists first to determine insert or update logic if needed, 
  // but upsert should handle it if we have a unique constraint.
  // Our schema has unique constraints on agencyId and subAccountId.

  const { data, error } = await supabase
    .from('MpesaSettings')
    .upsert(settings as AnyRecord, { onConflict: settings.agencyId ? 'agencyId' : 'subAccountId' })
    .select()
    .single()

  if (error) {
    console.error('Error upserting MPESA settings:', error)
    return null
  }
  return data
}

export const getMpesaSettings = async (agencyId?: string, subAccountId?: string) => {
  if (!agencyId && !subAccountId) return null

  let query = supabase.from('MpesaSettings').select('*')

  if (agencyId) {
    query = query.eq('agencyId', agencyId)
  } else if (subAccountId) {
    query = query.eq('subAccountId', subAccountId)
  }

  const { data, error } = await query.single()

  if (error) {
    // console.error('Error fetching MPESA settings:', error) // Expected if not set
    return null
  }
  return data
}

export const getTaskBoardDetails = async (subAccountId: string) => {
  console.log('🔍 getTaskBoardDetails called for subAccount:', subAccountId)
  const supabase = createClient()

  // Fetch all boards with their lanes and tasks to find the most active one
  const { data: boards, error: fetchError } = await supabase
    .from('TaskBoard')
    .select(`
      *,
      TaskLane (
        *,
        Task (
          *,
          TaskAssignee (
            userId,
            User (
              name,
              avatarUrl
            )
          )
        )
      )
    `)
    .eq('subAccountId', subAccountId)

  if (fetchError) {
    console.error('❌ Error fetching task boards:', fetchError)
    return null
  }

  if (!boards || boards.length === 0) {
    console.log('⚠️ No board found, creating default board...')
    const newBoardId = v4()
    const { data: newBoard, error: createError } = await supabase
      .from('TaskBoard')
      .insert({
        id: newBoardId,
        name: 'Task Board',
        subAccountId: subAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as AnyRecord)
      .select()
      .single()

    if (createError) {
      console.error('❌ Error creating default board:', createError)
      return null
    }

    if (newBoard) {
      console.log('✅ Default board created:', newBoard.id)
      const defaultLanes = [
        { id: v4(), name: 'To Do', boardId: newBoard.id, order: 0, color: '#3b82f6', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: v4(), name: 'In Progress', boardId: newBoard.id, order: 1, color: '#eab308', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: v4(), name: 'Done', boardId: newBoard.id, order: 2, color: '#22c55e', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ]
      const { error: lanesError } = await supabase.from('TaskLane').insert(defaultLanes as AnyRecord[])
      if (lanesError) console.error('❌ Error creating default lanes:', lanesError)

      return { ...newBoard, TaskLane: defaultLanes.map(lane => ({ ...lane, Task: [] })) }
    }
    return null
  }

  // Heuristic: Pick the board with the most lanes. If even, pick the one with most tasks.
  // This helps if multiple boards were accidentally created.
  let bestBoard = boards[0]
  if (boards.length > 1) {
    console.warn(`🚨 Multiple boards (${boards.length}) found for subAccount: ${subAccountId}`)
    boards.forEach((b, idx) => {
      console.log(` Board ${idx}: ID=${b.id}, Lanes=${b.TaskLane?.length || 0}`)
    })

    bestBoard = boards.reduce((prev, current) => {
      const prevLanes = prev.TaskLane?.length || 0
      const currentLanes = current.TaskLane?.length || 0
      if (currentLanes > prevLanes) return current
      if (currentLanes < prevLanes) return prev

      const prevTasks = prev.TaskLane?.reduce((acc: number, l: any) => acc + (l.Task?.length || 0), 0) || 0
      const currentTasks = current.TaskLane?.reduce((acc: number, l: any) => acc + (l.Task?.length || 0), 0) || 0
      return currentTasks >= prevTasks ? current : prev
    })
    console.log(`✅ Selected most active board: ${bestBoard.id}`)
  }

  // Sort lanes by order
  const lanesWithSortedTasks = bestBoard.TaskLane?.sort((a: any, b: any) => a.order - b.order).map((lane: any) => ({
    ...lane,
    Task: lane.Task?.sort((a: any, b: any) => a.order - b.order) || []
  })) || []

  const result = { ...bestBoard, TaskLane: lanesWithSortedTasks }
  console.log('✅ Board details retrieved successfully')
  return result
}

export const getDistinctBrands = async (subAccountId: string) => {
  const { data } = await supabase
    .from('Product')
    .select('brand')
    .eq('subAccountId', subAccountId)
    .eq('active', true)
    .not('brand', 'is', null)
    .neq('brand', '')

  const brands = new Set<string>()
  data?.forEach((p) => {
    if (p.brand) brands.add(p.brand)
  })
  return Array.from(brands)
}

export const getDistinctCategories = async (subAccountId: string) => {
  const { data } = await supabase
    .from('Product')
    .select('category')
    .eq('subAccountId', subAccountId)
    .eq('active', true)
    .not('category', 'is', null)
    .neq('category', '')

  const categories = new Set<string>()
  data?.forEach((p) => {
    if (p.category) categories.add(p.category)
  })
  return Array.from(categories)
}

// ==========================================
// INVENTORY QUERIES
// ==========================================

export const getProducts = async (
  subAccountId: string,
  filters?: {
    query?: string
    brand?: string[]
    category?: string
    colors?: string[]
    active?: boolean
    minPrice?: number
    maxPrice?: number
    page?: number
    limit?: number
  }
) => {
  let query = supabase
    .from('Product')
    .select(`*, ProductVariant(*)`, { count: 'exact' })
    .eq('subAccountId', subAccountId)
    .order('createdAt', { ascending: false })

  if (filters?.query) {
    query = query.ilike('name', `%${filters.query}%`)
  }
  if (filters?.brand && filters.brand.length > 0) {
    query = query.in('brand', filters.brand)
  }
  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  if (filters?.colors && filters.colors.length > 0) {
    query = query.overlaps('colors', filters.colors)
  }
  if (filters?.active !== undefined) {
    query = query.eq('active', filters.active)
  }
  if (filters?.minPrice) {
    query = query.gte('price', filters.minPrice)
  }
  if (filters?.maxPrice) {
    query = query.lte('price', filters.maxPrice)
  }
  if (filters?.customAttributes && filters.customAttributes.length > 0) {
    // Filter by contained JSON. 
    // Supabase .contains() works if we pass the array of objects we expect to find.
    // However, if we want to match *all* filters (AND logic), we need to chain .contains().
    // filters.customAttributes is assumed to be an array of { key: string, value: string }
    filters.customAttributes.forEach((attr: { key: string, value: string }) => {
      query = query.contains('customAttributes', [attr])
    })
  }

  const page = filters?.page || 1
  const limit = filters?.limit || 12
  const from = (page - 1) * limit
  const to = from + limit - 1

  query = query.range(from, to)

  const { data, error, count } = await query
  console.log('🛒 getProducts Filters:', JSON.stringify(filters, null, 2))
  console.log('🛒 getProducts Result Count:', count)
  console.log('🛒 getProducts Error (if any):', error)

  if (error) {
    console.error('Error fetching products:', error)
    return { data: [], count: 0 }
  }

  return { data, count }
}

export const getProductDetails = async (productId: string) => {
  const { data, error } = await supabase
    .from('Product')
    .select(`
      *,
      ProductVariant (*)
    `)
    .eq('id', productId)
    .single()

  if (error) {
    console.error('Error fetching product details:', error)
    return null
  }

  return data
}

export const upsertProduct = async (product: Partial<any>) => {
  console.log('🔥 upsertProduct called with:', JSON.stringify(product, null, 2))
  const productId = product.id || v4()
  const subAccountId = product.subAccountId

  if (!subAccountId) {
    console.error('subAccountId is required for upsertProduct')
    return null
  }

  // Paystack sync
  let paystackProductId = product.paystackProductId
  if (!paystackProductId) {
    try {
      const psResponse = await paystack.createProduct({
        name: product.name,
        description: product.description || '',
        price: Math.round(Number(product.price) * 100), // convert to kobo
        currency: 'KES',
        unlimited: (product.stockQuantity ?? 0) > 0 ? false : true,
        quantity: (product.stockQuantity ?? 0) > 0 ? Number(product.stockQuantity) : undefined,
        metadata: {
          brand: product.brand,
          category: product.category,
          colors: product.colors,
          minOrder: product.minOrder,
          maxOrder: product.maxOrder,
          maxOrder: product.maxOrder,
          lowStockThreshold: product.lowStockThreshold,
          active: product.active,
          customAttributes: product.customAttributes,
          shippingDelivery: product.shippingDelivery,
          shippingInternational: product.shippingInternational,
          shippingArrival: product.shippingArrival,
          paymentTaxInfo: product.paymentTaxInfo,
          paymentTerms: product.paymentTerms,
        }
      })
      if (psResponse.status) {
        paystackProductId = psResponse.data.product_code
      } else {
        console.error('Paystack product creation failed:', psResponse.message)
      }
    } catch (error) {
      console.error('Error syncing with Paystack:', error)
    }
  } else {
    // Update Paystack if needed
    try {
      await paystack.updateProduct(paystackProductId, {
        name: product.name,
        description: product.description,
        price: Math.round(Number(product.price) * 100),
        unlimited: (product.stockQuantity ?? 0) > 0 ? false : true,
        quantity: (product.stockQuantity ?? 0) > 0 ? Number(product.stockQuantity) : undefined,
        metadata: {
          brand: product.brand,
          category: product.category,
          colors: product.colors,
          minOrder: product.minOrder,
          maxOrder: product.maxOrder,
          lowStockThreshold: product.lowStockThreshold,
          active: product.active,
          customAttributes: product.customAttributes
        }
      })
    } catch (error) {
      console.error('Error updating Paystack product:', error)
    }
  }

  const productData = {
    ...product,
    id: productId,
    paystackProductId,
    updatedAt: new Date().toISOString(),
    createdAt: product.createdAt || new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('Product')
    .upsert(productData as AnyRecord)
    .select()
    .single()

  if (error) {
    console.error('Error upserting product logic:', error)
    throw new Error(`Supabase Error: ${error.message} (${error.code})`)
  }

  revalidatePath(`/subaccount/${subAccountId}/inventory`)
  revalidatePath(`/subaccount/${subAccountId}/inventory/${productId}`)
  revalidatePath(`/inventory-preview/${productId}`)
  return data
}

export const deleteProduct = async (productId: string, subAccountId: string) => {
  // We'll just deactivate instead of delete to maintain transaction history
  const { error } = await supabase
    .from('Product')
    .update({ active: false } as AnyRecord)
    .eq('id', productId)

  if (error) {
    console.error('Error deactivating product:', error)
    return false
  }

  revalidatePath(`/subaccount/${subAccountId}/inventory`)
  return true
}

export const getDistinctCustomAttributes = async (subAccountId: string) => {
  const { data, error } = await supabase
    .from('Product')
    .select('customAttributes')
    .eq('subAccountId', subAccountId)
    .eq('active', true) // Optional: only show attributes from active products

  if (error) {
    console.error('Error fetching custom attributes:', error)
    return {}
  }

  const aggregated: Record<string, string[]> = {}

  // data is array of { customAttributes: Json }
  data.forEach((item) => {
    const attrs = item.customAttributes as Array<{ key: string; value: string }>
    if (Array.isArray(attrs)) {
      attrs.forEach((attr) => {
        const k = attr.key
        const v = attr.value
        if (k && v) {
          if (!aggregated[k]) aggregated[k] = []
          if (!aggregated[k].includes(v)) aggregated[k].push(v)
        }
      })
    }
  })

  return aggregated
}

export const upsertProductVariant = async (variant: Partial<any>) => {
  const variantId = variant.id || v4()
  const variantData = {
    ...variant,
    id: variantId,
    updatedAt: new Date().toISOString(),
    createdAt: variant.createdAt || new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('ProductVariant')
    .upsert(variantData as AnyRecord)
    .select()
    .single()

  if (error) {
    console.error('Error upserting variant:', error)
    return null
  }

  return data
}

export const deleteProductVariant = async (variantId: string) => {
  const { error } = await supabase
    .from('ProductVariant')
    .delete()
    .eq('id', variantId)

  if (error) {
    console.error('Error deleting variant:', error)
    return false
  }

  return true
}

export const addInventoryToExistingSubAccount = async (subAccountId: string) => {
  try {
    const { data: existingOption, error: checkError } = await supabase
      .from('SubAccountSidebarOption')
      .select('id')
      .eq('subAccountId', subAccountId)
      .eq('name', 'Inventory')
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing Inventory option:', checkError)
      return
    }

    if (!existingOption) {
      const inventoryOption = {
        id: `sub-sidebar-${subAccountId}-inventory`,
        name: 'Inventory',
        link: `/subaccount/${subAccountId}/inventory`,
        icon: 'category',
        subAccountId: subAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await supabase
        .from('SubAccountSidebarOption')
        .insert(inventoryOption as AnyRecord)

      console.log('✅ Inventory option added to subaccount:', subAccountId)
    }
  } catch (error) {
    console.error('Error adding Inventory to existing subaccount:', error)
  }
}

export const upsertContact = async (contact: {
  email: string
  subAccountId: string
  name: string
}) => {
  const { data, error } = await supabase
    .from('Contact')
    .upsert(contact)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const getAgencyTaskBoardDetails = async (agencyId: string) => {
  console.log('🔍 getAgencyTaskBoardDetails called for agency:', agencyId)
  const supabase = createClient()

  // Fetch all boards with their lanes and tasks to find the most active one
  const { data: boards, error: fetchError } = await supabase
    .from('TaskBoard')
    .select(`
      *,
      TaskLane (
        *,
        Task (
          *,
          TaskAssignee (
            userId,
            User (
              name,
              avatarUrl
            )
          )
        )
      )
    `)
    .eq('agencyId', agencyId)

  if (fetchError) {
    console.error('❌ Error fetching agency task boards:', fetchError)
    return null
  }

  if (!boards || boards.length === 0) {
    console.log('⚠️ No board found, creating default board...')
    const newBoardId = v4()
    const { data: newBoard, error: createError } = await supabase
      .from('TaskBoard')
      .insert({
        id: newBoardId,
        name: 'Agency Tasks',
        agencyId: agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as AnyRecord)
      .select()
      .single()

    if (createError) {
      console.error('❌ Error creating default board:', createError)
      return null
    }

    if (newBoard) {
      console.log('✅ Default board created:', newBoard.id)
      const defaultLanes = [
        { id: v4(), name: 'To Do', boardId: newBoard.id, order: 0, color: '#3b82f6', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: v4(), name: 'In Progress', boardId: newBoard.id, order: 1, color: '#eab308', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: v4(), name: 'Done', boardId: newBoard.id, order: 2, color: '#22c55e', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ]
      const { error: lanesError } = await supabase.from('TaskLane').insert(defaultLanes as AnyRecord[])
      if (lanesError) console.error('❌ Error creating default lanes:', lanesError)

      return { ...newBoard, TaskLane: defaultLanes.map(lane => ({ ...lane, Task: [] })) }
    }
    return null
  }

  // Heuristic: Pick the board with the most lanes. If even, pick the one with most tasks.
  let bestBoard = boards[0]
  if (boards.length > 1) {
    console.warn(`🚨 Multiple agency boards (${boards.length}) found for agency: ${agencyId}`)
    bestBoard = boards.reduce((prev, current) => {
      const prevLanes = prev.TaskLane?.length || 0
      const currentLanes = current.TaskLane?.length || 0
      if (currentLanes > prevLanes) return current
      if (currentLanes < prevLanes) return prev

      const prevTasks = prev.TaskLane?.reduce((acc: number, l: any) => acc + (l.Task?.length || 0), 0) || 0
      const currentTasks = current.TaskLane?.reduce((acc: number, l: any) => acc + (l.Task?.length || 0), 0) || 0
      return currentTasks >= prevTasks ? current : prev
    })
    console.log(`✅ Selected most active agency board: ${bestBoard.id}`)
  }

  // Sort lanes by order
  const lanesWithSortedTasks = bestBoard.TaskLane?.sort((a: any, b: any) => a.order - b.order).map((lane: any) => ({
    ...lane,
    Task: lane.Task?.sort((a: any, b: any) => a.order - b.order) || []
  })) || []

  return { ...bestBoard, TaskLane: lanesWithSortedTasks }
}

// ============================================
// ORDERS MANAGEMENT QUERIES
// ============================================

export const getOrders = async (
  subAccountId: string,
  filters?: {
    query?: string
    status?: string
    paymentStatus?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }
) => {
  const page = filters?.page || 1
  const limit = filters?.limit || 20
  const offset = (page - 1) * limit

  let query = supabase
    .from('Order')
    .select(`
      *,
      OrderItem (
        *,
        Product (
          *
        )
      )
    `, { count: 'exact' })
    .eq('subAccountId', subAccountId)
    .order('createdAt', { ascending: false })

  // Apply filters
  if (filters?.query) {
    query = query.or(`orderId.ilike.%${filters.query}%,customerName.ilike.%${filters.query}%,customerEmail.ilike.%${filters.query}%`)
  }

  if (filters?.status && filters.status !== 'all' && filters.status !== '') {
    query = query.eq('orderStatus', filters.status)
  }

  if (filters?.paymentStatus && filters.paymentStatus !== 'all' && filters.paymentStatus !== '') {
    query = query.eq('paymentStatus', filters.paymentStatus)
  }

  if (filters?.startDate) {
    query = query.gte('createdAt', filters.startDate)
  }

  if (filters?.endDate) {
    query = query.lte('createdAt', filters.endDate)
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching orders:', error)
    return { data: [], count: 0 }
  }

  return { data: data || [], count: count || 0 }
}

export const getOrderById = async (orderId: string) => {
  const { data, error } = await supabase
    .from('Order')
    .select(`
      *,
      OrderItem (
        *,
        Product (
          id,
          name,
          images,
          description
        )
      ),
      OrderStatusHistory (
        *
      )
    `)
    .eq('id', orderId)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return null
  }

  return data
}

export const createOrder = async (orderData: {
  subAccountId: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  totalPrice: number
  paymentMethod?: string
  paymentStatus?: string
  orderStatus?: string
  shippingAddress?: string
  shippingCity?: string
  shippingState?: string
  shippingCountry?: string
  shippingPostalCode?: string
  trackingNumber?: string
  estimatedDelivery?: string
  notes?: string
  items: Array<{
    productId: string
    variantId?: string
    productName: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
}) => {
  const orderId = `#${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`

  const order = {
    id: v4(),
    orderId,
    subAccountId: orderData.subAccountId,
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    customerPhone: orderData.customerPhone,
    totalPrice: orderData.totalPrice,
    paymentMethod: orderData.paymentMethod || 'VISA',
    paymentStatus: orderData.paymentStatus || 'Pending',
    orderStatus: orderData.orderStatus || 'Order Confirmed',
    shippingAddress: orderData.shippingAddress,
    shippingCity: orderData.shippingCity,
    shippingState: orderData.shippingState,
    shippingCountry: orderData.shippingCountry,
    shippingPostalCode: orderData.shippingPostalCode,
    trackingNumber: orderData.trackingNumber,
    estimatedDelivery: orderData.estimatedDelivery,
    notes: orderData.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const { data: createdOrder, error: orderError } = await supabase
    .from('Order')
    .insert(order as AnyRecord)
    .select()
    .single()

  if (orderError) {
    console.error('Error creating order:', orderError)
    return null
  }

  // Create order items
  const orderItems = orderData.items.map(item => ({
    id: v4(),
    orderId: createdOrder.id,
    productId: item.productId,
    variantId: item.variantId,
    productName: item.productName,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
    createdAt: new Date().toISOString(),
  }))

  const { error: itemsError } = await supabase
    .from('OrderItem')
    .insert(orderItems as AnyRecord[])

  if (itemsError) {
    console.error('Error creating order items:', itemsError)
    return null
  }

  // Create initial status history
  await supabase
    .from('OrderStatusHistory')
    .insert({
      id: v4(),
      orderId: createdOrder.id,
      status: order.orderStatus,
      description: 'Order has been confirmed',
      createdAt: new Date().toISOString(),
    } as AnyRecord)

  return createdOrder
}

export const updateOrderStatus = async (
  orderId: string,
  status: string,
  description?: string,
  location?: string
) => {
  const { data, error } = await supabase
    .from('Order')
    .update({
      orderStatus: status,
      updatedAt: new Date().toISOString(),
    } as AnyRecord)
    .eq('id', orderId)
    .select()
    .single()

  if (error) {
    console.error('Error updating order status:', error)
    return null
  }

  // Add to status history
  await supabase
    .from('OrderStatusHistory')
    .insert({
      id: v4(),
      orderId,
      status,
      description,
      location,
      createdAt: new Date().toISOString(),
    } as AnyRecord)

  // Revalidate to refresh the UI
  revalidatePath(`/subaccount/${data.subAccountId}/orders`)

  return data
}

export const bulkUpdateOrderStatus = async (
  orderIds: string[],
  status: string,
  subAccountId: string,
  description?: string,
  location?: string
) => {
  const { data, error } = await supabase
    .from('Order')
    .update({
      orderStatus: status,
      updatedAt: new Date().toISOString(),
    } as AnyRecord)
    .in('id', orderIds)
    .select('id')

  if (error) {
    console.error('Error batch updating order status:', error)
    return null
  }

  // Add to status history for all
  const historyEntries = orderIds.map(orderId => ({
    id: v4(),
    orderId,
    status,
    description,
    location,
    createdAt: new Date().toISOString(),
  }))

  await supabase.from('OrderStatusHistory').insert(historyEntries as AnyRecord[])

  // Revalidate to refresh the UI
  revalidatePath(`/subaccount/${subAccountId}/orders`)

  return data
}

export const bulkDeleteOrders = async (orderIds: string[], subAccountId: string) => {
  const { error } = await supabase
    .from('Order')
    .delete()
    .in('id', orderIds)

  if (error) {
    console.error('Error deleting orders:', error)
    return false
  }

  // Revalidate to refresh the UI
  revalidatePath(`/subaccount/${subAccountId}/orders`)

  return true
}

export const assignOrders = async (orderIds: string[], userId: string, subAccountId: string) => {
  // Assuming there is an assignedTo field
  const { data, error } = await supabase
    .from('Order')
    .update({
      assignedTo: userId,
      updatedAt: new Date().toISOString(),
    } as AnyRecord)
    .in('id', orderIds)

  if (error) {
    console.error('Error assigning orders:', error)
    return null
  }

  revalidatePath(`/subaccount/${subAccountId}/orders`)
  return data
}

export const getOrderStats = async (subAccountId: string) => {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  // Get total orders (current week)
  const { count: totalOrders } = await supabase
    .from('Order')
    .select('*', { count: 'exact', head: true })
    .eq('subAccountId', subAccountId)

  // Get total orders (last week)
  const { count: lastWeekOrders } = await supabase
    .from('Order')
    .select('*', { count: 'exact', head: true })
    .eq('subAccountId', subAccountId)
    .gte('createdAt', oneWeekAgo.toISOString())

  // Get total orders (week before last)
  const { count: weekBeforeLastOrders } = await supabase
    .from('Order')
    .select('*', { count: 'exact', head: true })
    .eq('subAccountId', subAccountId)
    .gte('createdAt', twoWeeksAgo.toISOString())
    .lte('createdAt', oneWeekAgo.toISOString())

  // Status-specific counts
  const { count: pendingOrders } = await supabase
    .from('Order')
    .select('*', { count: 'exact', head: true })
    .eq('subAccountId', subAccountId)
    .or('orderStatus.eq.Order Confirmed,orderStatus.eq.Pending')

  const { count: shippedOrders } = await supabase
    .from('Order')
    .select('*', { count: 'exact', head: true })
    .eq('subAccountId', subAccountId)
    .or('orderStatus.eq.In Transit,orderStatus.eq.In Sorting Centre')

  const { count: canceledOrders } = await supabase
    .from('Order')
    .select('*', { count: 'exact', head: true })
    .eq('subAccountId', subAccountId)
    .or('orderStatus.eq.Cancelled,orderStatus.eq.Failed')

  const { count: deliveredOrders } = await supabase
    .from('Order')
    .select('*', { count: 'exact', head: true })
    .eq('subAccountId', subAccountId)
    .eq('orderStatus', 'Delivered')

  // Calculate percentage change for total orders
  let totalOrdersChange = 0
  if (weekBeforeLastOrders && weekBeforeLastOrders > 0) {
    totalOrdersChange = ((lastWeekOrders! - weekBeforeLastOrders) / weekBeforeLastOrders) * 100
  } else if (lastWeekOrders && lastWeekOrders > 0) {
    totalOrdersChange = 100
  }

  // Get returns (generic for stats card)
  const { count: returnOrders } = await supabase
    .from('Order')
    .select('*', { count: 'exact', head: true })
    .eq('subAccountId', subAccountId)
    .or('orderStatus.eq.Returned,orderStatus.eq.Return Initiated')

  // Calculate return orders change (simplified)
  const returnOrdersChange = totalOrders && totalOrders > 0 ? (returnOrders! / totalOrders) * 100 : 0

  // Get revenue data for the chart (last 12 months)
  const { data: orders } = await supabase
    .from('Order')
    .select('createdAt, totalPrice, orderStatus, shippingCountry')
    .eq('subAccountId', subAccountId)
    .gte('createdAt', new Date(now.getFullYear(), now.getMonth() - 11, 1).toISOString())
    .order('createdAt', { ascending: true })

  // Country distribution for map
  const countryCounts: Record<string, { count: number, successful: number, cancels: number }> = {}
  orders?.forEach(o => {
    const country = o.shippingCountry || 'Unknown'
    if (!countryCounts[country]) {
      countryCounts[country] = { count: 0, successful: 0, cancels: 0 }
    }
    countryCounts[country].count++
    if (o.orderStatus === 'Delivered') countryCounts[country].successful++
    if (o.orderStatus === 'Cancelled' || o.orderStatus === 'Failed') countryCounts[country].cancels++
  })

  // Basic coordinates for common countries (in a real app, use a geocoding service or a more comprehensive map)
  const countryCoords: Record<string, [number, number]> = {
    'Kenya': [37.9062, -1.286389],
    'United States': [-95.7129, 37.0902],
    'United Kingdom': [-3.436, 55.3781],
    'Germany': [10.4515, 51.1657],
    'Nigeria': [8.6753, 9.082],
    'Ghana': [-1.0232, 7.9465],
    'South Africa': [22.9375, -30.5595],
    'Uganda': [32.2903, 1.3733],
    'Tanzania': [34.8888, -6.369],
    'Rwanda': [29.8739, -1.9403],
    'Ethiopia': [39.1225, 9.145],
    'Egypt': [30.8025, 26.8206],
    'India': [78.9629, 20.5937],
    'Canada': [-106.3468, 56.1304],
    'Australia': [133.7751, -25.2744],
  }

  const countryDistribution = Object.entries(countryCounts)
    .map(([country, stats]) => ({
      country,
      count: stats.count,
      successful: stats.successful,
      cancels: stats.cancels,
      abandons: 0, // Placeholder
      growth: '+0%', // Placeholder
      coordinates: countryCoords[country] || [0, 0]
    }))
    .sort((a, b) => b.count - a.count)

  return {
    totalOrders: totalOrders || 0,
    fulfilledOrders: deliveredOrders || 0,
    returnOrders: returnOrders || 0,
    pendingOrdersCount: pendingOrders || 0,
    shippedOrdersCount: shippedOrders || 0,
    canceledOrdersCount: canceledOrders || 0,
    deliveredOrdersCount: deliveredOrders || 0,
    totalOrdersChange: totalOrdersChange || 11,
    returnOrdersChange: returnOrdersChange || -3.3,
    orders: orders || [],
    countryDistribution: countryDistribution || [],
  }
}

export const getOrderHistory = async (orderId: string) => {
  const { data, error } = await supabase
    .from('OrderStatusHistory')
    .select('*')
    .eq('orderId', orderId)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching order history:', error)
    return []
  }

  return data
}

export const cancelOrder = async (orderId: string, reason?: string) => {
  const { data: order } = await supabase
    .from('Order')
    .select('orderStatus')
    .eq('id', orderId)
    .single()

  if (order && (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' || order.orderStatus === 'In Transit' || order.orderStatus === 'In Sorting Centre')) {
    throw new Error('Cannot cancel an order that has already been shipped or is in transit.')
  }

  return updateOrderStatus(orderId, 'Cancelled', reason || 'Order cancelled by customer')
}

export const returnOrder = async (orderId: string, reason?: string) => {
  const { data: order } = await supabase
    .from('Order')
    .select('orderStatus')
    .eq('id', orderId)
    .single()

  if (order && order.orderStatus !== 'Delivered') {
    throw new Error('Only delivered orders can be transitioned to return.')
  }


  return updateOrderStatus(orderId, 'Return Initiated', reason || 'Customer requested a return')
}

// ============================================
// AGENCY TEAMS QUERIES
// ============================================

export const getAgencyTeams = async (agencyId: string) => {
  const { data, error } = await supabaseAdmin
    .from('AgencyTeam')
    .select(`
      *,
      AgencyTeamMember (
        *,
        User (
          id,
          name,
          email,
          avatarUrl
        )
      ),
      Task (
        *,
        TaskLane (name)
      )
    `)
    .eq('agencyId', agencyId)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching agency teams:', error)
    return []
  }

  return data
}

export const upsertAgencyTeam = async (team: any) => {
  const isServiceKeyPresent = !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
  console.log('🔑 Service Key Present:', isServiceKeyPresent)

  if (!supabaseAdmin) {
    console.error('❌ supabaseAdmin is not initialized!')
    return { data: null, error: 'Supabase Admin not initialized' }
  }

  console.log('🚀 upsertAgencyTeam called with:', JSON.stringify(team, null, 2))

  const { data, error } = await supabaseAdmin
    .from('AgencyTeam')
    .upsert({
      ...team,
      updatedAt: new Date().toISOString(),
    } as AnyRecord)
    .select()

  if (error) {
    console.error('❌ Error upserting agency team:', error)
    console.error('🔍 Error details:', JSON.stringify(error, null, 2))
    return { data: null, error: error.message }
  }

  if (!data || data.length === 0) {
    return { data: null, error: 'No data returned from upsert' }
  }

  return { data: data[0], error: null }
}

export const deleteAgencyTeam = async (teamId: string) => {
  const { error } = await supabaseAdmin
    .from('AgencyTeam')
    .delete()
    .eq('id', teamId)

  if (error) {
    console.error('Error deleting agency team:', error)
    return false
  }

  return true
}

export const addTeamMember = async (teamId: string, userId: string, isLeader: boolean = false) => {
  const { data, error } = await supabaseAdmin
    .from('AgencyTeamMember')
    .upsert(
      {
        teamId,
        userId,
        isLeader,
        updatedAt: new Date().toISOString(),
      } as AnyRecord,
      { onConflict: 'teamId,userId' }
    )
    .select()
    .single()

  if (error) {
    console.error('Error adding team member:', error)
    return null
  }

  return data
}

export const removeTeamMember = async (teamId: string, userId: string) => {
  const { error } = await supabaseAdmin
    .from('AgencyTeamMember')
    .delete()
    .eq('teamId', teamId)
    .eq('userId', userId)

  if (error) {
    console.error('Error removing team member:', error)
    return false
  }

  return true
}

export const createTeamChat = async (teamId: string, name: string, userIds: string[], agencyId: string) => {
  try {
    // Check if a team chat already exists for this team name
    const { data: existing } = await supabaseAdmin
      .from('Conversation')
      .select('id')
      .eq('title', name)
      .eq('agencyId', agencyId)
      .eq('type', 'group')
      .maybeSingle()

    if (existing) return existing

    const { data: conversation, error: convError } = await supabaseAdmin
      .from('Conversation')
      .insert({
        id: v4(),
        type: 'group',
        title: name,
        agencyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as AnyRecord)
      .select()
      .single()

    if (convError) throw convError

    const participants = userIds.map((userId) => ({
      id: v4(),
      conversationId: conversation.id,
      userId,
      role: 'member',
      joinedAt: new Date().toISOString(),
    }))

    const { error: partError } = await supabaseAdmin
      .from('ConversationParticipant')
      .insert(participants as AnyRecord[])

    if (partError) throw partError

    // Optionally link team to conversation if needed, 
    // but for now we just return the conversation
    return conversation
  } catch (error) {
    console.error('Error creating team chat:', error)
    return null
  }
}

export const toggleTeamLeader = async (teamId: string, userId: string, isLeader: boolean) => {
  const { data, error } = await supabaseAdmin
    .from('AgencyTeamMember')
    .update({ isLeader } as AnyRecord)
    .eq('teamId', teamId)
    .eq('userId', userId)
    .select()

  if (error) {
    console.error('Error toggling team leader:', error)
    return null
  }

  return data
}

export const getSubAccountAgencyId = async (subAccountId: string) => {
  const { data, error } = await supabase
    .from('SubAccount')
    .select('agencyId')
    .eq('id', subAccountId)
    .single()

  if (error) {
    console.error('Error fetching subaccount agencyId:', error)
    return null
  }

  return data?.agencyId
}