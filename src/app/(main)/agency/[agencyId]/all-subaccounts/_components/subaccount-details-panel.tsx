'use client'

import { useState, useEffect } from 'react'
import { SubAccount, SubAccountNote, SubAccountFile, SubAccountEmployee, SubAccountReport } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  MoreHorizontal,
  Copy,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Users,
  Building2,
  Calendar,
  Download,
  Edit,
  Trash2,
  Settings,
  ChevronRight
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CreateNoteForm from './create-note-form'
import CreateEmployeeForm from './create-employee-form'
import CreateReportForm from './create-report-form'
import UploadFileForm from './upload-file-form'

type Props = {
  subaccountId?: string
  agencyId: string
}

const SubAccountDetailsPanel = ({ subaccountId, agencyId }: Props) => {
  console.log('🎯 SubAccountDetailsPanel rendered!')
  console.log('📋 SubaccountId:', subaccountId)
  console.log('📋 AgencyId:', agencyId)
  
  const [subaccount, setSubaccount] = useState<SubAccount | null>(null)
  const [notes, setNotes] = useState<SubAccountNote[]>([])
  const [files, setFiles] = useState<SubAccountFile[]>([])
  const [employees, setEmployees] = useState<SubAccountEmployee[]>([])
  const [reports, setReports] = useState<SubAccountReport[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string>('')
  const [showCreateNote, setShowCreateNote] = useState(false)
  const [showCreateEmployee, setShowCreateEmployee] = useState(false)
  const [showCreateReport, setShowCreateReport] = useState(false)
  const [showUploadFile, setShowUploadFile] = useState(false)

  useEffect(() => {
    if (subaccountId) {
      fetchUserDetails()
      fetchSubaccountDetails()
    } else {
      setLoading(false)
    }
  }, [subaccountId])

  const fetchUserDetails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
  }

  const fetchSubaccountDetails = async () => {
    console.log('🔍 fetchSubaccountDetails called with subaccountId:', subaccountId)
    if (!subaccountId) {
      console.log('❌ No subaccountId provided')
      return
    }

    try {
      setLoading(true)
      console.log('📡 Fetching subaccount details...')
      
      // Fetch subaccount details
      const { data: subaccountData } = await supabase
        .from('SubAccount')
        .select('*')
        .eq('id', subaccountId)
        .single()

      if (subaccountData) {
        setSubaccount(subaccountData)

        // Fetch related data
        await Promise.all([
          fetchNotes(),
          fetchFiles(),
          fetchEmployees(),
          fetchReports()
        ])
      }
    } catch (error) {
      console.error('Error fetching subaccount details:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNotes = async () => {
    const { data } = await supabase
      .from('SubAccountNote')
      .select(`
        *,
        User:userId (
          id,
          name,
          avatarUrl
        )
      `)
      .eq('subAccountId', subaccountId)
      .order('createdAt', { ascending: false })
    
    setNotes(data || [])
  }

  const fetchFiles = async () => {
    const { data } = await supabase
      .from('SubAccountFile')
      .select(`
        *,
        User:uploadedBy (
          id,
          name,
          avatarUrl
        )
      `)
      .eq('subAccountId', subaccountId)
      .order('createdAt', { ascending: false })
    
    setFiles(data || [])
  }

  const fetchEmployees = async () => {
    console.log('🔍 Fetching employees for subaccount:', subaccountId)
    
    // First, let's test if the table exists and we can query it
    console.log('🧪 Testing basic table access...')
    const { data: testData, error: testError } = await supabase
      .from('SubAccountEmployee')
      .select('*')
      .limit(1)
    
    if (testError) {
      console.error('❌ Basic table access failed:', testError)
      console.error('❌ This suggests the table might not exist or RLS is blocking access')
      setEmployees([])
      return
    }
    
    console.log('✅ Basic table access successful, test data:', testData)
    
    // Now try the full query with joins
    const { data, error } = await supabase
      .from('SubAccountEmployee')
      .select(`
        *,
        User:userId (
          id,
          name,
          email,
          avatarUrl
        )
      `)
      .eq('subAccountId', subaccountId)
      .eq('isActive', true)
      .order('assignedAt', { ascending: false })
    
    if (error) {
      console.error('❌ Error fetching employees with joins:', error)
      console.error('❌ Error details:', JSON.stringify(error, null, 2))
    } else {
      console.log('✅ Fetched employees:', data)
      console.log('📊 Employees count:', data?.length || 0)
      if (data && data.length > 0) {
        console.log('📋 First employee structure:', JSON.stringify(data[0], null, 2))
      }
    }
    
    setEmployees(data || [])
  }

  const fetchReports = async () => {
    const { data } = await supabase
      .from('SubAccountReport')
      .select(`
        *,
        User:createdBy (
          id,
          name,
          avatarUrl
        ),
        SubAccountEmployee:assignedTo (
          id,
          User:userId (
            id,
            name,
            avatarUrl
          )
        )
      `)
      .eq('subAccountId', subaccountId)
      .order('createdAt', { ascending: false })
    
    setReports(data || [])
  }

  const removeEmployee = async (employeeId: string) => {
    try {
      const { error } = await supabase
        .from('SubAccountEmployee')
        .update({ isActive: false })
        .eq('id', employeeId)

      if (error) throw error

      // Update local state
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId))
    } catch (error) {
      console.error('Error removing employee:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'IN_REVIEW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />
      case 'PENDING':
        return <Clock className="h-4 w-4" />
      case 'IN_REVIEW':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading subaccount details...</p>
        </div>
      </div>
    )
  }

  if (!subaccountId || !subaccount) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Select a Subaccount
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Choose a subaccount from the list to view its details
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12">
              <Image
                src={subaccount.subAccountLogo}
                alt={subaccount.name}
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {subaccount.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Subaccounts / {subaccount.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/subaccount/${subaccountId}`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Settings className="h-4 w-4 mr-2" />
                Manage
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {subaccount.companyPhone}
              </span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {subaccount.companyEmail}
              </span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {subaccount.address}, {subaccount.city}, {subaccount.state} {subaccount.zipCode}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notes
              </CardTitle>
              <Dialog open={showCreateNote} onOpenChange={setShowCreateNote}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <CreateNoteForm
                    subaccountId={subaccountId}
                    userId={userId}
                    onNoteAdded={(note) => {
                      setNotes(prev => [note, ...prev])
                      setShowCreateNote(false)
                    }}
                    onClose={() => setShowCreateNote(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {notes.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No notes available</p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{note.title}</h4>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this note?')) {
                              // TODO: Implement delete note functionality
                              console.log('Delete note:', note.id)
                            }
                          }}
                          title="Delete note"
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{note.content}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <span>By {note.User?.name || 'Unknown'}</span>
                      <span>•</span>
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attached Files */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Attached Files
              </CardTitle>
              <Dialog open={showUploadFile} onOpenChange={setShowUploadFile}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Attach New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <UploadFileForm
                    subaccountId={subaccountId}
                    userId={userId}
                    onFileAdded={(file) => {
                      setFiles(prev => [file, ...prev])
                      setShowUploadFile(false)
                    }}
                    onClose={() => setShowUploadFile(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No files attached</p>
            ) : (
              <div className="space-y-2">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.originalName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(file.size / 1024).toFixed(1)} KB • {formatDate(file.createdAt)} • Uploaded by {file.User?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(file.url, '_blank')}
                        title="Download file"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this file?')) {
                            // TODO: Implement delete functionality
                            console.log('Delete file:', file.id)
                          }
                        }}
                        title="Delete file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employees */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employees ({employees.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    console.log('🔧 Manual fetch test')
                    fetchEmployees()
                  }}
                >
                  🔧 Debug Fetch
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={async () => {
                    console.log('🧪 Testing database connection...')
                    try {
                      // Test basic connection
                      const { data: connectionTest, error: connectionError } = await supabase
                        .from('SubAccountEmployee')
                        .select('count')
                        .limit(1)
                      
                      if (connectionError) {
                        console.error('❌ Connection test failed:', connectionError)
                      } else {
                        console.log('✅ Connection test passed:', connectionTest)
                      }
                      
                      // Test table contents
                      const { data: allEmployees, error: allError } = await supabase
                        .from('SubAccountEmployee')
                        .select('*')
                        .limit(10)
                      
                      if (allError) {
                        console.error('❌ Table query failed:', allError)
                      } else {
                        console.log('📊 All employees in table:', allEmployees)
                        console.log('📊 Count:', allEmployees?.length || 0)
                      }
                      
                      // Test specific subaccount
                      const { data: subEmployees, error: subError } = await supabase
                        .from('SubAccountEmployee')
                        .select('*')
                        .eq('subAccountId', subaccountId)
                      
                      if (subError) {
                        console.error('❌ Subaccount query failed:', subError)
                      } else {
                        console.log(`📊 Employees for subaccount ${subaccountId}:`, subEmployees)
                        console.log(`📊 Count for this subaccount:`, subEmployees?.length || 0)
                      }
                      
                      // Test manual insert
                      console.log('🧪 Testing manual insert...')
                      const { data: insertTest, error: insertError } = await supabase
                        .from('SubAccountEmployee')
                        .insert({
                          id: crypto.randomUUID(),
                          subAccountId: subaccountId,
                          userId: 'user_34FxujtkgcsuWikpzCsX78HDEjD', // Your user ID from logs
                          role: 'MEMBER',
                          assignedAt: new Date().toISOString(),
                          isActive: true,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString()
                        })
                        .select()
                        .single()
                      
                      if (insertError) {
                        console.error('❌ Manual insert failed:', insertError)
                      } else {
                        console.log('✅ Manual insert successful:', insertTest)
                      }
                      
                    } catch (error) {
                      console.error('❌ Test failed:', error)
                    }
                  }}
                >
                  🧪 Test DB
                </Button>
              </div>
              <Dialog open={showCreateEmployee} onOpenChange={(open) => {
                console.log('🔘 Dialog state changed:', open)
                setShowCreateEmployee(open)
              }}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      console.log('🔘 Create New button clicked!')
                      console.log('📋 Dialog state:', { showCreateEmployee })
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <CreateEmployeeForm
                    subaccountId={subaccountId}
                    agencyId={agencyId}
                    onEmployeeAdded={(employee) => {
                      console.log('🎉 Employee assigned successfully:', employee)
                      console.log('🔄 Refreshing employees list...')
                      // Refresh employees list to get the latest data with proper joins
                      fetchEmployees()
                      setShowCreateEmployee(false)
                    }}
                    onClose={() => setShowCreateEmployee(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {console.log('📋 Current employees state:', employees)}
            {employees.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No employees added</p>
            ) : (
              <div className="space-y-3">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="relative w-10 h-10">
                      {employee.User?.avatarUrl ? (
                        <Image
                          src={employee.User.avatarUrl}
                          alt={employee.User.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                          {employee.User?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{employee.User?.name || 'Unknown User'}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{employee.role} • {employee.User?.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Assigned {formatDate(employee.assignedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {employee.role}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          if (confirm('Are you sure you want to remove this employee from this subaccount?')) {
                            removeEmployee(employee.id)
                          }
                        }}
                        title="Remove employee"
                      >
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Reports
              </CardTitle>
              <Dialog open={showCreateReport} onOpenChange={setShowCreateReport}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    New Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <CreateReportForm
                    subaccountId={subaccountId}
                    userId={userId}
                    employees={employees}
                    onReportAdded={(report) => {
                      setReports(prev => [report, ...prev])
                      setShowCreateReport(false)
                    }}
                    onClose={() => setShowCreateReport(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No reports available</p>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{report.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{report.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(report.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(report.status)}
                            {report.status}
                          </div>
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this report?')) {
                              // TODO: Implement delete report functionality
                              console.log('Delete report:', report.id)
                            }
                          }}
                          title="Delete report"
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Due: {report.dueDate ? formatDate(report.dueDate) : 'No due date'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>Created by: {report.User?.name || 'Unknown'}</span>
                      </div>
                      {report.SubAccountEmployee?.User && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Assigned to: {report.SubAccountEmployee.User.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SubAccountDetailsPanel
