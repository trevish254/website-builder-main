import { supabase, supabaseAdmin } from './supabase'
import { Database } from './database.types'

// Type aliases for easier use
type User = Database['public']['Tables']['User']['Row']
type Agency = Database['public']['Tables']['Agency']['Row']
type SubAccount = Database['public']['Tables']['SubAccount']['Row']
type Pipeline = Database['public']['Tables']['Pipeline']['Row']
type Lane = Database['public']['Tables']['Lane']['Row']
type Ticket = Database['public']['Tables']['Ticket']['Row']
type Contact = Database['public']['Tables']['Contact']['Row']
type Media = Database['public']['Tables']['Media']['Row']
type Funnel = Database['public']['Tables']['Funnel']['Row']
type FunnelPage = Database['public']['Tables']['FunnelPage']['Row']
type Notification = Database['public']['Tables']['Notification']['Row']
type Conversation = Database['public']['Tables']['Conversation']['Row']
type ConversationParticipant = Database['public']['Tables']['ConversationParticipant']['Row']
type Message = Database['public']['Tables']['Message']['Row']

// User Management
export const getAuthUserDetails = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

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
    .eq('email', user.email)
    .single()

  if (error) {
    console.error('Error fetching user details:', error)
    return null
  }

  return data
}

export const createUser = async (userData: Partial<User>) => {
  const { data, error } = await supabase
    .from('User')
    .insert(userData)
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    return null
  }

  return data
}

// Agency Management
export const getAgencyDetails = async (agencyId: string) => {
  const { data, error } = await supabase
    .from('Agency')
    .select('*')
    .eq('id', agencyId)
    .single()

  if (error) {
    console.error('Error fetching agency details:', error)
    return null
  }

  return data
}

export const updateAgencyDetails = async (agencyId: string, updates: Partial<Agency>) => {
  const { data, error } = await supabase
    .from('Agency')
    .update(updates)
    .eq('id', agencyId)
    .select()
    .single()

  if (error) {
    console.error('Error updating agency details:', error)
    return null
  }

  return data
}

// SubAccount Management
export const getSubAccounts = async (agencyId: string) => {
  const { data, error } = await supabase
    .from('SubAccount')
    .select('*')
    .eq('agencyId', agencyId)

  if (error) {
    console.error('Error fetching subaccounts:', error)
    return []
  }

  return data
}

export const getSubAccountDetails = async (subAccountId: string) => {
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

// Pipeline Management
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
  const { data, error } = await supabase
    .from('Pipeline')
    .select('*')
    .eq('id', pipelineId)
    .single()

  if (error) {
    console.error('Error fetching pipeline details:', error)
    return null
  }

  return data
}

export const createPipeline = async (pipelineData: Partial<Pipeline>) => {
  const { data, error } = await supabase
    .from('Pipeline')
    .insert(pipelineData)
    .select()
    .single()

  if (error) {
    console.error('Error creating pipeline:', error)
    return null
  }

  return data
}

// Lane Management
export const getLanesWithTicketAndTags = async (pipelineId: string) => {
  const { data, error } = await supabase
    .from('Lane')
    .select(`
      *,
      Ticket (
        *,
        Tag (*)
      )
    `)
    .eq('pipelineId', pipelineId)
    .order('order')

  if (error) {
    console.error('Error fetching lanes:', error)
    return []
  }

  return data
}

export const updateLanesOrder = async (lanes: Array<{ id: string; order: number }>) => {
  const updates = lanes.map(lane =>
    supabase
      .from('Lane')
      .update({ order: lane.order })
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
      .update({ order: ticket.order, laneId: ticket.laneId })
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

// Contact Management
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

export const createContact = async (contactData: Partial<Contact>) => {
  const { data, error } = await supabase
    .from('Contact')
    .insert(contactData)
    .select()
    .single()

  if (error) {
    console.error('Error creating contact:', error)
    return null
  }

  return data
}

// Media Management
export const getMedia = async (subAccountId: string) => {
  const { data, error } = await supabase
    .from('Media')
    .select('*')
    .eq('subAccountId', subAccountId)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching media:', error)
    return { Media: [] }
  }

  return { Media: data }
}

// Funnel Management
export const getFunnels = async (subAccountId: string) => {
  const { data, error } = await supabase
    .from('Funnel')
    .select(`
      *,
      FunnelPage (*)
    `)
    .eq('subAccountId', subAccountId)

  if (error) {
    console.error('Error fetching funnels:', error)
    return []
  }

  return data
}

export const getFunnel = async (funnelId: string) => {
  const { data, error } = await supabase
    .from('Funnel')
    .select(`
      *,
      FunnelPage (*)
    `)
    .eq('id', funnelId)
    .single()

  if (error) {
    console.error('Error fetching funnel details:', error)
    return null
  }

  return data
}

// Notification Management
export const getNotifications = async (agencyId: string) => {
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

export const createNotification = async (notificationData: Partial<Notification>) => {
  const { data, error } = await supabase
    .from('Notification')
    .insert(notificationData)
    .select()
    .single()

  if (error) {
    console.error('Error creating notification:', error)
    return null
  }

  return data
}

// Messaging: Conversations and Messages
export const getUserConversations = async (
  userId: string,
  opts: { agencyId?: string; subAccountId?: string } = {}
) => {
  // 1. Get all conversation IDs where the user is a participant
  const { data: userParticipations, error: partError } = await supabase
    .from('ConversationParticipant')
    .select('conversationId')
    .eq('userId', userId)

  if (partError) {
    console.error('Error fetching user conversations:', partError)
    return [] as Conversation[]
  }

  const conversationIds = userParticipations?.map((p) => p.conversationId) || []

  if (conversationIds.length === 0) return []

  // 2. Fetch conversation details for these IDs
  // NOTE: We do NOT filter by agencyId here to support cross-agency messaging
  // Only filter by subAccountId if specified (for subaccount-specific conversations)
  const query = supabase
    .from('Conversation')
    .select('*')
    .in('id', conversationIds)
    .order('lastMessageAt', { ascending: false })

  if (opts.subAccountId) query.eq('subAccountId', opts.subAccountId)

  const { data: conversations, error: convError } = await query

  if (convError) {
    console.error('Error fetching conversation details:', convError)
    return [] as Conversation[]
  }

  // 3. Bulk fetch all participants for these conversations
  const { data: allParticipants, error: allPartError } = await supabase
    .from('ConversationParticipant')
    .select('*')
    .in('conversationId', conversationIds)

  if (allPartError) {
    console.error('Error fetching participants:', allPartError)
    return [] as Conversation[]
  }

  // 4. Bulk fetch all user details for these participants
  const userIds = Array.from(new Set(allParticipants?.map((p) => p.userId) || []))
  const { data: allUsers, error: userError } = await supabase
    .from('User')
    .select('id, name, email, avatarUrl')
    .in('id', userIds)

  if (userError) {
    console.error('Error fetching user details:', userError)
    return [] as Conversation[]
  }

  const userMap = new Map(allUsers?.map((u) => [u.id, u]))

  // 5. Bulk fetch latest message for each conversation (optimization: fetch last 100 messages total ordered by time and filter in memory if needed, or just fetch last message per conv via RPC if available. For now, we'll fetch a batch of recent messages)
  // Since we can't easily do "limit 1 per group" in Supabase simple query, we'll fetch the conversations' lastMessageAt and rely on that for sorting, but for preview we might need the content.
  // Strategy: Fetch all messages for these conversations created after a certain date? Or just fetch all messages?
  // Better Strategy: We already have `lastMessageAt` in conversation. If we need the *content* of the last message, we might still need a query.
  // Let's try to fetch the most recent message for each conversation.
  // Actually, for the inbox preview, we often just need the last message.
  // A common pattern is to fetch messages where id is in (select max(id) from messages group by conversationId) - but that's complex in Supabase client.
  // For now, let's fetch the last message for each conversation in parallel but LIMITED to the top 20 visible conversations to save bandwidth, OR just fetch all messages for the visible conversations if the count is low.
  // Given the performance constraints, let's just fetch the last message for EACH conversation using a loop BUT only for the ones we actually returned (which is filtered by agency/subaccount).
  // WAIT: The user complained about the loop. We must avoid the loop.
  // Alternative: Fetch ALL messages for these conversation IDs ordered by createdAt desc, but that's too much data.
  // Compromise: We will fetch the last message content ONLY for the top 20 conversations (pagination).
  // BUT `getUserConversations` returns ALL conversations.
  // Let's optimize: We will NOT fetch the message content here if it causes N+1.
  // However, the UI needs `preview`.
  // Let's use a specialized query if possible.
  // If we can't, we will do the loop but ONLY for the conversations we are returning, and we will use `Promise.all` with concurrency limit if needed.
  // ACTUALLY, the previous implementation did `Promise.all` and it crashed.
  // Let's try to fetch messages for ALL conversation IDs but only select `content, conversationId, createdAt` and limit to a reasonable number (e.g. 1000 most recent messages globally for these convs) and map them.

  const { data: recentMessages } = await supabase
    .from('Message')
    .select('conversationId, content, createdAt, type')
    .in('conversationId', conversationIds)
    .order('createdAt', { ascending: false })
    .limit(conversationIds.length * 1) // Heuristic: get roughly 1 message per conversation (globally sorted)

  // 6. Map everything together
  const conversationsWithDetails = conversations?.map((conv) => {
    const convParticipants = allParticipants?.filter((p) => p.conversationId === conv.id) || []
    const participantsWithUsers = convParticipants.map((p) => ({
      ...p,
      User: userMap.get(p.userId) || null
    }))

    // Find the message for this conversation
    const message = recentMessages?.find((m) => m.conversationId === conv.id)

    return {
      ...conv,
      ConversationParticipant: participantsWithUsers,
      Message: message ? [message] : []
    }
  })

  return conversationsWithDetails as unknown as Conversation[]
}

export const getConversationParticipants = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('ConversationParticipant')
    .select('*')
    .eq('conversationId', conversationId)

  if (error) {
    console.error('Error fetching participants:', error)
    return [] as ConversationParticipant[]
  }
  return data
}

export const getConversationMessages = async (conversationId: string | string[], limit = 50) => {
  console.log('[QUERY] getConversationMessages called with conversationId:', conversationId, 'limit:', limit)

  // DEBUG: Check if we can see ANY messages in the table
  const { count, error: countError } = await supabase
    .from('Message')
    .select('*', { count: 'exact', head: true })

  console.log('[DEBUG] Total messages visible to client:', count, 'Error:', countError)

  let query = supabase
    .from('Message')
    .select('*')
    .order('createdAt', { ascending: true })
    .limit(limit)

  if (Array.isArray(conversationId)) {
    query = query.in('conversationId', conversationId)
  } else {
    query = query.eq('conversationId', conversationId)
  }

  const { data, error } = await query

  console.log('[QUERY] getConversationMessages result - data:', data, 'error:', error)

  if (error) {
    console.error('[QUERY] Error fetching messages:', error)
    return [] as Message[]
  }

  console.log('[QUERY] Returning', data?.length || 0, 'messages')
  return data
}

export const sendMessage = async (payload: {
  conversationId: string
  senderId: string
  content: string
  type?: string
  metadata?: Record<string, unknown> | null
}) => {
  console.log('[QUERY] sendMessage called with payload:', payload)

  const messageData = {
    id: crypto.randomUUID(),
    conversationId: payload.conversationId,
    senderId: payload.senderId,
    content: payload.content,
    type: payload.type || 'text',
    metadata: (payload.metadata ?? null) as unknown as Database['public']['Tables']['Message']['Row']['metadata'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isEdited: false,
  }

  console.log('[QUERY] Inserting message:', messageData)

  const { data, error } = await supabase
    .from('Message')
    .insert(messageData)
    .select()
    .single()

  console.log('[QUERY] sendMessage result - data:', data, 'error:', error)

  if (error) {
    console.error('[QUERY] Error sending message:', error)
    return null
  }

  // Update conversation lastMessageAt
  await supabase
    .from('Conversation')
    .update({ lastMessageAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    .eq('id', payload.conversationId)

  console.log('[QUERY] Message inserted successfully with ID:', data.id)
  return data as Message
}

export const updateMessage = async (messageId: string, content: string) => {
  console.log('[QUERY] updateMessage called:', messageId)

  const { data, error } = await supabase
    .from('Message')
    .update({
      content,
      isEdited: true,
      updatedAt: new Date().toISOString()
    })
    .eq('id', messageId)
    .select()
    .single()

  if (error) {
    console.error('[QUERY] Error updating message:', error)
    return null
  }

  return data as Message
}

export const markConversationRead = async (conversationId: string, userId: string) => {
  const { error } = await supabase
    .from('ConversationParticipant')
    .update({ lastReadAt: new Date().toISOString() })
    .eq('conversationId', conversationId)
    .eq('userId', userId)

  if (error) {
    console.error('Error marking conversation as read:', error)
    return false
  }
  return true
}

export const ensureDirectConversation = async (params: {
  userAId: string
  userBId: string
  agencyId: string
  subAccountId?: string | null
}) => {
  let finalAgencyId = params.agencyId

  // If agencyId is missing but subAccountId is provided, fetch agencyId
  if (!finalAgencyId && params.subAccountId) {
    const { data: sub } = await supabase
      .from('SubAccount')
      .select('agencyId')
      .eq('id', params.subAccountId)
      .single()
    if (sub) finalAgencyId = sub.agencyId
  }

  if (!finalAgencyId) {
    console.error('ensureDirectConversation: Could not resolve agencyId')
    return null
  }

  // Try to find existing conversation with both participants
  // We use manual queries to bypass potential FK relationship issues (PGRST200)

  // 1. Get all direct conversations for this agency/subaccount
  const convQuery = supabase
    .from('Conversation')
    .select('id')
    .eq('type', 'direct')
    .eq('agencyId', finalAgencyId)

  if (params.subAccountId) {
    convQuery.eq('subAccountId', params.subAccountId)
  }

  const { data: conversations, error: convFetchError } = await convQuery

  if (convFetchError) {
    console.error('[ENSURE] Error fetching conversations:', convFetchError)
  }

  // 2. If we have conversations, check their participants
  if (conversations && conversations.length > 0) {
    const conversationIds = conversations.map(c => c.id)

    const { data: participants, error: partFetchError } = await supabase
      .from('ConversationParticipant')
      .select('conversationId, userId')
      .in('conversationId', conversationIds)

    if (partFetchError) {
      console.error('[ENSURE] Error fetching participants:', partFetchError)
    } else if (participants) {
      // Group participants by conversation
      const participantsByConv = participants.reduce((acc, p) => {
        if (!acc[p.conversationId]) acc[p.conversationId] = new Set()
        acc[p.conversationId].add(p.userId)
        return acc
      }, {} as Record<string, Set<string>>)

      // Find conversation with exactly these two users
      const existingId = Object.entries(participantsByConv).find(([_, userIds]) => {
        return userIds.has(params.userAId) &&
          userIds.has(params.userBId) &&
          userIds.size === 2
      })?.[0]

      if (existingId) {
        console.log('[ENSURE] Found existing conversation:', existingId)
        return existingId
      }
    }
  }

  console.log('[ENSURE] No matching conversation found, creating new one...')

  // Create new conversation
  const conversationId = crypto.randomUUID()
  const { error: convErr } = await supabase
    .from('Conversation')
    .insert({
      id: conversationId,
      type: 'direct',
      title: null,
      agencyId: finalAgencyId,
      subAccountId: params.subAccountId ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessageAt: null,
    })

  if (convErr) {
    console.error('Error creating conversation:', convErr)
    return null
  }

  const participants = [params.userAId, params.userBId].map((uid) => ({
    id: crypto.randomUUID(),
    conversationId,
    userId: uid,
    role: 'member',
    joinedAt: new Date().toISOString(),
    lastReadAt: null as string | null,
  }))

  const { error: partErr } = await supabase
    .from('ConversationParticipant')
    .insert(participants)

  if (partErr) {
    console.error('Error adding participants:', partErr)
    return null
  }

  return conversationId
}

export const createGroupConversation = async (params: {
  agencyId: string
  title: string
  userIds: string[]
  description?: string
  iconUrl?: string
  subAccountId?: string | null
}) => {
  console.log('[QUERY] createGroupConversation called:', params.title)

  const conversationId = crypto.randomUUID()
  const { error: convErr } = await supabase
    .from('Conversation')
    .insert({
      id: conversationId,
      type: 'group',
      title: params.title,
      description: params.description || null,
      iconUrl: params.iconUrl || null,
      agencyId: params.agencyId,
      subAccountId: params.subAccountId ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessageAt: null,
    })

  if (convErr) {
    console.error('Error creating group conversation:', convErr)
    return null
  }

  const participants = params.userIds.map((uid) => ({
    id: crypto.randomUUID(),
    conversationId,
    userId: uid,
    role: 'member',
    joinedAt: new Date().toISOString(),
    lastReadAt: null as string | null,
  }))

  const { error: partErr } = await supabase
    .from('ConversationParticipant')
    .insert(participants)

  if (partErr) {
    console.error('Error adding group participants:', partErr)
    return null
  }

  return conversationId
}

// Get all users in an agency for conversation initiation (includes subaccount users)
export const getAgencyUsers = async (agencyId: string): Promise<Array<{
  id: string
  name: string | null
  email: string
  avatarUrl: string
  role: string
}>> => {
  // Fetch agency users
  const { data: agencyUsers, error: agencyError } = await supabase
    .from('User')
    .select('id, name, email, avatarUrl, role')
    .eq('agencyId', agencyId)
    .order('name')

  if (agencyError) {
    console.error('Error fetching agency users:', agencyError)
    return []
  }

  // Fetch subaccount IDs for this agency
  const { data: subaccounts } = await supabase
    .from('SubAccount')
    .select('id')
    .eq('agencyId', agencyId)

  const subaccountIds = subaccounts?.map(s => s.id) || []

  // Fetch users from all subaccounts
  let subaccountUsers: any[] = []
  if (subaccountIds.length > 0) {
    const { data, error: subError } = await supabase
      .from('User')
      .select('id, name, email, avatarUrl, role')
      .in('subAccountId', subaccountIds)
      .order('name')

    if (!subError && data) {
      subaccountUsers = data
    }
  }

  // Combine and deduplicate by user ID
  const allUsers = [...(agencyUsers || []), ...subaccountUsers]
  const uniqueUsers = Array.from(
    new Map(allUsers.map(user => [user.id, user])).values()
  )

  return uniqueUsers
}

// Search for agencies by email (for inter-agency messaging)
export const searchAgenciesByEmail = async (emailQuery: string): Promise<Array<{
  id: string
  name: string
  agencyLogo: string
  companyEmail: string
  ownerName: string | null
  ownerEmail: string
  ownerAvatar: string
}>> => {
  if (!emailQuery || emailQuery.length < 3) {
    return []
  }

  // Search for users whose email matches the query
  const { data: users, error: userError } = await supabase
    .from('User')
    .select('id, name, email, avatarUrl, agencyId')
    .ilike('email', `%${emailQuery}%`)
    .not('agencyId', 'is', null)
    .limit(10)

  if (userError || !users) {
    console.error('Error searching users:', userError)
    return []
  }

  // Get unique agency IDs
  const agencyIds = Array.from(new Set(users.map(u => u.agencyId).filter(Boolean)))

  if (agencyIds.length === 0) return []

  // Fetch agency details
  const { data: agencies, error: agencyError } = await supabase
    .from('Agency')
    .select('id, name, agencyLogo, companyEmail')
    .in('id', agencyIds)

  if (agencyError || !agencies) {
    console.error('Error fetching agencies:', agencyError)
    return []
  }

  // Map agencies with their matching user info
  return agencies.map(agency => {
    const matchingUser = users.find(u => u.agencyId === agency.id)
    return {
      id: agency.id,
      name: agency.name,
      agencyLogo: agency.agencyLogo,
      companyEmail: agency.companyEmail,
      ownerName: matchingUser?.name || null,
      ownerEmail: matchingUser?.email || '',
      ownerAvatar: matchingUser?.avatarUrl || ''
    }
  })
}

// Get agency owners/admins for inter-agency messaging
export const getAgencyOwner = async (agencyId: string): Promise<Array<{
  id: string
  name: string | null
  email: string
  avatarUrl: string
  role: string
}>> => {
  const { data, error } = await supabase
    .from('User')
    .select('id, name, email, avatarUrl, role')
    .eq('agencyId', agencyId)
    .in('role', ['AGENCY_OWNER', 'AGENCY_ADMIN'])
    .order('role') // AGENCY_OWNER first

  if (error) {
    console.error('Error fetching agency owners:', error)
    return []
  }

  return data || []
}

// Get all users with access to a subaccount (Agency Owners, Admins, and Subaccount Users)
export const getSubaccountUsers = async (subAccountId: string): Promise<Array<{
  id: string
  name: string | null
  email: string
  avatarUrl: string
  role: string
}>> => {
  // 1. Get the subaccount to find its agencyId
  const { data: subAccount } = await supabase
    .from('SubAccount')
    .select('agencyId')
    .eq('id', subAccountId)
    .single()

  if (!subAccount) return []

  // 2. Get Agency Owners and Admins (they have access to all subaccounts)
  const { data: agencyUsers, error: agencyError } = await supabase
    .from('User')
    .select('id, name, email, avatarUrl, role')
    .eq('agencyId', subAccount.agencyId)
    .in('role', ['AGENCY_OWNER', 'AGENCY_ADMIN'])

  if (agencyError) {
    console.error('Error fetching agency users for subaccount:', agencyError)
    return []
  }

  // 3. Get Subaccount Users who have permission for this subaccount
  const { data: permissions, error: permissionError } = await supabase
    .from('Permissions')
    .select('email')
    .eq('subAccountId', subAccountId)
    .eq('access', true)

  if (permissionError) {
    console.error('Error fetching subaccount permissions:', permissionError)
    return agencyUsers || []
  }

  const permittedEmails = permissions?.map(p => p.email) || []

  let subaccountUsers: any[] = []
  if (permittedEmails.length > 0) {
    const { data: users, error: usersError } = await supabase
      .from('User')
      .select('id, name, email, avatarUrl, role')
      .in('email', permittedEmails)

    if (!usersError && users) {
      subaccountUsers = users
    }
  }

  // Combine and deduplicate
  const allUsers = [...(agencyUsers || []), ...subaccountUsers]
  const uniqueUsers = Array.from(new Map(allUsers.map(item => [item.id, item])).values())

  return uniqueUsers
}

// Get conversation with participant details
export const getConversationWithParticipants = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('Conversation')
    .select(`
      *,
      ConversationParticipant (
        *,
        User (
          id,
          name,
          email,
          avatarUrl,
          role
        )
      )
    `)
    .eq('id', conversationId)
    .single()

  if (error) {
    console.error('Error fetching conversation with participants:', error)
    return null
  }

  return data
}

// Alternative: Get conversation with participants manually (bypasses foreign key relationship issues)
export const getConversationWithParticipantsManual = async (conversationId: string) => {
  console.log('🔧 Using manual query for conversation:', conversationId)

  // First, get the conversation
  const { data: conversation, error: convError } = await supabase
    .from('Conversation')
    .select('*')
    .eq('id', conversationId)
    .single()

  if (convError || !conversation) {
    console.error('Error fetching conversation:', convError)
    return null
  }

  console.log('✅ Conversation found:', conversation)

  // Then, get the participants
  const { data: participants, error: partError } = await supabase
    .from('ConversationParticipant')
    .select('*')
    .eq('conversationId', conversationId)

  if (partError) {
    console.error('Error fetching participants:', partError)
    return { ...conversation, ConversationParticipant: [] }
  }

  console.log('✅ Participants found:', participants)

  // For each participant, get their user details
  const participantsWithUsers = await Promise.all(
    (participants || []).map(async (participant) => {
      const { data: user } = await supabase
        .from('User')
        .select('id, name, email, avatarUrl, role')
        .eq('id', participant.userId)
        .single()

      return {
        ...participant,
        User: user
      }
    })
  )

  console.log('✅ Participants with user details:', participantsWithUsers)

  return {
    ...conversation,
    ConversationParticipant: participantsWithUsers
  }
}

// Delete a conversation
export const deleteConversation = async (conversationId: string) => {
  const { error } = await supabase
    .from('Conversation')
    .delete()
    .eq('id', conversationId)

  if (error) {
    console.error('Error deleting conversation:', error)
    return false
  }

  return true
}

// Utility Functions
export const verifyAndAcceptInvitation = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Check for pending invitations
  const { data: invitation } = await supabase
    .from('Invitation')
    .select('*')
    .eq('email', user.email)
    .eq('status', 'PENDING')
    .single()

  if (invitation) {
    // Create user and update invitation
    const userData = {
      id: user.id,
      name: `${user.user_metadata.first_name || ''} ${user.user_metadata.last_name || ''}`.trim(),
      email: user.email!,
      avatarUrl: user.user_metadata.avatar_url || '',
      role: invitation.role,
      agencyId: invitation.agencyId
    }

    const newUser = await createUser(userData)

    if (newUser) {
      // Update invitation status
      await supabase
        .from('Invitation')
        .update({ status: 'ACCEPTED' })
        .eq('id', invitation.id)

      return invitation.agencyId
    }
  }

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('User')
    .select('agencyId')
    .eq('email', user.email)
    .single()

  return existingUser?.agencyId || null
}

export const uploadChatAttachment = async (file: File) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('chat-attachments')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Error uploading file:', uploadError)
    return null
  }

  const { data } = supabase.storage.from('chat-attachments').getPublicUrl(filePath)
  return data.publicUrl
}
