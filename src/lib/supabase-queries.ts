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
  const query = supabase
    .from('Conversation')
    .select(
      `*,
       ConversationParticipant (*),
       Message:Message (* )`
    )
    .order('lastMessageAt', { ascending: false })

  if (opts.agencyId) query.eq('agencyId', opts.agencyId)
  if (opts.subAccountId) query.eq('subAccountId', opts.subAccountId)

  // Filter to conversations where current user participates
  // Using an inner join via filter on related table
  // Supabase doesn't support where on related alias directly; fetch all and filter client-side if needed
  const { data, error } = await query

  if (error) {
    console.error('Error fetching conversations:', error)
    return [] as Conversation[]
  }

  const conversations = (data as unknown as (Conversation & { ConversationParticipant: ConversationParticipant[] })[])
    .filter((c) => c.ConversationParticipant?.some((p) => p.userId === userId))

  return conversations
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

export const getConversationMessages = async (conversationId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('Message')
    .select('*')
    .eq('conversationId', conversationId)
    .order('createdAt', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Error fetching messages:', error)
    return [] as Message[]
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
  const { data, error } = await supabase
    .from('Message')
    .insert({
      id: crypto.randomUUID(),
      conversationId: payload.conversationId,
      senderId: payload.senderId,
      content: payload.content,
      type: payload.type || 'text',
      metadata: (payload.metadata ?? null) as unknown as Database['public']['Tables']['Message']['Row']['metadata'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEdited: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error sending message:', error)
    return null
  }

  // Update conversation lastMessageAt
  await supabase
    .from('Conversation')
    .update({ lastMessageAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    .eq('id', payload.conversationId)

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
  // Try to find existing conversation with both participants
  const { data: existing } = await supabase
    .from('Conversation')
    .select('id, type, ConversationParticipant (*)')
    .eq('type', 'direct')
    .eq('agencyId', params.agencyId)

  const match = (existing as unknown as (Conversation & { ConversationParticipant: ConversationParticipant[] })[] | null)?.find((c) => {
    const userIds = new Set(c.ConversationParticipant?.map((p) => p.userId))
    return userIds.has(params.userAId) && userIds.has(params.userBId) && userIds.size === 2
  })

  if (match) return match.id

  // Create new conversation
  const conversationId = crypto.randomUUID()
  const { error: convErr } = await supabase
    .from('Conversation')
    .insert({
      id: conversationId,
      type: 'direct',
      title: null,
      agencyId: params.agencyId,
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

// Get all users in an agency for conversation initiation
export const getAgencyUsers = async (agencyId: string) => {
  const { data, error } = await supabase
    .from('User')
    .select('id, name, email, avatarUrl, role')
    .eq('agencyId', agencyId)
    .order('name')

  if (error) {
    console.error('Error fetching agency users:', error)
    return []
  }

  return data || []
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
