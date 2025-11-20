'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  FileText, 
  Search, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  Building,
  Calendar,
  Download,
  Copy,
  Star,
  Zap,
  Target,
  Award
} from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  params: { agencyId: string }
}

const GovernmentHubPage = ({ params }: Props) => {
  const router = useRouter()
  
  const categories = [
    {
      id: 'verify-documents',
      title: 'Verify Documents',
      description: 'Check if tax IDs, licenses, or certificates are valid',
      icon: <Search className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      services: [
        'PIN Checker by PIN',
        'PIN Checker by ID', 
        'TCC Checker',
        'Excise License Checker',
        'Import Certificate Checker',
        'VAT Exemption Checker',
        'IT Exemption Checker'
      ],
      actionText: 'Start Verification',
      progress: 75
    },
    {
      id: 'file-returns',
      title: 'File Returns',
      description: 'Submit or declare your tax obligations',
      icon: <FileText className="h-8 w-8 text-green-600" />,
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      services: [
        'NIL Return Filing',
        'TOT Return Filing',
        'Tax Compliance Certificate Application'
      ],
      actionText: 'File Returns',
      progress: 60
    },
    {
      id: 'generate-prns',
      title: 'Generate PRNs',
      description: 'Create payment references for withholding taxes',
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      services: [
        'VAT Withholding PRN',
        'Income Tax Withholding PRN',
        'Rental Withholding PRN'
      ],
      actionText: 'Generate PRN',
      progress: 90
    },
    {
      id: 'tax-obligations',
      title: 'Tax Obligations',
      description: 'View your current KRA requirements',
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      services: [
        'Fetch Taxpayer Obligations',
        'Search PRN from iTax',
        'Customs Declaration Status'
      ],
      actionText: 'View Obligations',
      progress: 45
    },
    {
      id: 'registration-compliance',
      title: 'Registration & Compliance',
      description: 'Apply for TCC or new PIN registration',
      icon: <Building className="h-8 w-8 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      services: [
        'KRA PIN Registration - Individual',
        'Tax Compliance Certificate Application',
        'Know KRA Tax Service Office'
      ],
      actionText: 'Start Registration',
      progress: 30
    }
  ]

  const quickActions = [
    { 
      name: 'Production Test', 
      icon: <Zap className="h-5 w-5" />, 
      color: 'bg-green-100 text-green-600',
      route: '/production-test'
    },
    { 
      name: 'Environment Switch', 
      icon: <Shield className="h-5 w-5" />, 
      color: 'bg-blue-100 text-blue-600',
      route: '/environment-switcher'
    },
    { 
      name: 'Test API', 
      icon: <Target className="h-5 w-5" />, 
      color: 'bg-purple-100 text-purple-600',
      route: '/test-api'
    },
    { 
      name: 'API Docs', 
      icon: <FileText className="h-5 w-5" />, 
      color: 'bg-gray-100 text-gray-600',
      route: '/api-docs'
    }
  ]

  const recentActivity = [
    { action: 'PIN Verified', client: 'Jane Muthoni', status: 'success', time: '2 hours ago' },
    { action: 'PRN Generated', client: 'John Kamau', status: 'success', time: '4 hours ago' },
    { action: 'NIL Return Filed', client: 'Mary Wanjiku', status: 'pending', time: '1 day ago' }
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Shield className="h-10 w-10 text-blue-600" />
            Government Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Your gateway to KRA - Transform compliance into business success
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Compliance Score</div>
            <div className="text-2xl font-bold text-green-600">85%</div>
          </div>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Award className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-dashed border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>One-tap shortcuts for common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className={`h-20 flex flex-col gap-2 ${action.color} hover:scale-105 transition-transform`}
                onClick={() => {
                  router.push(`/agency/${params.agencyId}/government-services${action.route}`)
                }}
              >
                {action.icon}
                <span className="text-sm font-medium">{action.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className={`${category.color} transition-all hover:shadow-lg hover:scale-105 cursor-pointer`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {category.icon}
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {category.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {category.progress}% Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{category.progress}%</span>
                  </div>
                  <Progress value={category.progress} className="h-2" />
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-600 mb-2">Available Services:</div>
                  {category.services.slice(0, 3).map((service, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>{service}</span>
                    </div>
                  ))}
                  {category.services.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{category.services.length - 3} more services
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full mt-4" 
                  size="sm"
                  onClick={() => {
                    const routes = {
                      'verify-documents': '/verify-documents',
                      'file-returns': '/file-returns', 
                      'generate-prns': '/generate-prns',
                      'tax-obligations': '/tax-obligations',
                      'registration-compliance': '/registration-compliance'
                    }
                    router.push(`/agency/${params.agencyId}/government-services${routes[category.id as keyof typeof routes]}`)
                  }}
                >
                  {category.actionText}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest KRA interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.client}</div>
                  </div>
                  <div className="text-xs text-gray-400">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Compliance Overview
            </CardTitle>
            <CardDescription>Your KRA compliance status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Returns Filed</span>
                <span className="font-bold text-green-600">12/15</span>
              </div>
              <Progress value={80} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">PRNs Generated</span>
                <span className="font-bold text-blue-600">45</span>
              </div>
              <Progress value={90} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Verifications Done</span>
                <span className="font-bold text-purple-600">128</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                🎉 Ready to streamline your KRA compliance?
              </h3>
              <p className="text-gray-600">
                Transform boring government tasks into empowering business actions. 
                Start with any category above to begin your guided journey.
              </p>
            </div>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Star className="h-5 w-5 mr-2" />
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GovernmentHubPage