import BlurPage from '@/components/global/blur-page'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'
import {
  CheckCircleIcon,
  Smartphone,
  Building2,
  FileText,
  Shield,
  Upload,
  Zap,
  ArrowRight,
  ExternalLink,
  Settings,
  TrendingUp,
  Globe,
  CreditCard
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
  searchParams: {
    state: string
    code: string
  }
  params: { subaccountId: string }
}

const LaunchPad = async ({ params, searchParams }: Props) => {
  const { data: subaccountDetails } = await supabase
    .from('SubAccount')
    .select('*')
    .eq('id', params.subaccountId)
    .single()

  if (!subaccountDetails) {
    return
  }

  const allDetailsExist =
    subaccountDetails.address &&
    subaccountDetails.subAccountLogo &&
    subaccountDetails.city &&
    subaccountDetails.companyEmail &&
    subaccountDetails.companyPhone &&
    subaccountDetails.country &&
    subaccountDetails.name &&
    subaccountDetails.state

  // Integration status - these would be fetched from your database/API
  const integrations = {
    mpesa: { completed: true, name: 'M-Pesa', description: 'Mobile payment processing' },
    kra: { completed: false, name: 'KRA Integration', description: 'Tax services and compliance' },
    stripe: { completed: false, name: 'Stripe', description: 'Payment processing' },
    uploadthing: { completed: false, name: 'UploadThing', description: 'File upload service' },
    business: { completed: allDetailsExist, name: 'Business Profile', description: 'Company details and settings' }
  }

  const completedCount = Object.values(integrations).filter(i => i.completed).length
  const totalCount = Object.keys(integrations).length
  const progressPercentage = (completedCount / totalCount) * 100

  return (
    <BlurPage>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome to {subaccountDetails.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Complete your setup to unlock the full potential of your business platform
              </p>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Setup Progress</span>
                  <span className="text-sm text-muted-foreground">{completedCount}/{totalCount} completed</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>

            {/* Quick Actions */}
            <Card className="mb-8 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Essential steps to get your subaccount running smoothly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/appstore.png"
                        alt="Mobile App"
                        height={40}
                        width={40}
                        className="rounded-lg"
                      />
                      <div>
                        <p className="font-medium">Mobile App</p>
                        <p className="text-sm text-muted-foreground">Save as shortcut</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Install
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Subaccount Settings</p>
                        <p className="text-sm text-muted-foreground">Configure preferences</p>
                      </div>
                    </div>
                    <Link href={`/subaccount/${subaccountDetails.id}/settings`}>
                      <Button size="sm" variant="outline">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Integration Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* M-Pesa Integration */}
              <Card className={`border-0 shadow-lg transition-all duration-300 hover:shadow-xl ${integrations.mpesa.completed ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' : 'bg-white/80 dark:bg-slate-800/80'} backdrop-blur-sm`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    {integrations.mpesa.completed ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    ) : (
                      <Badge variant="secondary">Setup Required</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{integrations.mpesa.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{integrations.mpesa.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      <span>Mobile payments</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      <span>Transaction history</span>
                    </div>
                  </div>
                </CardContent>
              </Card>



              {/* Stripe Integration */}
              <Card className={`border-0 shadow-lg transition-all duration-300 hover:shadow-xl ${integrations.stripe.completed ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20' : 'bg-white/80 dark:bg-slate-800/80'} backdrop-blur-sm`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    {integrations.stripe.completed ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    ) : (
                      <Badge variant="secondary">Optional</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{integrations.stripe.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{integrations.stripe.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                      <span>Online payments</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-purple-500" />
                      <span>Secure transactions</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full mt-4" variant={integrations.stripe.completed ? "outline" : "default"}>
                    {integrations.stripe.completed ? "Manage" : "Setup Stripe"}
                  </Button>
                </CardContent>
              </Card>

              {/* UploadThing Integration */}
              <Card className={`border-0 shadow-lg transition-all duration-300 hover:shadow-xl ${integrations.uploadthing.completed ? 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20' : 'bg-white/80 dark:bg-slate-800/80'} backdrop-blur-sm`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    {integrations.uploadthing.completed ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    ) : (
                      <Badge variant="secondary">Optional</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{integrations.uploadthing.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{integrations.uploadthing.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Upload className="w-4 h-4 text-orange-500" />
                      <span>File uploads</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-orange-500" />
                      <span>Secure storage</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full mt-4" variant={integrations.uploadthing.completed ? "outline" : "default"}>
                    {integrations.uploadthing.completed ? "Manage" : "Setup Upload"}
                  </Button>
                </CardContent>
              </Card>

              {/* Business Profile */}
              <Card className={`border-0 shadow-lg transition-all duration-300 hover:shadow-xl ${integrations.business.completed ? 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20' : 'bg-white/80 dark:bg-slate-800/80'} backdrop-blur-sm`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    {integrations.business.completed ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    ) : (
                      <Badge variant="secondary">Required</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{integrations.business.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{integrations.business.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      {allDetailsExist ? (
                        <CheckCircleIcon className="w-4 h-4 text-indigo-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-indigo-500" />
                      )}
                      <span>Company details</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {allDetailsExist ? (
                        <CheckCircleIcon className="w-4 h-4 text-indigo-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-indigo-500" />
                      )}
                      <span>Contact information</span>
                    </div>
                  </div>
                  <Link href={`/subaccount/${subaccountDetails.id}/settings`} className="mt-4 block">
                    <Button size="sm" className="w-full" variant={allDetailsExist ? "outline" : "default"}>
                      {allDetailsExist ? "Manage Profile" : "Complete Profile"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/subaccount/${subaccountDetails.id}`}>
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Zap className="w-5 h-5 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
              <Link href={`/subaccount/${subaccountDetails.id}/settings`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Settings className="w-5 h-5 mr-2" />
                  Subaccount Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BlurPage>
  )
}

export default LaunchPad
