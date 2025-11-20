# Enhanced Subaccount Management System

## Overview
This update completely redesigns the subaccounts page to match the client management interface shown in the screenshot. The new system provides a comprehensive two-panel layout for managing subaccounts with detailed information, notes, files, employees, and reports.

## Features

### 🎯 Two-Panel Layout
- **Left Panel**: Subaccount list with search, filtering, and quick stats
- **Right Panel**: Detailed subaccount view with comprehensive information management

### 📝 Notes Management
- Create, view, and manage notes for each subaccount
- Rich text content with timestamps
- User attribution for each note

### 📁 File Management
- Upload and attach files to subaccounts
- Support for multiple file types (documents, images, videos, etc.)
- File size tracking and download functionality
- Automatic file type detection

### 👥 Employee Management
- Add and manage employees for each subaccount
- Role-based organization (CEO, CTO, CDO, etc.)
- Employee profiles with contact information
- Avatar support and hire date tracking

### 📊 Reports Management
- Create and track various types of reports
- Status tracking (Draft, Pending, Completed, Rejected, In Review)
- Assignment to employees
- Due date management
- Report type categorization

## Database Schema

### New Tables Added

#### SubAccountNote
```sql
CREATE TABLE "SubAccountNote" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subAccountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "SubAccountNote_pkey" PRIMARY KEY ("id")
);
```

#### SubAccountFile
```sql
CREATE TABLE "SubAccountFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subAccountId" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    CONSTRAINT "SubAccountFile_pkey" PRIMARY KEY ("id")
);
```

#### SubAccountEmployee
```sql
CREATE TABLE "SubAccountEmployee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "EmployeeRole" NOT NULL,
    "avatarUrl" TEXT,
    "hireDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subAccountId" TEXT NOT NULL,
    CONSTRAINT "SubAccountEmployee_pkey" PRIMARY KEY ("id")
);
```

#### SubAccountReport
```sql
CREATE TABLE "SubAccountReport" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'DRAFT',
    "dueDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subAccountId" TEXT NOT NULL,
    "assignedTo" TEXT,
    "createdBy" TEXT NOT NULL,
    CONSTRAINT "SubAccountReport_pkey" PRIMARY KEY ("id")
);
```

### New Enums
- `ReportStatus`: DRAFT, PENDING, COMPLETED, REJECTED, IN_REVIEW
- `EmployeeRole`: CEO, CTO, CDO, MANAGER, DEVELOPER, DESIGNER, SALES, MARKETING, SUPPORT, OTHER
- `FileType`: DOCUMENT, IMAGE, VIDEO, AUDIO, SPREADSHEET, PRESENTATION, PDF, OTHER

## File Structure

```
src/app/(main)/agency/[agencyId]/all-subaccounts/
├── page.tsx                           # Main subaccounts page
├── create/
│   └── page.tsx                      # Create new subaccount page
└── _components/
    ├── subaccount-list-panel.tsx     # Left panel with subaccount list
    ├── subaccount-details-panel.tsx   # Right panel with detailed view
    ├── create-note-form.tsx          # Form for creating notes
    ├── create-employee-form.tsx       # Form for adding employees
    ├── create-report-form.tsx         # Form for creating reports
    └── upload-file-form.tsx          # Form for uploading files
```

## Key Components

### SubAccountListPanel
- Displays all subaccounts in a searchable, filterable list
- Shows quick stats (total, active, inactive)
- Handles subaccount selection and navigation
- Responsive design with hover states

### SubAccountDetailsPanel
- Comprehensive subaccount information display
- Company information with copy functionality
- Integrated forms for notes, files, employees, and reports
- Real-time data updates and state management

### Form Components
- **CreateNoteForm**: Simple note creation with title and content
- **CreateEmployeeForm**: Employee registration with role assignment
- **CreateReportForm**: Report creation with status and assignment
- **UploadFileForm**: File upload with type detection and validation

## Usage

### Accessing the New Interface
1. Navigate to `/agency/[agencyId]/all-subaccounts`
2. The page will display the two-panel layout
3. Select a subaccount from the left panel to view details on the right

### Adding Content
1. **Notes**: Click "Create New" in the Notes section
2. **Files**: Click "Attach New" in the Attached Files section
3. **Employees**: Click "Create New" in the Employees section
4. **Reports**: Click "New Report" in the Reports section

### Navigation
- Use the search bar to find specific subaccounts
- Filter by status (All, Active, Inactive)
- Click on any subaccount to view its details
- Use breadcrumb navigation for context

## Technical Implementation

### State Management
- React hooks for local state management
- Supabase for database operations
- Real-time updates with optimistic UI updates

### Authentication
- User authentication through Supabase Auth
- Role-based access control
- Secure file uploads with proper validation

### File Storage
- Supabase Storage for file uploads
- Automatic file type detection
- Public URL generation for file access

## Setup Instructions

1. **Database Setup**:
   ```bash
   # Run the SQL migration
   psql -d your_database -f create-subaccount-tables.sql
   ```

2. **Environment Variables**:
   Ensure your Supabase configuration is properly set up in your environment variables.

3. **Storage Bucket**:
   Create a `files` bucket in Supabase Storage for file uploads.

## Future Enhancements

- [ ] Bulk operations for multiple subaccounts
- [ ] Advanced filtering and sorting options
- [ ] Export functionality for reports and data
- [ ] Integration with external calendar systems
- [ ] Email notifications for report deadlines
- [ ] Advanced file preview capabilities
- [ ] Employee performance tracking
- [ ] Custom report templates

## Support

For issues or questions regarding this implementation, please refer to the existing documentation or contact the development team.
