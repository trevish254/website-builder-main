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
import GradientButton from '@/components/ui/button-1'
import { ShimmerButton } from '@/components/ui/shimmer-button'

type Props = {
  subaccountId?: string
  agencyId: string
}

const SubAccountDetailsPanel = ({ subaccountId, agencyId }: Props) => {

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
  const [notesError, setNotesError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) setUserId(session.user.id)
    }
    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id)
      } else {
        setUserId('')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (subaccountId) {
      fetchSubaccountDetails()
    } else {
      setLoading(false)
    }
  }, [subaccountId])

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
    if (!subaccountId) return
    console.log('📝 FETCH LOG: Starting note fetch for ID:', subaccountId)
    setNotesError(null)

    try {
      // Primary attempt with specific column join
      const { data, error } = await supabase
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

      if (error) {
        console.warn('⚠️ FETCH LOG: JOIN query failed, trying standard join:', error.message)
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('SubAccountNote')
          .select('*, User (id, name, avatarUrl)')
          .eq('subAccountId', subaccountId)
          .order('createdAt', { ascending: false })

        if (fallbackError) {
          console.error('❌ FETCH LOG: Both JOINs failed, falling back to simple select.')
          const { data: simpleData } = await supabase
            .from('SubAccountNote')
            .select('*')
            .eq('subAccountId', subaccountId)
            .order('createdAt', { ascending: false })

          setNotes(simpleData || [])
          setNotesError('Loading partial attribution...')
        } else {
          setNotes(fallbackData || [])
        }
      } else {
        console.log('✅ FETCH LOG: Notes successfully fetched with JOIN')
        setNotes(data || [])
      }
    } catch (err: any) {
      console.error('❌ FETCH LOG: Fatal fetch error:', err)
      setNotesError(`Connection Error: ${err.message}`)
    }
  }

  const fetchFiles = async () => {
    if (!subaccountId) return
    console.log('📡 FETCH LOG: Fetching files for subaccount:', subaccountId)
    const { data, error } = await supabase
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

    if (error) {
      console.error('❌ FETCH LOG: Error fetching files:', error)
      return
    }

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
      <div className="p-6 border-b border-white/10 sticky top-0 z-20 bg-transparent overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] transition-all duration-300">
        {/* Animated Neon Top-Edge */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

        {/* Bottom Crystal Reflection (The 'Edge' that content passes under) */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10 shadow-[0_-1px_10px_rgba(255,255,255,0.1)]" />

        {/* Moving Sheen Effect */}
        <div className="absolute inset-0 w-[200%] h-full -translate-x-full animate-[shimmer-sweep_6s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12">
              <Image
                src={subaccount.subAccountLogo}
                alt={subaccount.name}
                fill
                className="rounded-lg object-cover shadow-lg"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                {subaccount.name}
              </h1>
              <p className="text-xs text-gray-400 font-medium tracking-wide">
                SUBACCOUNTS / {subaccount.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href={`/subaccount/${subaccountId}`}>
              <GradientButton
                width="180px"
                height="50px"
                className="shadow-xl shadow-blue-500/10"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>MANAGE</span>
                </div>
              </GradientButton>
            </Link>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Company Info */}
        <Card className="bg-white/[0.03] dark:bg-white/[0.01] backdrop-blur-2xl border-white/10 shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-100">
              <Building2 className="h-5 w-5 text-blue-400" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 p-4 bg-white/[0.05] border border-white/5 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-[10px] uppercase tracking-widest">
                  <Phone className="h-3 w-3" />
                  Phone
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-500 hover:text-white transition-colors">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <span className="text-sm font-semibold text-gray-200">
                {subaccount.companyPhone}
              </span>
            </div>

            <div className="flex flex-col gap-2 p-4 bg-white/[0.05] border border-white/5 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-[10px] uppercase tracking-widest">
                  <Mail className="h-3 w-3" />
                  Email
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-500 hover:text-white transition-colors">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <span className="text-sm font-semibold text-gray-200">
                {subaccount.companyEmail}
              </span>
            </div>

            <div className="flex flex-col gap-2 p-4 bg-white/[0.05] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-2 text-red-500 font-bold text-[10px] uppercase tracking-widest">
                <MapPin className="h-3 w-3" />
                Address
              </div>
              <span className="text-xs font-semibold text-gray-200 leading-relaxed">
                {subaccount.address}, {subaccount.city}, {subaccount.state} {subaccount.zipCode}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="bg-white/[0.03] dark:bg-white/[0.01] backdrop-blur-2xl border-white/10 shadow-xl overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                Notes
              </CardTitle>
              {userId ? (
                <Dialog open={showCreateNote} onOpenChange={setShowCreateNote}>
                  <DialogTrigger asChild>
                    <ShimmerButton
                      borderRadius="12px"
                      className="h-11 px-8 text-sm font-semibold"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New
                    </ShimmerButton>
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
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                  <Clock className="h-3 w-3 animate-spin text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Authenticating</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {notesError && (
              <div className="flex items-center justify-center gap-2 p-2 mb-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-[10px] italic">
                <Clock className="h-3 w-3" />
                {notesError}
              </div>
            )}
            {notes.length === 0 && !notesError ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">No notes available</p>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="group relative p-4 bg-white/[0.05] dark:bg-white/5 border border-white/10 rounded-xl transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-100 group-hover:text-blue-400 transition-colors uppercase tracking-tight text-sm">{note.title}</h4>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this note?')) {
                              // TODO: Implement delete note functionality
                              console.log('Delete note:', note.id)
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">{note.content}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        {note.User?.avatarUrl ? (
                          <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white/10">
                            <Image src={note.User.avatarUrl} alt={note.User.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                            <Users className="h-3 w-3 text-blue-400" />
                          </div>
                        )}
                        <span className="text-[11px] font-medium text-gray-500">
                          {note.User?.name || 'Unknown'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                        {formatDate(note.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attached Files */}
        <Card className="bg-white/[0.03] dark:bg-white/[0.01] backdrop-blur-2xl border-white/10 shadow-xl overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-100">
                <Download className="h-5 w-5 text-emerald-400" />
                Attached Files
              </CardTitle>
              {userId ? (
                <Dialog open={showUploadFile} onOpenChange={setShowUploadFile}>
                  <DialogTrigger asChild>
                    <ShimmerButton
                      borderRadius="12px"
                      className="h-11 px-8 text-sm font-semibold"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Attach New
                    </ShimmerButton>
                  </DialogTrigger>
                  <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-transparent">
                    <UploadFileForm
                      subaccountId={subaccountId}
                      userId={userId}
                      onFileAdded={(file: any) => {
                        setFiles(prev => [file, ...prev])
                        setShowUploadFile(false)
                      }}
                      onClose={() => setShowUploadFile(false)}
                    />
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                  <Clock className="h-3 w-3 animate-spin text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Authenticating</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <div className="text-center py-10 opacity-30">
                <Download className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                <p className="text-sm font-medium">No files attached</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {files.map((file) => (
                  <div key={file.id} className="group flex items-center gap-3 p-3 bg-white/[0.05] border border-white/10 rounded-xl hover:bg-white/[0.08] transition-all">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <FileText className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-200 truncate leading-tight">{file.originalName}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">
                        {(file.size / 1024).toFixed(1)} KB • {formatDate(file.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10"
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this file?')) {
                            console.log('Delete file:', file.id)
                          }
                        }}
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
        <Card className="bg-white/[0.03] dark:bg-white/[0.01] backdrop-blur-2xl border-white/10 shadow-xl overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-100">
                <Users className="h-5 w-5 text-violet-400" />
                Team Members ({employees.length})
              </CardTitle>
              <Dialog open={showCreateEmployee} onOpenChange={setShowCreateEmployee}>
                <DialogTrigger asChild>
                  <ShimmerButton
                    borderRadius="12px"
                    className="h-11 px-8 text-sm font-semibold"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Manage Team
                  </ShimmerButton>
                </DialogTrigger>
                <DialogContent>
                  <CreateEmployeeForm
                    subaccountId={subaccountId}
                    agencyId={agencyId}
                    onEmployeeAdded={() => {
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
            {employees.length === 0 ? (
              <div className="text-center py-10 opacity-30">
                <Users className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                <p className="text-sm font-medium">No team members assigned</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="group relative flex items-center gap-3 p-4 bg-white/[0.05] border border-white/10 rounded-2xl hover:bg-white/[0.08] transition-all">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-violet-500/50 transition-colors">
                      {employee.User?.avatarUrl ? (
                        <Image src={employee.User.avatarUrl} alt={employee.User.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-violet-500/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-violet-400">{employee.User?.name?.charAt(0) || 'U'}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-100 leading-none mb-1">{employee.User?.name || 'Unknown'}</p>
                      <p className="text-[10px] text-gray-500 truncate mb-1 uppercase tracking-tight font-medium">{employee.role}</p>
                      <Badge variant="outline" className="text-[9px] h-4 px-1 py-0 border-white/5 bg-white/5 text-gray-500 tracking-tighter">
                        Active
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                      onClick={() => {
                        if (confirm('Remove employee from this subaccount?')) {
                          removeEmployee(employee.id)
                        }
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reports */}
        <Card className="bg-white/[0.03] dark:bg-white/[0.01] backdrop-blur-2xl border-white/10 shadow-xl overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-100">
                <FileText className="h-5 w-5 text-orange-400" />
                Reports
              </CardTitle>
              <Dialog open={showCreateReport} onOpenChange={setShowCreateReport}>
                <DialogTrigger asChild>
                  <ShimmerButton
                    borderRadius="12px"
                    className="h-11 px-8 text-sm font-semibold"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Report
                  </ShimmerButton>
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
              <div className="text-center py-10 opacity-30">
                <FileText className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                <p className="text-sm font-medium">No reports filed yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="group p-5 bg-white/[0.05] border border-white/10 rounded-2xl hover:bg-white/[0.08] transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-gray-100 uppercase tracking-tight text-sm mb-1 group-hover:text-orange-400 transition-colors">{report.title}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{report.type}</span>
                          <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {report.dueDate ? formatDate(report.dueDate) : 'No due date'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn(
                          "text-[9px] font-bold uppercase py-0 h-5 px-2 border-none",
                          report.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                        )}>
                          {report.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500"
                          onClick={() => {
                            if (confirm('Delete this report?')) {
                              console.log('Delete report:', report.id)
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {report.description && (
                      <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">{report.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                          <Users className="h-3 w-3 text-orange-400" />
                        </div>
                        <span className="text-[11px] font-medium text-gray-500">
                          By {report.User?.name || 'Unknown'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                        Ref: {report.id.slice(0, 8)}
                      </span>
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
