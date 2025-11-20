'use client'
import { useState } from 'react'
import { ArrowLeft, Mail, Edit, MapPin, Phone, Briefcase, Calendar, User as UserIcon, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

type MemberDetail = {
  id: string
  name: string
  email: string
  role: string
  avatarUrl: string
  status: 'active' | 'inactive' | 'invited'
  phoneNumber?: string
  employeeId?: string
  jobTitle?: string
  jobCategory?: string
  employmentType?: string
  joinedDate?: string
  lastClockedIn?: string
  lastMessaged?: string
  // Personal Info
  gender?: string
  maritalStatus?: string
  religion?: string
  placeOfBirth?: string
  birthdate?: string
  bloodType?: string
  age?: number
  residentialAddress?: string
  citizenIdAddress?: string
  description?: string
}

// Mock data - replace with actual API calls
const mockMemberDetails: MemberDetail = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'CEO',
  avatarUrl: '/assets/plura-logo.svg',
  status: 'active',
  phoneNumber: '+62 123 123 123',
  employeeId: '#EMP01',
  jobTitle: 'CEO',
  jobCategory: 'Managerial',
  employmentType: 'Fulltime',
  joinedDate: '2020-10-29',
  lastClockedIn: 'A few seconds ago',
  lastMessaged: '2 Days ago',
  gender: 'Male',
  maritalStatus: 'Single',
  religion: 'Muslim',
  placeOfBirth: 'Bandung',
  birthdate: '06 March 1997',
  bloodType: 'B',
  age: 27,
  residentialAddress: '4517 Washington Ave. Manchester, Kentucky 39495',
  citizenIdAddress: '2715 Ash Dr. San Jose, South Dakota 83475',
  description: 'John has been a valuable member of the team and brings great energy to creative discussions. With some additional focus on data analysis and prioritization, manager believe he can take his work to the next level.',
}

const tabs = [
  { value: 'personal', label: 'Personal Information' },
  { value: 'contract', label: 'Contract' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'time', label: 'Time Management' },
  { value: 'assets', label: 'Assets', count: 3 },
  { value: 'documents', label: 'Document', count: 8 },
  { value: 'training', label: 'Training' },
  { value: 'finance', label: 'Finance' },
]

type Props = {
  params: { agencyId: string; memberId: string }
}

const MemberDetailPage = ({ params }: Props) => {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)

  const member = mockMemberDetails // In real app, fetch by ID

  const handleEdit = () => {
    setIsEditing(!isEditing)
    if (isEditing) {
      toast({
        title: 'Changes saved',
        description: 'Team member details have been updated.',
      })
    }
  }

  const InfoField = ({ label, value }: { label: string; value?: string }) => (
    <div className="space-y-1">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      {isEditing ? (
        <Input defaultValue={value} className="h-8" />
      ) : (
        <p className="text-sm font-medium">{value || 'Not provided'}</p>
      )}
    </div>
  )

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/agency/${params.agencyId}/team`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary">
              <Image
                src={member.avatarUrl}
                alt={member.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{member.name}</h1>
              <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                {member.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Last Clocked In: <span className="font-semibold text-foreground">{member.lastClockedIn}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Last Messaged: <span className="font-semibold text-foreground">{member.lastMessaged}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Employee ID: <span className="font-semibold text-foreground">{member.employeeId}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <UserIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button onClick={() => router.push(`mailto:${member.email}`)}>
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-8 w-full mb-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
              {tab.label}
              {tab.count !== undefined && (
                <Badge variant="secondary" className="ml-1">
                  {tab.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Personal Information Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoField label="Full Name" value={member.name} />
                <InfoField label="Gender" value={member.gender} />
                <InfoField label="Marital Status" value={member.maritalStatus} />
                <InfoField label="Religion" value={member.religion} />
                <InfoField label="Place of Birth" value={member.placeOfBirth} />
                <InfoField label="Birthdate" value={member.birthdate} />
                <InfoField label="Blood Type" value={member.bloodType} />
                <InfoField label="Age" value={member.age?.toString()} />
              </CardContent>
            </Card>

            {/* Address Information Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Address Information</CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Residential Address</Label>
                  {isEditing ? (
                    <Input defaultValue={member.residentialAddress} className="h-8 mt-1" />
                  ) : (
                    <div className="mt-1">
                      <p className="text-sm font-medium">{member.residentialAddress}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          Add Note
                        </Button>
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          <MapPin className="h-3 w-3 mr-1" />
                          View on Map →
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Citizen ID Address</Label>
                  {isEditing ? (
                    <Input defaultValue={member.citizenIdAddress} className="h-8 mt-1" />
                  ) : (
                    <div className="mt-1">
                      <p className="text-sm font-medium">{member.citizenIdAddress}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          Add Note
                        </Button>
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          <MapPin className="h-3 w-3 mr-1" />
                          View on Map →
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Contact Information</CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Personal Contact</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${member.phoneNumber}`} className="text-sm font-medium hover:underline">
                        {member.phoneNumber}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${member.email}`} className="text-sm font-medium hover:underline">
                        {member.email}
                      </a>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Other Contact</Label>
                  <p className="text-sm font-medium">Not Provided</p>
                </div>
              </CardContent>
            </Card>

            {/* Employment Overview Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Employment Overview</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Date Started</Label>
                  <p className="text-sm font-medium">2020-Current (4 Years)</p>
                </div>
                <InfoField label="Job Role" value={member.jobTitle} />
                <InfoField label="Job Level" value={member.jobCategory} />
                <InfoField label="Employment Status" value={member.employmentType} />
                <Button variant="link" size="sm" className="p-0 mt-2">
                  View contract →
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {member.description && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{member.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Tags Card */}
          <Card>
            <CardHeader>
              <CardTitle># Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="Add tag to candidate" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contract Tab */}
        <TabsContent value="contract">
          <Card>
            <CardHeader>
              <CardTitle>Contract Information</CardTitle>
              <CardDescription>View and manage contract details</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Contract details will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Information</CardTitle>
              <CardDescription>Salary and compensation details</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Payroll details will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Management Tab */}
        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle>Time Management</CardTitle>
              <CardDescription>Attendance and schedule information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Time management details will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other Tabs */}
        <TabsContent value="assets">
          <Card>
            <CardHeader>
              <CardTitle>Assets ({tabs.find(t => t.value === 'assets')?.count})</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Asset details will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents ({tabs.find(t => t.value === 'documents')?.count})</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Document details will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Training</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Training details will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance">
          <Card>
            <CardHeader>
              <CardTitle>Finance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Finance details will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MemberDetailPage

