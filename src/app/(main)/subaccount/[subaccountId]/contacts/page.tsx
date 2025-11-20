import BlurPage from '@/components/global/blur-page'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'
import format from 'date-fns/format'
import React from 'react'
import CraeteContactButton from './_components/create-contact-btn'
import RefreshButton from './_components/refresh-button'

type Props = {
  params: { subaccountId: string }
}

const ContactPage = async ({ params }: Props) => {
  type Contact = Database['public']['Tables']['Contact']['Row']
  type Ticket = Database['public']['Tables']['Ticket']['Row']
  
  type ContactWithTickets = Contact & {
    Tickets: Ticket[]
  }

  console.log('🔍 Loading contacts for subaccount:', params.subaccountId)

  // Fetch contacts with tickets
  const { data: contacts, error: contactsError } = await supabase
    .from('Contact')
    .select('*')
    .eq('subAccountId', params.subaccountId)
    .order('createdAt', { ascending: true })
  
  console.log('🔍 Fetched contacts:', contacts)

  if (contactsError) {
    console.error('Error fetching contacts:', contactsError)
  }

  // Fetch all tickets for these contacts
  const contactIds = contacts?.map(c => c.id) || []
  const { data: tickets, error: ticketsError } = contactIds.length > 0
    ? await supabase
        .from('Ticket')
        .select('id, customerId, value')
        .in('customerId', contactIds)
    : { data: [], error: null }

  if (ticketsError) {
    console.error('Error fetching tickets:', ticketsError)
  }

  // Combine contacts with their tickets
  const contactsWithTickets: ContactWithTickets[] = (contacts || []).map(contact => ({
    ...contact,
    Tickets: (tickets || []).filter(t => t.customerId === contact.id)
  }))

  const allContacts = contactsWithTickets
  
  console.log('🔍 Contacts with tickets:', allContacts)
  console.log('✅ Total contacts found:', allContacts.length)

  const formatTotal = (tickets: Ticket[]) => {
    if (!tickets || !tickets.length) return '$0.00'
    const amt = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
    })

    const laneAmt = tickets.reduce(
      (sum, ticket) => sum + (Number(ticket?.value) || 0),
      0
    )

    return amt.format(laneAmt)
  }
  
  if (!allContacts || allContacts.length === 0) {
    return (
      <BlurPage>
        <div className="flex items-center justify-between p-4">
          <h1 className="text-4xl">Contacts</h1>
          <div className="flex gap-2">
            <CraeteContactButton subaccountId={params.subaccountId} />
            <RefreshButton />
          </div>
        </div>
        <p className="text-muted-foreground p-4">No contacts found. Create your first contact to get started.</p>
      </BlurPage>
    )
  }
  return (
    <BlurPage>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-4xl">Contacts</h1>
        <div className="flex gap-2">
          <CraeteContactButton subaccountId={params.subaccountId} />
          <RefreshButton />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[300px]">Email</TableHead>
            <TableHead className="w-[200px]">Active</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="text-right">Total Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {allContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage alt="@shadcn" />
                  <AvatarFallback className="bg-primary text-white">
                    {contact.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>
                {formatTotal(contact.Tickets) === '$0.00' ? (
                  <Badge variant={'destructive'}>Inactive</Badge>
                ) : (
                  <Badge className="bg-emerald-700">Active</Badge>
                )}
              </TableCell>
              <TableCell>{format(new Date(contact.createdAt), 'MM/dd/yyyy')}</TableCell>
              <TableCell className="text-right">
                {formatTotal(contact.Tickets)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </BlurPage>
  )
}

export default ContactPage
