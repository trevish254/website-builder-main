# Group Chat Management - Implementation Guide

## Overview
Complete group chat management system with database integration for creating, editing, and managing group conversations.

## Features Implemented

### 1. **Edit Group Details**
- Update group name
- Update group description  
- Upload/change group icon
- Real-time database sync

### 2. **Add Members**
- Search users by name or email
- Add multiple members to group
- Real-time member list updates

### 3. **Group Settings**
- Edit group details
- Manage notifications
- Leave group
- Delete group (admin only)

### 4. **Meeting Scheduler**
- Schedule group meetings
- Multiple notifications
- Color-coded labels
- File attachments

## Database Setup

### Step 1: Run the Group Chat Schema
Execute `supabase/group-chat-schema.sql` in your Supabase SQL Editor. This creates:

- `Conversation` table (groups and DMs)
- `ConversationParticipant` table (many-to-many relationships)
- RLS policies for security
- Indexes for performance
- Realtime subscriptions

### Step 2: Create Storage Bucket
Execute `supabase/storage-group-icons.sql` OR create manually:

1. Go to Supabase Dashboard → Storage
2. Click "New Bucket"
3. Name: `group-icons`
4. Make it **Public**
5. RLS policies are handled by the SQL script

### Step 3: Update Meetings Table (if needed)
The schema adds `conversationId` to link meetings with groups:

```sql
ALTER TABLE "Meetings" 
ADD COLUMN IF NOT EXISTS "conversationId" TEXT REFERENCES "Conversation"(id) ON DELETE CASCADE;
```

## Database Schema

### Conversation Table
```typescript
{
  id: string (TEXT PRIMARY KEY)
  type: 'direct' | 'group'
  title: string (group name)
  description: string
  iconUrl: string
  createdBy: UUID
  createdAt: timestamp
  updatedAt: timestamp
}
```

### ConversationParticipant Table
```typescript
{
  id: UUID PRIMARY KEY
  conversationId: string (FK to Conversation)
  userId: UUID (FK to auth.users)
  role: 'admin' | 'member'
  joinedAt: timestamp
  lastReadAt: timestamp
}
```

## API Functions

### handleUpdateGroup()
Updates group name, description, and icon.

**Database Operations:**
1. Uploads new icon to `group-icons` storage bucket (if provided)
2. Updates `Conversation` table with new details

**Permissions:** Only group admins can update

### handleAddMember(userId, userName)
Adds a new member to the group.

**Database Operations:**
1. Inserts new record in `ConversationParticipant` table
2. Sets role as 'member'

**Permissions:** Only group admins can add members

### handleLeaveGroup()
Removes current user from the group.

**Database Operations:**
1. Deletes user's record from `ConversationParticipant` table

**Permissions:** Any member can leave

### handleDeleteGroup()
Deletes the entire group conversation.

**Database Operations:**
1. Deletes record from `Conversation` table
2. Cascade deletes all participants and related data

**Permissions:** Only group admins can delete

## Security (RLS Policies)

### Conversation Policies
- ✅ Users can view conversations they're part of
- ✅ Users can create conversations
- ✅ Only admins can update conversations
- ✅ Only admins can delete conversations

### ConversationParticipant Policies
- ✅ Users can view participants of their conversations
- ✅ Admins can add participants
- ✅ Users can remove themselves, admins can remove anyone

## UI Components

### Group Sidebar
Located in: `src/components/global/chat/chat-window.tsx`

**Sections:**
1. Group Info (avatar, name, description)
2. Members List (with Add Member button)
3. Meetings (schedule and view)
4. Group Settings (edit, leave, delete)

### Dialogs
1. **Edit Group Dialog** - Update group details
2. **Add Member Dialog** - Search and add users
3. **Schedule Meeting Dialog** - Create group meetings

## Usage Example

### Creating a Group
```typescript
const { data, error } = await supabase
  .from('Conversation')
  .insert({
    type: 'group',
    title: 'Project Team',
    description: 'Main project discussion',
    createdBy: user.id
  })
  .select()
  .single()

// Add creator as admin
await supabase
  .from('ConversationParticipant')
  .insert({
    conversationId: data.id,
    userId: user.id,
    role: 'admin'
  })
```

### Fetching Group Members
```typescript
const { data: participants } = await supabase
  .from('ConversationParticipant')
  .select(`
    *,
    user:userId (
      id,
      email,
      raw_user_meta_data
    )
  `)
  .eq('conversationId', groupId)
```

## Next Steps

### Recommended Enhancements
1. **Real-time Updates**: Subscribe to conversation changes
2. **User Search**: Implement actual user search API
3. **Role Management**: Add ability to promote/demote members
4. **Group Permissions**: Fine-grained permission controls
5. **Audit Log**: Track group changes
6. **Member Invitations**: Send email invites to non-users

### Integration Points
- Connect to your existing user management system
- Integrate with notification system
- Add to your messaging/chat backend
- Link with calendar for meetings

## Troubleshooting

### Common Issues

**Error: "new row violates row-level security policy"**
- Ensure user is authenticated
- Check if user has admin role for the group
- Verify RLS policies are created correctly

**Error: "relation 'Conversation' does not exist"**
- Run the `group-chat-schema.sql` script
- Check table names match exactly (case-sensitive)

**Storage upload fails**
- Create `group-icons` bucket in Supabase Dashboard
- Ensure bucket is set to Public
- Run `storage-group-icons.sql` for RLS policies

**Members not showing**
- Check `ConversationParticipant` table has records
- Verify foreign key relationships
- Ensure user IDs match auth.users table

## Support
For issues or questions, check:
- Supabase documentation: https://supabase.com/docs
- RLS policies guide: https://supabase.com/docs/guides/auth/row-level-security
- Storage guide: https://supabase.com/docs/guides/storage
