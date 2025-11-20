// Mock data service for testing without Stripe/database
export const mockData = {
  // Agency mock data
  agency: {
    id: 'test-agency-123',
    name: 'Test Agency',
    connectAccountId: 'acct_test123', // Simulate connected Stripe account
    goal: 10,
    companyEmail: 'test@agency.com',
    agencyLogo: '/assets/plura-logo.svg',
    whiteLabel: true,
  },

  // Subaccounts mock data
  subaccounts: [
    {
      id: 'test-sub-1',
      name: 'E-commerce Store',
      subAccountLogo: '/assets/plura-logo.svg',
      connectAccountId: 'acct_test456',
      companyEmail: 'store@example.com',
    },
    {
      id: 'test-sub-2', 
      name: 'SaaS Platform',
      subAccountLogo: '/assets/plura-logo.svg',
      connectAccountId: 'acct_test789',
      companyEmail: 'saas@example.com',
    },
    {
      id: 'test-sub-3',
      name: 'Consulting Firm',
      subAccountLogo: '/assets/plura-logo.svg',
      connectAccountId: 'acct_test101',
      companyEmail: 'consulting@example.com',
    }
  ],

  // Revenue and metrics mock data
  revenue: {
    currency: 'USD',
    currentYear: new Date().getFullYear(),
    totalRevenue: 125430.50,
    potentialRevenue: 45000.00,
    monthlyRevenue: [
      { month: 'Jan', amount: 8500 },
      { month: 'Feb', amount: 9200 },
      { month: 'Mar', amount: 11000 },
      { month: 'Apr', amount: 12800 },
      { month: 'May', amount: 13500 },
      { month: 'Jun', amount: 14200 },
      { month: 'Jul', amount: 15800 },
      { month: 'Aug', amount: 16500 },
      { month: 'Sep', amount: 17200 },
      { month: 'Oct', amount: 18900 },
      { month: 'Nov', amount: 19500 },
      { month: 'Dec', amount: 20330.50 },
    ],
    conversionRate: 12.5,
    totalSessions: 2840,
    closedSessions: 355,
    pendingSessions: 89,
  },

  // Funnels mock data
  funnels: [
    {
      id: 'funnel-1',
      name: 'E-commerce Checkout',
      subAccountId: 'test-sub-1',
      subDomainName: 'checkout-store',
      liveProducts: 'prod_123,prod_456',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-12-01'),
      FunnelPages: [
        {
          id: 'page-1',
          name: 'Landing Page',
          pathName: '/',
          visits: 1250,
          content: JSON.stringify([{
            content: [],
            id: '__body',
            name: 'Body',
            styles: { backgroundColor: 'white' },
            type: '__body',
          }]),
          order: 1,
        },
        {
          id: 'page-2',
          name: 'Product Page',
          pathName: '/product',
          visits: 890,
          content: JSON.stringify([{
            content: [],
            id: '__body',
            name: 'Body',
            styles: { backgroundColor: 'white' },
            type: '__body',
          }]),
          order: 2,
        },
        {
          id: 'page-3',
          name: 'Checkout',
          pathName: '/checkout',
          visits: 445,
          content: JSON.stringify([{
            content: [],
            id: '__body',
            name: 'Body',
            styles: { backgroundColor: 'white' },
            type: '__body',
          }]),
          order: 3,
        }
      ]
    },
    {
      id: 'funnel-2',
      name: 'SaaS Signup',
      subAccountId: 'test-sub-2',
      subDomainName: 'signup-saas',
      liveProducts: 'prod_789',
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-12-01'),
      FunnelPages: [
        {
          id: 'page-4',
          name: 'Homepage',
          pathName: '/',
          visits: 2100,
          content: JSON.stringify([{
            content: [],
            id: '__body',
            name: 'Body',
            styles: { backgroundColor: 'white' },
            type: '__body',
          }]),
          order: 1,
        },
        {
          id: 'page-5',
          name: 'Pricing',
          pathName: '/pricing',
          visits: 1200,
          content: JSON.stringify([{
            content: [],
            id: '__body',
            name: 'Body',
            styles: { backgroundColor: 'white' },
            type: '__body',
          }]),
          order: 2,
        },
        {
          id: 'page-6',
          name: 'Signup',
          pathName: '/signup',
          visits: 680,
          content: JSON.stringify([{
            content: [],
            id: '__body',
            name: 'Body',
            styles: { backgroundColor: 'white' },
            type: '__body',
          }]),
          order: 3,
        }
      ]
    }
  ],

  // Pipelines mock data
  pipelines: [
    {
      id: 'pipeline-1',
      name: 'Lead Generation',
      subAccountId: 'test-sub-1',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-12-01'),
      Lane: [
        {
          id: 'lane-1',
          name: 'New Leads',
          order: 1,
          pipelineId: 'pipeline-1',
          Tickets: [
            {
              id: 'ticket-1',
              name: 'John Doe - E-commerce Inquiry',
              description: 'Interested in our premium package',
              value: 2500,
              order: 1,
              laneId: 'lane-1',
              createdAt: new Date('2024-11-28'),
              updatedAt: new Date('2024-12-01'),
              Tags: [
                { id: 'tag-1', name: 'Hot Lead', color: 'red' },
                { id: 'tag-2', name: 'E-commerce', color: 'blue' }
              ],
              Assigned: {
                id: 'user-1',
                name: 'Sarah Johnson',
                email: 'sarah@agency.com',
                avatarUrl: '/assets/plura-logo.svg'
              },
              Customer: {
                id: 'customer-1',
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+1-555-0123'
              }
            },
            {
              id: 'ticket-2',
              name: 'Jane Smith - SaaS Consultation',
              description: 'Looking for enterprise solution',
              value: 5000,
              order: 2,
              laneId: 'lane-1',
              createdAt: new Date('2024-11-30'),
              updatedAt: new Date('2024-12-01'),
              Tags: [
                { id: 'tag-3', name: 'Enterprise', color: 'purple' },
                { id: 'tag-4', name: 'SaaS', color: 'green' }
              ],
              Assigned: {
                id: 'user-2',
                name: 'Mike Chen',
                email: 'mike@agency.com',
                avatarUrl: '/assets/plura-logo.svg'
              },
              Customer: {
                id: 'customer-2',
                name: 'Jane Smith',
                email: 'jane@company.com',
                phone: '+1-555-0456'
              }
            }
          ]
        },
        {
          id: 'lane-2',
          name: 'Qualified',
          order: 2,
          pipelineId: 'pipeline-1',
          Tickets: [
            {
              id: 'ticket-3',
              name: 'Bob Wilson - Marketing Campaign',
              description: 'Ready to proceed with full campaign',
              value: 8000,
              order: 1,
              laneId: 'lane-2',
              createdAt: new Date('2024-11-25'),
              updatedAt: new Date('2024-12-01'),
              Tags: [
                { id: 'tag-5', name: 'Marketing', color: 'orange' },
                { id: 'tag-6', name: 'Ready', color: 'green' }
              ],
              Assigned: {
                id: 'user-1',
                name: 'Sarah Johnson',
                email: 'sarah@agency.com',
                avatarUrl: '/assets/plura-logo.svg'
              },
              Customer: {
                id: 'customer-3',
                name: 'Bob Wilson',
                email: 'bob@marketing.com',
                phone: '+1-555-0789'
              }
            }
          ]
        },
        {
          id: 'lane-3',
          name: 'Proposal Sent',
          order: 3,
          pipelineId: 'pipeline-1',
          Tickets: [
            {
              id: 'ticket-4',
              name: 'Alice Brown - Web Development',
              description: 'Proposal sent, waiting for response',
              value: 12000,
              order: 1,
              laneId: 'lane-3',
              createdAt: new Date('2024-11-20'),
              updatedAt: new Date('2024-12-01'),
              Tags: [
                { id: 'tag-7', name: 'Web Dev', color: 'blue' },
                { id: 'tag-8', name: 'Proposal', color: 'yellow' }
              ],
              Assigned: {
                id: 'user-3',
                name: 'Alex Rodriguez',
                email: 'alex@agency.com',
                avatarUrl: '/assets/plura-logo.svg'
              },
              Customer: {
                id: 'customer-4',
                name: 'Alice Brown',
                email: 'alice@startup.com',
                phone: '+1-555-0321'
              }
            }
          ]
        },
        {
          id: 'lane-4',
          name: 'Closed Won',
          order: 4,
          pipelineId: 'pipeline-1',
          Tickets: [
            {
              id: 'ticket-5',
              name: 'David Lee - Brand Identity',
              description: 'Project completed successfully',
              value: 3500,
              order: 1,
              laneId: 'lane-4',
              createdAt: new Date('2024-11-15'),
              updatedAt: new Date('2024-11-30'),
              Tags: [
                { id: 'tag-9', name: 'Branding', color: 'purple' },
                { id: 'tag-10', name: 'Completed', color: 'green' }
              ],
              Assigned: {
                id: 'user-4',
                name: 'Emma Davis',
                email: 'emma@agency.com',
                avatarUrl: '/assets/plura-logo.svg'
              },
              Customer: {
                id: 'customer-5',
                name: 'David Lee',
                email: 'david@design.com',
                phone: '+1-555-0654'
              }
            }
          ]
        }
      ]
    }
  ],

  // Contacts mock data
  contacts: [
    {
      id: 'contact-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123',
      subAccountId: 'test-sub-1',
      createdAt: new Date('2024-11-28'),
      updatedAt: new Date('2024-12-01'),
    },
    {
      id: 'contact-2',
      name: 'Jane Smith',
      email: 'jane@company.com',
      phone: '+1-555-0456',
      subAccountId: 'test-sub-1',
      createdAt: new Date('2024-11-30'),
      updatedAt: new Date('2024-12-01'),
    },
    {
      id: 'contact-3',
      name: 'Bob Wilson',
      email: 'bob@marketing.com',
      phone: '+1-555-0789',
      subAccountId: 'test-sub-2',
      createdAt: new Date('2024-11-25'),
      updatedAt: new Date('2024-12-01'),
    },
    {
      id: 'contact-4',
      name: 'Alice Brown',
      email: 'alice@startup.com',
      phone: '+1-555-0321',
      subAccountId: 'test-sub-2',
      createdAt: new Date('2024-11-20'),
      updatedAt: new Date('2024-12-01'),
    },
    {
      id: 'contact-5',
      name: 'David Lee',
      email: 'david@design.com',
      phone: '+1-555-0654',
      subAccountId: 'test-sub-3',
      createdAt: new Date('2024-11-15'),
      updatedAt: new Date('2024-11-30'),
    }
  ],

  // Media mock data
  media: [
    {
      id: 'media-1',
      name: 'hero-image.jpg',
      link: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
      subAccountId: 'test-sub-1',
      createdAt: new Date('2024-11-20'),
    },
    {
      id: 'media-2',
      name: 'product-banner.png',
      link: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      subAccountId: 'test-sub-1',
      createdAt: new Date('2024-11-22'),
    },
    {
      id: 'media-3',
      name: 'logo-design.svg',
      link: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
      subAccountId: 'test-sub-2',
      createdAt: new Date('2024-11-25'),
    },
    {
      id: 'media-4',
      name: 'team-photo.jpg',
      link: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      subAccountId: 'test-sub-3',
      createdAt: new Date('2024-11-28'),
    }
  ],

  // Notifications mock data
  notifications: [
    {
      id: 'notif-1',
      notification: 'Sarah Johnson | Created new funnel "E-commerce Checkout"',
      agencyId: 'test-agency-123',
      subAccountId: 'test-sub-1',
      createdAt: new Date('2024-12-01T10:30:00Z'),
      User: {
        id: 'user-1',
        name: 'Sarah Johnson',
        email: 'sarah@agency.com',
        avatarUrl: '/assets/plura-logo.svg'
      }
    },
    {
      id: 'notif-2',
      notification: 'Mike Chen | Updated pipeline "Lead Generation"',
      agencyId: 'test-agency-123',
      subAccountId: 'test-sub-1',
      createdAt: new Date('2024-12-01T09:15:00Z'),
      User: {
        id: 'user-2',
        name: 'Mike Chen',
        email: 'mike@agency.com',
        avatarUrl: '/assets/plura-logo.svg'
      }
    },
    {
      id: 'notif-3',
      notification: 'Alex Rodriguez | Added new contact "Alice Brown"',
      agencyId: 'test-agency-123',
      subAccountId: 'test-sub-2',
      createdAt: new Date('2024-12-01T08:45:00Z'),
      User: {
        id: 'user-3',
        name: 'Alex Rodriguez',
        email: 'alex@agency.com',
        avatarUrl: '/assets/plura-logo.svg'
      }
    }
  ],

  // Team members mock data
  teamMembers: [
    {
      id: 'user-1',
      name: 'Sarah Johnson',
      email: 'sarah@agency.com',
      role: 'AGENCY_ADMIN',
      avatarUrl: '/assets/plura-logo.svg',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 'user-2',
      name: 'Mike Chen',
      email: 'mike@agency.com',
      role: 'SUBACCOUNT_USER',
      avatarUrl: '/assets/plura-logo.svg',
      createdAt: new Date('2024-02-20'),
    },
    {
      id: 'user-3',
      name: 'Alex Rodriguez',
      email: 'alex@agency.com',
      role: 'SUBACCOUNT_USER',
      avatarUrl: '/assets/plura-logo.svg',
      createdAt: new Date('2024-03-10'),
    },
    {
      id: 'user-4',
      name: 'Emma Davis',
      email: 'emma@agency.com',
      role: 'SUBACCOUNT_USER',
      avatarUrl: '/assets/plura-logo.svg',
      createdAt: new Date('2024-04-05'),
    }
  ],

  // Stripe subscription mock data
  subscription: {
    id: 'sub_test123',
    customerId: 'cus_test123',
    status: 'active',
    currentPeriodStart: new Date('2024-11-01'),
    currentPeriodEnd: new Date('2024-12-01'),
    Subscription: {
      id: 'sub_test123',
      active: true,
      priceId: 'price_test123',
      price: '$99',
      interval: 'month',
      intervalCount: 1,
    }
  },

  // Checkout sessions mock data
  checkoutSessions: [
    {
      id: 'cs_test_1',
      amount_total: 2500,
      currency: 'usd',
      status: 'complete',
      created: new Date('2024-11-30T14:30:00Z').getTime() / 1000,
      customer_details: {
        email: 'john@example.com',
        name: 'John Doe'
      }
    },
    {
      id: 'cs_test_2',
      amount_total: 5000,
      currency: 'usd',
      status: 'complete',
      created: new Date('2024-11-29T16:45:00Z').getTime() / 1000,
      customer_details: {
        email: 'jane@company.com',
        name: 'Jane Smith'
      }
    },
    {
      id: 'cs_test_3',
      amount_total: 12000,
      currency: 'usd',
      status: 'complete',
      created: new Date('2024-11-28T11:20:00Z').getTime() / 1000,
      customer_details: {
        email: 'bob@marketing.com',
        name: 'Bob Wilson'
      }
    },
    {
      id: 'cs_test_4',
      amount_total: 3500,
      currency: 'usd',
      status: 'complete',
      created: new Date('2024-11-27T09:15:00Z').getTime() / 1000,
      customer_details: {
        email: 'alice@startup.com',
        name: 'Alice Brown'
      }
    },
    {
      id: 'cs_test_5',
      amount_total: 8000,
      currency: 'usd',
      status: 'open',
      created: new Date('2024-12-01T13:00:00Z').getTime() / 1000,
      customer_details: {
        email: 'david@design.com',
        name: 'David Lee'
      }
    }
  ]
}

// Helper functions for mock data
export const getMockRevenueData = () => {
  const { revenue } = mockData
  const sessions = mockData.checkoutSessions.map(session => ({
    ...session,
    created: new Date(session.created * 1000).toLocaleDateString(),
    amount_total: session.amount_total / 100,
  }))

  const totalClosedSessions = sessions.filter(s => s.status === 'complete')
  const totalPendingSessions = sessions.filter(s => s.status === 'open' || s.status === 'expired')

  const net = totalClosedSessions.reduce((total, session) => total + (session.amount_total || 0), 0)
  const potentialIncome = totalPendingSessions.reduce((total, session) => total + (session.amount_total || 0), 0)
  const closingRate = sessions.length > 0 ? (totalClosedSessions.length / sessions.length) * 100 : 0

  return {
    currency: revenue.currency,
    sessions,
    totalClosedSessions,
    totalPendingSessions,
    net,
    potentialIncome,
    closingRate,
    currentYear: revenue.currentYear
  }
}

export const getMockFunnelPerformance = (subaccountId: string) => {
  return mockData.funnels
    .filter(funnel => funnel.subAccountId === subaccountId)
    .map(funnel => ({
      ...funnel,
      totalFunnelVisits: funnel.FunnelPages.reduce((total, page) => total + page.visits, 0),
    }))
}

export const getMockPipelineData = (subaccountId: string) => {
  return mockData.pipelines.find(pipeline => pipeline.subAccountId === subaccountId) || mockData.pipelines[0]
}

export const getMockContacts = (subaccountId: string) => {
  return mockData.contacts.filter(contact => contact.subAccountId === subaccountId)
}

export const getMockMedia = (subaccountId: string) => {
  return mockData.media.filter(media => media.subAccountId === subaccountId)
}

export const getMockNotifications = (agencyId: string) => {
  return mockData.notifications.filter(notif => notif.agencyId === agencyId)
}
