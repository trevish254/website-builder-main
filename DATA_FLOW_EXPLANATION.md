# 📊 **Complete Data Flow Explanation**

## 🔄 **How Data is Saved, Fetched, and Displayed**

### **1. 📝 Notes Flow**

#### **Save Process:**
```typescript
// When user creates a note
const { data, error } = await supabase
  .from('SubAccountNote')
  .insert({
    id: crypto.randomUUID(),
    title: "Meeting Notes",
    content: "Discussed project requirements...",
    subAccountId: "selected-subaccount-id",  // Links to specific subaccount
    userId: "current-user-id",              // Who created it
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
```

#### **Fetch Process:**
```typescript
// When subaccount is selected, fetch its notes
const { data } = await supabase
  .from('SubAccountNote')
  .select(`
    *,
    User:userId (id, name, avatarUrl)  // Join with User table
  `)
  .eq('subAccountId', subaccountId)   // Only notes for THIS subaccount
  .order('createdAt', { ascending: false })
```

#### **Display Process:**
- Notes are displayed in the details panel for the selected subaccount
- Shows author name, creation date, and content
- Each note is linked to the specific subaccount

---

### **2. 📁 Files Flow (UploadThing Integration)**

#### **Save Process:**
```typescript
// 1. Upload file to UploadThing
const uploadResult = await uploadFiles({
  files: [selectedFile],
  endpoint: "subaccountFile"
})

// 2. Save metadata to database
const { data, error } = await supabase
  .from('SubAccountFile')
  .insert({
    id: crypto.randomUUID(),
    name: "Project Document",
    originalName: "project.pdf",
    type: "PDF",
    size: 1024000,
    url: uploadResult[0].url,              // UploadThing URL
    subAccountId: "selected-subaccount-id", // Links to specific subaccount
    uploadedBy: "current-user-id",          // Who uploaded it
    createdAt: new Date().toISOString()
  })
```

#### **Fetch Process:**
```typescript
// When subaccount is selected, fetch its files
const { data } = await supabase
  .from('SubAccountFile')
  .select(`
    *,
    User:uploadedBy (id, name, avatarUrl)  // Join with User table
  `)
  .eq('subAccountId', subaccountId)         // Only files for THIS subaccount
  .order('createdAt', { ascending: false })
```

#### **Display Process:**
- Files are displayed with UploadThing URLs
- Download button opens `file.url` in new tab
- Shows file size, upload date, and uploader name
- Database stores metadata, UploadThing stores actual file

---

### **3. 👥 Employees Flow**

#### **Save Process:**
```typescript
// When user assigns team member to subaccount
const { data, error } = await supabase
  .from('SubAccountEmployee')
  .insert({
    id: crypto.randomUUID(),
    subAccountId: "selected-subaccount-id", // Links to specific subaccount
    userId: "team-member-id",                // Links to existing User
    role: "DEVELOPER",                       // Role for this subaccount
    assignedAt: new Date().toISOString(),
    isActive: true
  })
```

#### **Fetch Process:**
```typescript
// When subaccount is selected, fetch its assigned employees
const { data } = await supabase
  .from('SubAccountEmployee')
  .select(`
    *,
    User:userId (id, name, email, avatarUrl)  // Join with User table
  `)
  .eq('subAccountId', subaccountId)           // Only employees for THIS subaccount
  .eq('isActive', true)                      // Only active assignments
  .order('assignedAt', { ascending: false })
```

#### **Display Process:**
- Shows assigned team members with their roles
- Displays user info from the User table
- Each assignment is specific to the selected subaccount

---

### **4. 📊 Reports Flow**

#### **Save Process:**
```typescript
// When user creates a report
const { data, error } = await supabase
  .from('SubAccountReport')
  .insert({
    id: crypto.randomUUID(),
    title: "Monthly Report",
    description: "Project progress update",
    type: "MONTHLY",
    status: "DRAFT",
    dueDate: "2024-02-01",
    subAccountId: "selected-subaccount-id", // Links to specific subaccount
    assignedTo: "employee-assignment-id",   // Optional: assign to employee
    createdBy: "current-user-id"             // Who created it
  })
```

#### **Fetch Process:**
```typescript
// When subaccount is selected, fetch its reports
const { data } = await supabase
  .from('SubAccountReport')
  .select(`
    *,
    User:createdBy (id, name, avatarUrl),
    SubAccountEmployee:assignedTo (
      id,
      User:userId (id, name, avatarUrl)
    )
  `)
  .eq('subAccountId', subaccountId)         // Only reports for THIS subaccount
  .order('createdAt', { ascending: false })
```

#### **Display Process:**
- Shows reports with status, due dates, and assignments
- Each report is linked to the specific subaccount
- Can be assigned to specific employees

---

## 🎯 **Key Points**

### **Data Isolation:**
- All data is filtered by `subAccountId`
- Each subaccount only sees its own notes, files, employees, and reports
- No cross-contamination between subaccounts

### **UploadThing Integration:**
- Files are stored on UploadThing servers
- Database stores metadata and UploadThing URLs
- Download/preview uses UploadThing URLs directly

### **User Attribution:**
- All actions are tracked with `userId`
- Shows who created/uploaded/assigned what
- Maintains audit trail

### **Real-time Updates:**
- When new items are added, they're immediately added to the UI
- No need to refresh the page
- State management keeps data in sync

---

## 🔧 **Database Schema Summary**

```sql
-- Notes: Simple text storage
SubAccountNote (id, title, content, subAccountId, userId)

-- Files: UploadThing metadata
SubAccountFile (id, name, originalName, type, size, url, subAccountId, uploadedBy)

-- Employee Assignments: Link existing users
SubAccountEmployee (id, subAccountId, userId, role, assignedAt, isActive)

-- Reports: Document tracking
SubAccountReport (id, title, description, type, status, dueDate, subAccountId, assignedTo, createdBy)
```

This system ensures that each subaccount has its own isolated data while maintaining proper relationships and user attribution! 🎯
