import {
  Contact,
  Lane,
  Notification,
  Role,
  Tag,
  Ticket,
  User,
} from '@/lib/database.types'
import {
  _getTicketsWithAllRelations,
  getAuthUserDetails,
  getFunnels,
  getMedia,
  getPipelineDetails,
  getTicketsWithTags,
  getUserPermissions,
} from './queries'
import { supabase } from './supabase'
import { z } from 'zod'

import Stripe from 'stripe'

export type NotificationWithUser =
  | ({
    User: {
      id: string
      name: string
      avatarUrl: string
      email: string
      createdAt: string
      updatedAt: string
      role: Role
      agencyId: string | null
    }
  } & Notification)[]
  | undefined

export type UserWithPermissionsAndSubAccounts = Awaited<
  ReturnType<typeof getUserPermissions>
>

export const FunnelPageSchema = z.object({
  name: z.string().min(1),
  pathName: z.string().optional(),
})

const __getUsersWithAgencySubAccountPermissionsSidebarOptions = async (
  agencyId: string
) => {
  const { data } = await supabase
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
    .eq('Agency.id', agencyId)
    .single()

  return data
}

export type AuthUserWithAgencySigebarOptionsSubAccounts =
  Awaited<ReturnType<typeof getAuthUserDetails>>

export type UsersWithAgencySubAccountPermissionsSidebarOptions =
  Awaited<ReturnType<typeof __getUsersWithAgencySubAccountPermissionsSidebarOptions>>

export type GetMediaFiles = Awaited<ReturnType<typeof getMedia>>

export type CreateMediaType = {
  name: string
  link: string
  type?: string | null
  subaccountId?: string
  createdAt?: string
  updatedAt?: string
}

export type TicketAndTags = Ticket & {
  Tags: Tag[]
  Assigned: User | null
  Customer: Contact | null
}

export type LaneDetail = Lane & {
  Tickets: TicketAndTags[]
}

export const CreatePipelineFormSchema = z.object({
  name: z.string().min(1),
})

export const CreateFunnelFormSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  subDomainName: z.string().optional(),
  favicon: z.string().optional(),
})

export type PipelineDetailsWithLanesCardsTagsTickets = Awaited<
  ReturnType<typeof getPipelineDetails>
>

export const LaneFormSchema = z.object({
  name: z.string().min(1),
})

export type TicketWithTags = Awaited<ReturnType<typeof getTicketsWithTags>>

const currencyNumberRegex = /^\d+(\.\d{1,2})?$/

export const TicketFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  value: z.string().refine((value) => currencyNumberRegex.test(value), {
    message: 'Value must be a valid price.',
  }),
})

export type TicketDetails = Awaited<ReturnType<typeof _getTicketsWithAllRelations>>

export const ContactUserFormSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email(),
})

export type Address = {
  city: string
  country: string
  line1: string
  postal_code: string
  state: string
}

export type ShippingInfo = {
  address: Address
  name: string
}

export type StripeCustomerType = {
  email: string
  name: string
  shipping: ShippingInfo
  address: Address
}

export type PricesList = Stripe.ApiList<Stripe.Price>

export type FunnelsForSubAccount = Awaited<ReturnType<typeof getFunnels>>[0]

export type UpsertFunnelPage = {
  name: string
  pathName?: string
  funnelId: string
  order: number
  visits?: number
  previewImage?: string | null
}

export type Wallet = {
  id: string
  agencyId: string | null
  subAccountId: string | null
  balance: number
  currency: string
  createdAt: string
  updatedAt: string
}

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'TRANSFER' | 'C2B' | 'B2C' | 'B2B' | 'STK_PUSH'
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED' | 'CANCELLED'

export type Transaction = {
  id: string
  walletId: string
  amount: number
  type: TransactionType
  status: TransactionStatus
  reference: string | null
  phoneNumber: string | null
  description: string | null
  metadata: any
  createdAt: string
  updatedAt: string
}

export type MpesaEnvironment = 'SANDBOX' | 'PRODUCTION'

export type MpesaSettings = {
  id: string
  agencyId: string | null
  subAccountId: string | null
  shortCode: string
  consumerKey: string
  consumerSecret: string
  passkey: string | null
  environment: MpesaEnvironment
  callbackUrl: string | null
  createdAt: string
  updatedAt: string
}

export const CreateTaskLaneFormSchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
})

export const CreateTaskFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  assignedUserId: z.string().optional(), // Deprecated, keeping for backward compatibility if needed
  assignees: z.array(z.string()).optional(), // New field for multiple assignees
  laneId: z.string().min(1),
  priority: z.string().optional(),
})
