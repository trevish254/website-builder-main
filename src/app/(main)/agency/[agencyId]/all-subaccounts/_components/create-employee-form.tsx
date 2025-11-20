'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { SubAccountEmployee, User } from '@/lib/database.types'
import { Users, UserPlus } from 'lucide-react'
import Image from 'next/image'

type Props = {
  subaccountId: string
  agencyId: string
  onEmployeeAdded: (employee: SubAccountEmployee) => void
  onClose: () => void
}

const CreateEmployeeForm = ({ subaccountId, agencyId, onEmployeeAdded, onClose }: Props) => {
  console.log('🎯 CreateEmployeeForm component rendered!')
  console.log('📋 Props:', { subaccountId, agencyId })
  
  const [selectedUserId, setSelectedUserId] = useState('')
  const [teamMembers, setTeamMembers] = useState<User[]>([])
  const [assignedEmployees, setAssignedEmployees] = useState<SubAccountEmployee[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)

  useEffect(() => {
    fetchTeamMembers()
    fetchAssignedEmployees()
  }, [])

  const fetchTeamMembers = async () => {
    console.log('👥 Fetching team members for agency:', agencyId)
    try {
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('agencyId', agencyId)
        .order('name')

      if (error) {
        console.error('❌ Error fetching team members:', error)
        throw error
      }
      
      console.log('✅ Team members fetched:', data)
      console.log('📊 Team members count:', data?.length || 0)
      setTeamMembers(data || [])
    } catch (error) {
      console.error('❌ Error fetching team members:', error)
    }
  }

  const fetchAssignedEmployees = async () => {
    console.log('👥 Fetching assigned employees for subaccount:', subaccountId)
    try {
      const { data, error } = await supabase
        .from('SubAccountEmployee')
        .select('*')
        .eq('subAccountId', subaccountId)
        .eq('isActive', true)

      if (error) {
        console.error('❌ Error fetching assigned employees:', error)
        throw error
      }
      
      console.log('✅ Assigned employees fetched:', data)
      console.log('📊 Assigned employees count:', data?.length || 0)
      setAssignedEmployees(data || [])
      setFetchingData(false)
    } catch (error) {
      console.error('❌ Error fetching assigned employees:', error)
      setFetchingData(false)
    }
  }

  // Filter out already assigned team members
  const availableTeamMembers = teamMembers.filter(member => 
    !assignedEmployees.some(assigned => assigned.userId === member.id)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🎯 Form submit triggered!')
    console.log('📋 Form state:', { selectedUserId, subaccountId })
    
    if (!selectedUserId) {
      console.log('❌ Form validation failed - no user selected')
      console.log('❌ selectedUserId:', selectedUserId)
      return
    }

    try {
      setLoading(true)
      
      console.log('🚀 Starting employee assignment...')
      console.log('📋 Assignment data:', {
        subaccountId,
        userId: selectedUserId
      })
      
      const { data, error } = await supabase
        .from('SubAccountEmployee')
        .insert({
          id: crypto.randomUUID(),
          subAccountId: subaccountId,
          userId: selectedUserId,
          role: 'MEMBER', // Simple default role
          assignedAt: new Date().toISOString(),
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select(`
          *,
          User:userId (
            id,
            name,
            email,
            avatarUrl
          )
        `)
        .single()

      if (error) {
        console.error('❌ Assignment failed:', error)
        console.error('❌ Error details:', JSON.stringify(error, null, 2))
        throw error
      }

      console.log('✅ Assignment successful:', data)
      console.log('📋 Returned data structure:', JSON.stringify(data, null, 2))
      
      onEmployeeAdded(data)
      onClose()
    } catch (error) {
      console.error('❌ Error assigning employee:', error)
    } finally {
      setLoading(false)
    }
  }

  if (fetchingData) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading team members...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add Employee
        </CardTitle>
      </CardHeader>
      <CardContent>
        {availableTeamMembers.length === 0 ? (
          <div className="text-center py-6">
            <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              All Team Members Assigned
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              All available team members have already been assigned to this subaccount.
            </p>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="teamMember" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Employee *
              </label>
              <Select 
                value={selectedUserId} 
                onValueChange={(value) => {
                  console.log('👤 Team member selected:', value)
                  setSelectedUserId(value)
                }} 
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an employee..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTeamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8">
                          {member.avatarUrl ? (
                            <Image
                              src={member.avatarUrl}
                              alt={member.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                              {member.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>


            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1"
                onClick={() => {
                  console.log('🔘 Assign button clicked!')
                  console.log('📋 Button state:', { loading, selectedUserId })
                }}
              >
                {loading ? 'Assigning...' : 'Add Employee'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  console.log('🔘 Cancel button clicked!')
                  onClose()
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

export default CreateEmployeeForm
