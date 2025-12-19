export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      User: {
        Row: {
          id: string
          name: string
          avatarUrl: string
          email: string
          createdAt: string
          updatedAt: string
          role: 'AGENCY_OWNER' | 'AGENCY_ADMIN' | 'SUBACCOUNT_USER' | 'SUBACCOUNT_GUEST'
          agencyId: string | null
        }
        Insert: {
          id: string
          name: string
          avatarUrl: string
          email: string
          createdAt?: string
          updatedAt?: string
          role?: 'AGENCY_OWNER' | 'AGENCY_ADMIN' | 'SUBACCOUNT_USER' | 'SUBACCOUNT_GUEST'
          agencyId?: string | null
        }
        Update: {
          id?: string
          name?: string
          avatarUrl?: string
          email?: string
          createdAt?: string
          updatedAt?: string
          role?: 'AGENCY_OWNER' | 'AGENCY_ADMIN' | 'SUBACCOUNT_USER' | 'SUBACCOUNT_GUEST'
          agencyId?: string | null
        }
      }
      Agency: {
        Row: {
          id: string
          connectAccountId: string | null
          customerId: string
          name: string
          agencyLogo: string
          companyEmail: string
          companyPhone: string
          whiteLabel: boolean
          address: string
          city: string
          zipCode: string
          state: string
          country: string
          goal: number
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id: string
          connectAccountId?: string | null
          customerId?: string
          name: string
          agencyLogo: string
          companyEmail: string
          companyPhone: string
          whiteLabel?: boolean
          address: string
          city: string
          zipCode: string
          state: string
          country: string
          goal?: number
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          connectAccountId?: string | null
          customerId?: string
          name?: string
          agencyLogo?: string
          companyEmail?: string
          companyPhone?: string
          whiteLabel?: boolean
          address?: string
          city?: string
          zipCode?: string
          state?: string
          country?: string
          goal?: number
          createdAt?: string
          updatedAt?: string
        }
      }
      SubAccount: {
        Row: {
          id: string
          connectAccountId: string | null
          name: string
          subAccountLogo: string
          createdAt: string
          updatedAt: string
          companyEmail: string
          companyPhone: string
          goal: number
          address: string
          city: string
          zipCode: string
          state: string
          country: string
          agencyId: string
        }
        Insert: {
          id: string
          connectAccountId?: string | null
          name: string
          subAccountLogo: string
          createdAt?: string
          updatedAt?: string
          companyEmail: string
          companyPhone: string
          goal?: number
          address: string
          city: string
          zipCode: string
          state: string
          country: string
          agencyId: string
        }
        Update: {
          id?: string
          connectAccountId?: string | null
          name?: string
          subAccountLogo?: string
          createdAt?: string
          updatedAt?: string
          companyEmail?: string
          companyPhone?: string
          goal?: number
          address?: string
          city?: string
          zipCode?: string
          state?: string
          country?: string
          agencyId?: string
        }
      }
      Pipeline: {
        Row: {
          id: string
          name: string
          createdAt: string
          updatedAt: string
          subAccountId: string
        }
        Insert: {
          id: string
          name: string
          createdAt?: string
          updatedAt?: string
          subAccountId: string
        }
        Update: {
          id?: string
          name?: string
          createdAt?: string
          updatedAt?: string
          subAccountId?: string
        }
      }
      Lane: {
        Row: {
          id: string
          name: string
          createdAt: string
          updatedAt: string
          pipelineId: string
          order: number
        }
        Insert: {
          id: string
          name: string
          createdAt?: string
          updatedAt?: string
          pipelineId: string
          order?: number
        }
        Update: {
          id?: string
          name?: string
          createdAt?: string
          updatedAt?: string
          pipelineId?: string
          order?: number
        }
      }
      Ticket: {
        Row: {
          id: string
          name: string
          createdAt: string
          updatedAt: string
          laneId: string
          order: number
          value: number | null
          description: string | null
          customerId: string | null
          assignedUserId: string | null
        }
        Insert: {
          id: string
          name: string
          createdAt?: string
          updatedAt?: string
          laneId: string
          order?: number
          value?: number | null
          description?: string | null
          customerId?: string | null
          assignedUserId?: string | null
        }
        Update: {
          id?: string
          name?: string
          createdAt?: string
          updatedAt?: string
          laneId?: string
          order?: number
          value?: number | null
          description?: string | null
          customerId?: string | null
          assignedUserId?: string | null
        }
      }
      Contact: {
        Row: {
          id: string
          name: string
          email: string
          createdAt: string
          updatedAt: string
          subAccountId: string
        }
        Insert: {
          id: string
          name: string
          email: string
          createdAt?: string
          updatedAt?: string
          subAccountId: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          createdAt?: string
          updatedAt?: string
          subAccountId?: string
        }
      }
      Media: {
        Row: {
          id: string
          type: string | null
          name: string
          link: string
          subAccountId: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id: string
          type?: string | null
          name: string
          link: string
          subAccountId: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          type?: string | null
          name?: string
          link?: string
          subAccountId?: string
          createdAt?: string
          updatedAt?: string
        }
      }
      Funnel: {
        Row: {
          id: string
          name: string
          createdAt: string
          updatedAt: string
          description: string | null
          published: boolean
          subDomainName: string | null
          favicon: string | null
          subAccountId: string
          liveProducts: string
        }
        Insert: {
          id: string
          name: string
          createdAt?: string
          updatedAt?: string
          description?: string | null
          published?: boolean
          subDomainName?: string | null
          favicon?: string | null
          subAccountId: string
          liveProducts?: string
        }
        Update: {
          id?: string
          name?: string
          createdAt?: string
          updatedAt?: string
          description?: string | null
          published?: boolean
          subDomainName?: string | null
          favicon?: string | null
          subAccountId?: string
          liveProducts?: string
        }
      }
      FunnelPage: {
        Row: {
          id: string
          name: string
          pathName: string
          createdAt: string
          updatedAt: string
          visits: number
          content: string | null
          order: number
          previewImage: string | null
          funnelId: string
        }
        Insert: {
          id: string
          name: string
          pathName?: string
          createdAt?: string
          updatedAt?: string
          visits?: number
          content?: string | null
          order: number
          previewImage?: string | null
          funnelId: string
        }
        Update: {
          id?: string
          name?: string
          pathName?: string
          createdAt?: string
          updatedAt?: string
          visits?: number
          content?: string | null
          order?: number
          previewImage?: string | null
          funnelId?: string
        }
      }
      Notification: {
        Row: {
          id: string
          notification: string
          agencyId: string
          subAccountId: string | null
          userId: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id: string
          notification: string
          agencyId: string
          subAccountId?: string | null
          userId: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          notification?: string
          agencyId?: string
          subAccountId?: string | null
          userId?: string
          createdAt?: string
          updatedAt?: string
        }
      }
      ,
      Conversation: {
        Row: {
          id: string
          title: string | null
          type: string
          agencyId: string
          subAccountId: string | null
          createdAt: string | null
          updatedAt: string | null
          lastMessageAt: string | null
        }
        Insert: {
          id: string
          title?: string | null
          type: string
          agencyId: string
          subAccountId?: string | null
          createdAt?: string | null
          updatedAt?: string | null
          lastMessageAt?: string | null
        }
        Update: {
          id?: string
          title?: string | null
          type?: string
          agencyId?: string
          subAccountId?: string | null
          createdAt?: string | null
          updatedAt?: string | null
          lastMessageAt?: string | null
        }
      }
      ,
      ConversationParticipant: {
        Row: {
          id: string
          conversationId: string
          userId: string
          role: string | null
          joinedAt: string | null
          lastReadAt: string | null
        }
        Insert: {
          id: string
          conversationId: string
          userId: string
          role?: string | null
          joinedAt?: string | null
          lastReadAt?: string | null
        }
        Update: {
          id?: string
          conversationId?: string
          userId?: string
          role?: string | null
          joinedAt?: string | null
          lastReadAt?: string | null
        }
      }
      ,
      Message: {
        Row: {
          id: string
          conversationId: string
          senderId: string
          content: string
          type: string | null
          metadata: Json | null
          createdAt: string | null
          updatedAt: string | null
          isEdited: boolean | null
          replyToId: string | null
        }
        Insert: {
          id: string
          conversationId: string
          senderId: string
          content: string
          type?: string | null
          metadata?: Json | null
          createdAt?: string | null
          updatedAt?: string | null
          isEdited?: boolean | null
          replyToId?: string | null
        }
        Update: {
          id?: string
          conversationId?: string
          senderId?: string
          content?: string
          type?: string | null
          metadata?: Json | null
          createdAt?: string | null
          updatedAt?: string | null
          isEdited?: boolean | null
          replyToId?: string | null
        }
      }
      SubAccountNote: {
        Row: {
          id: string
          title: string
          content: string
          createdAt: string
          updatedAt: string
          subAccountId: string
          userId: string
        }
        Insert: {
          id: string
          title: string
          content: string
          createdAt?: string
          updatedAt?: string
          subAccountId: string
          userId: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          createdAt?: string
          updatedAt?: string
          subAccountId?: string
          userId?: string
        }
      }
      SubAccountFile: {
        Row: {
          id: string
          name: string
          originalName: string
          type: 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'SPREADSHEET' | 'PRESENTATION' | 'PDF' | 'OTHER'
          size: number
          url: string
          createdAt: string
          updatedAt: string
          subAccountId: string
          uploadedBy: string
        }
        Insert: {
          id: string
          name: string
          originalName: string
          type: 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'SPREADSHEET' | 'PRESENTATION' | 'PDF' | 'OTHER'
          size: number
          url: string
          createdAt?: string
          updatedAt?: string
          subAccountId: string
          uploadedBy: string
        }
        Update: {
          id?: string
          name?: string
          originalName?: string
          type?: 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'SPREADSHEET' | 'PRESENTATION' | 'PDF' | 'OTHER'
          size?: number
          url?: string
          createdAt?: string
          updatedAt?: string
          subAccountId?: string
          uploadedBy?: string
        }
      }
      SubAccountEmployee: {
        Row: {
          id: string
          subAccountId: string
          userId: string
          role: string | null
          assignedAt: string
          isActive: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id: string
          subAccountId: string
          userId: string
          role?: string | null
          assignedAt?: string
          isActive?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          subAccountId?: string
          userId?: string
          role?: string | null
          assignedAt?: string
          isActive?: boolean
          createdAt?: string
          updatedAt?: string
        }
      }
      SubAccountReport: {
        Row: {
          id: string
          title: string
          description: string | null
          type: string
          status: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED' | 'IN_REVIEW'
          dueDate: string | null
          completedDate: string | null
          createdAt: string
          updatedAt: string
          subAccountId: string
          assignedTo: string | null
          createdBy: string
        }
        Insert: {
          id: string
          title: string
          description?: string | null
          type: string
          status?: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED' | 'IN_REVIEW'
          dueDate?: string | null
          completedDate?: string | null
          createdAt?: string
          updatedAt?: string
          subAccountId: string
          assignedTo?: string | null
          createdBy: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: string
          status?: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED' | 'IN_REVIEW'
          dueDate?: string | null
          completedDate?: string | null
          createdAt?: string
          updatedAt?: string
          subAccountId?: string
          assignedTo?: string | null
          createdBy?: string
        }
      }
      TaskBoard: {
        Row: {
          id: string
          name: string
          agencyId: string | null
          subAccountId: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          name: string
          agencyId?: string | null
          subAccountId?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string
          agencyId?: string | null
          subAccountId?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      TaskLane: {
        Row: {
          id: string
          name: string
          boardId: string
          order: number
          color: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          name: string
          boardId: string
          order?: number
          color?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string
          boardId?: string
          order?: number
          [_ in never]: never
        }
        Enums: {
          Role: 'AGENCY_OWNER' | 'AGENCY_ADMIN' | 'SUBACCOUNT_USER' | 'SUBACCOUNT_GUEST'
          Icon: 'settings' | 'chart' | 'calendar' | 'check' | 'chip' | 'compass' | 'database' | 'flag' | 'home' | 'info' | 'link' | 'lock' | 'messages' | 'notification' | 'payment' | 'power' | 'receipt' | 'shield' | 'star' | 'tune' | 'videorecorder' | 'wallet' | 'warning' | 'headphone' | 'send' | 'pipelines' | 'person' | 'category' | 'contact' | 'clipboardIcon'
          TriggerTypes: 'CONTACT_FORM'
          ActionType: 'CREATE_CONTACT'
          InvitationStatus: 'ACCEPTED' | 'REVOKED' | 'PENDING'
          Plan: 'price_1OYxkqFj9oKEERu1NbKUxXxN' | 'price_1OYxkqFj9oKEERu1KfJGWxgN'
        }
        CompositeTypes: {
          [_ in never]: never
        }
      }
    }

// Export individual types for convenience
export type User = Database['public']['Tables']['User']['Row']
export type Agency = Database['public']['Tables']['Agency']['Row']
export type SubAccount = Database['public']['Tables']['SubAccount']['Row']
export type AgencySidebarOption = Database['public']['Tables']['AgencySidebarOption']['Row']
export type SubAccountSidebarOption = Database['public']['Tables']['SubAccountSidebarOption']['Row']
export type Pipeline = Database['public']['Tables']['Pipeline']['Row']
export type Lane = Database['public']['Tables']['Lane']['Row']
export type Ticket = Database['public']['Tables']['Ticket']['Row']
export type Contact = Database['public']['Tables']['Contact']['Row']
export type Tag = Database['public']['Tables']['Tag']['Row']
export type Notification = Database['public']['Tables']['Notification']['Row']
export type Permission = Database['public']['Tables']['Permission']['Row']
export type Media = Database['public']['Tables']['Media']['Row']
export type Funnel = Database['public']['Tables']['Funnel']['Row']
export type FunnelPage = Database['public']['Tables']['FunnelPage']['Row']
export type Subscription = Database['public']['Tables']['Subscription']['Row']
export type Invitation = Database['public']['Tables']['Invitation']['Row']
name: string
originalName: string
type: 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'SPREADSHEET' | 'PRESENTATION' | 'PDF' | 'OTHER'
size: number
url: string
createdAt: string
updatedAt: string
subAccountId: string
uploadedBy: string
        }
Insert: {
  id: string
  name: string
  originalName: string
  type: 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'SPREADSHEET' | 'PRESENTATION' | 'PDF' | 'OTHER'
  size: number
  url: string
  createdAt ?: string
  updatedAt ?: string
  subAccountId: string
  uploadedBy: string
}
Update: {
  id ?: string
  name ?: string
  originalName ?: string
  type ?: 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'SPREADSHEET' | 'PRESENTATION' | 'PDF' | 'OTHER'
  size ?: number
  url ?: string
  createdAt ?: string
  updatedAt ?: string
  subAccountId ?: string
  uploadedBy ?: string
}
      }
SubAccountEmployee: {
  Row: {
    id: string
    subAccountId: string
    userId: string
    role: string | null
    assignedAt: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
  Insert: {
    id: string
    subAccountId: string
    userId: string
    role ?: string | null
    assignedAt ?: string
    isActive ?: boolean
    createdAt ?: string
    updatedAt ?: string
  }
  Update: {
    id ?: string
    subAccountId ?: string
    userId ?: string
    role ?: string | null
    assignedAt ?: string
    isActive ?: boolean
    createdAt ?: string
    updatedAt ?: string
  }
}
SubAccountReport: {
  Row: {
    id: string
    title: string
    description: string | null
    type: string
    status: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED' | 'IN_REVIEW'
    dueDate: string | null
    completedDate: string | null
    createdAt: string
    updatedAt: string
    subAccountId: string
    assignedTo: string | null
    createdBy: string
  }
  Insert: {
    id: string
    title: string
    description ?: string | null
    type: string
    status ?: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED' | 'IN_REVIEW'
    dueDate ?: string | null
    completedDate ?: string | null
    createdAt ?: string
    updatedAt ?: string
    subAccountId: string
    assignedTo ?: string | null
    createdBy: string
  }
  Update: {
    id ?: string
    title ?: string
    description ?: string | null
    type ?: string
    status ?: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED' | 'IN_REVIEW'
    dueDate ?: string | null
    completedDate ?: string | null
    createdAt ?: string
    updatedAt ?: string
    subAccountId ?: string
    assignedTo ?: string | null
    createdBy ?: string
  }
}
TaskBoard: {
  Row: {
    id: string
    name: string
    agencyId: string | null
    subAccountId: string | null
    createdAt: string
    updatedAt: string
  }
  Insert: {
    id ?: string
    name: string
    agencyId ?: string | null
    subAccountId ?: string | null
    createdAt ?: string
    updatedAt ?: string
  }
  Update: {
    id ?: string
    name ?: string
    agencyId ?: string | null
    subAccountId ?: string | null
    createdAt ?: string
    updatedAt ?: string
  }
}
TaskLane: {
  Row: {
    id: string
    name: string
    boardId: string
    order: number
    color: string | null
    createdAt: string
    updatedAt: string
  }
  Insert: {
    id ?: string
    name: string
    boardId: string
    order ?: number
    color ?: string | null
    createdAt ?: string
    updatedAt ?: string
  }
  Update: {
    id ?: string
    name ?: string
    boardId ?: string
    order ?: number
    [_ in never]: never
  }
  Enums: {
    Role: 'AGENCY_OWNER' | 'AGENCY_ADMIN' | 'SUBACCOUNT_USER' | 'SUBACCOUNT_GUEST'
    Icon: 'settings' | 'chart' | 'calendar' | 'check' | 'chip' | 'compass' | 'database' | 'flag' | 'home' | 'info' | 'link' | 'lock' | 'messages' | 'notification' | 'payment' | 'power' | 'receipt' | 'shield' | 'star' | 'tune' | 'videorecorder' | 'wallet' | 'warning' | 'headphone' | 'send' | 'pipelines' | 'person' | 'category' | 'contact' | 'clipboardIcon'
    TriggerTypes: 'CONTACT_FORM'
    ActionType: 'CREATE_CONTACT'
    InvitationStatus: 'ACCEPTED' | 'REVOKED' | 'PENDING'
    Plan: 'price_1OYxkqFj9oKEERu1NbKUxXxN' | 'price_1OYxkqFj9oKEERu1KfJGWxgN'
  }
  [_ in never]: never
}
}
Dashboard: {
  Row: {
    id: string
    userId: string
    agencyId: string | null
    subAccountId: string | null
    name: string
    description: string | null
    isDefault: boolean
    isPrivate: boolean
    isFavorite: boolean
    lastAccessedAt: string
    createdAt: string
    updatedAt: string
  }
  Insert: {
    id ?: string
    userId: string
    agencyId ?: string | null
    subAccountId ?: string | null
    name: string
    description ?: string | null
    isDefault ?: boolean
    isPrivate ?: boolean
    isFavorite ?: boolean
    lastAccessedAt ?: string
    createdAt ?: string
    updatedAt ?: string
  }
  Update: {
    id ?: string
    userId ?: string
    agencyId ?: string | null
    subAccountId ?: string | null
    name ?: string
    description ?: string | null
    isDefault ?: boolean
    isPrivate ?: boolean
    isFavorite ?: boolean
    lastAccessedAt ?: string
    createdAt ?: string
    updatedAt ?: string
  }
}
DashboardCard: {
  Row: {
    id: string
    dashboardId: string
    cardType: string
    positionX: number
    positionY: number
    width: number
    height: number
    config: Json
    order: number
    createdAt: string
    updatedAt: string
  }
  Insert: {
    id ?: string
    dashboardId: string
    cardType: string
    positionX ?: number
    positionY ?: number
    width ?: number
    height ?: number
    config ?: Json
    order ?: number
    createdAt ?: string
    updatedAt ?: string
  }
  Update: {
    id ?: string
    dashboardId ?: string
    cardType ?: string
    positionX ?: number
    positionY ?: number
    width ?: number
    height ?: number
    config ?: Json
    order ?: number
    createdAt ?: string
    updatedAt ?: string
  }
}
DashboardShare: {
  Row: {
    id: string
    dashboardId: string
    sharedWithUserId: string
    permission: string
    createdAt: string
  }
  Insert: {
    id ?: string
    dashboardId: string
    sharedWithUserId: string
    permission ?: string
    createdAt ?: string
  }
  Update: {
    id ?: string
    dashboardId ?: string
    sharedWithUserId ?: string
    permission ?: string
    createdAt ?: string
  }
}
DashboardTemplate: {
  Row: {
    id: string
    name: string
    description: string | null
    category: string
    layout: Json
    isPublic: boolean
    createdAt: string
  }
  Insert: {
    id ?: string
    name: string
    description ?: string | null
    category: string
    layout ?: Json
    isPublic ?: boolean
    createdAt ?: string
  }
  Update: {
    id ?: string
    name ?: string
    description ?: string | null
    category ?: string
    layout ?: Json
    isPublic ?: boolean
    createdAt ?: string
  }
}
Enums: {
  Role: 'AGENCY_OWNER' | 'AGENCY_ADMIN' | 'SUBACCOUNT_USER' | 'SUBACCOUNT_GUEST'
  Icon: 'settings' | 'chart' | 'calendar' | 'check' | 'chip' | 'compass' | 'database' | 'flag' | 'home' | 'info' | 'link' | 'lock' | 'messages' | 'notification' | 'payment' | 'power' | 'receipt' | 'shield' | 'star' | 'tune' | 'videorecorder' | 'wallet' | 'warning' | 'headphone' | 'send' | 'pipelines' | 'person' | 'category' | 'contact' | 'clipboardIcon'
  TriggerTypes: 'CONTACT_FORM'
  ActionType: 'CREATE_CONTACT'
  InvitationStatus: 'ACCEPTED' | 'REVOKED' | 'PENDING'
  Plan: 'price_1OYxkqFj9oKEERu1NbKUxXxN' | 'price_1OYxkqFj9oKEERu1KfJGWxgN'
}
CompositeTypes: {
  [_ in never]: never
}
}
    }

// Export individual types for convenience
export type User = Database['public']['Tables']['User']['Row']
export type Agency = Database['public']['Tables']['Agency']['Row']
export type SubAccount = Database['public']['Tables']['SubAccount']['Row']
export type AgencySidebarOption = Database['public']['Tables']['AgencySidebarOption']['Row']
export type SubAccountSidebarOption = Database['public']['Tables']['SubAccountSidebarOption']['Row']
export type Pipeline = Database['public']['Tables']['Pipeline']['Row']
export type Lane = Database['public']['Tables']['Lane']['Row']
export type Ticket = Database['public']['Tables']['Ticket']['Row']
export type Contact = Database['public']['Tables']['Contact']['Row']
export type Tag = Database['public']['Tables']['Tag']['Row']
export type Notification = Database['public']['Tables']['Notification']['Row']
export type Permission = Database['public']['Tables']['Permission']['Row']
export type Media = Database['public']['Tables']['Media']['Row']
export type Funnel = Database['public']['Tables']['Funnel']['Row']
export type FunnelPage = Database['public']['Tables']['FunnelPage']['Row']
export type Subscription = Database['public']['Tables']['Subscription']['Row']
export type Invitation = Database['public']['Tables']['Invitation']['Row']
export type SubAccountNote = Database['public']['Tables']['SubAccountNote']['Row']
export type SubAccountFile = Database['public']['Tables']['SubAccountFile']['Row']
export type SubAccountEmployee = Database['public']['Tables']['SubAccountEmployee']['Row']
export type SubAccountReport = Database['public']['Tables']['SubAccountReport']['Row']
export type TaskBoard = Database['public']['Tables']['TaskBoard']['Row']
export type TaskLane = Database['public']['Tables']['TaskLane']['Row']
export type Task = Database['public']['Tables']['Task']['Row']
export type TaskComment = Database['public']['Tables']['TaskComment']['Row']
export type Dashboard = Database['public']['Tables']['Dashboard']['Row']
export type DashboardCard = Database['public']['Tables']['DashboardCard']['Row']
export type DashboardShare = Database['public']['Tables']['DashboardShare']['Row']
export type DashboardTemplate = Database['public']['Tables']['DashboardTemplate']['Row']

// Role type
export type Role = 'AGENCY_OWNER' | 'AGENCY_ADMIN' | 'SUBACCOUNT_USER' | 'SUBACCOUNT_GUEST'