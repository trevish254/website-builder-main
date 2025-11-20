import BlurPage from '@/components/global/blur-page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Settings, Zap } from 'lucide-react'
import React from 'react'

type Props = {
  params: { subaccountId: string }
}

const AutomationsPage = async ({ params }: Props) => {
  return (
    <BlurPage>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Automations</h1>
          <p className="text-muted-foreground">
            Manage your automated workflows and triggers
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Automation
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Active Automations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Active Automations
            </CardTitle>
            <CardDescription>
              Automations currently running in your subaccount
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <h3 className="font-medium">Welcome Email Sequence</h3>
                    <p className="text-sm text-muted-foreground">
                      Sends welcome email to new contacts
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Active</Badge>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <h3 className="font-medium">Follow-up Reminder</h3>
                    <p className="text-sm text-muted-foreground">
                      Reminds to follow up with leads after 3 days
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Active</Badge>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automation Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Automation Templates</CardTitle>
            <CardDescription>
              Pre-built automation workflows you can use
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <h3 className="font-medium mb-2">Lead Nurturing</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Automatically nurture leads through your sales funnel
                </p>
                <Button variant="outline" size="sm">Use Template</Button>
              </div>

              <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <h3 className="font-medium mb-2">Customer Onboarding</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Welcome new customers with automated sequences
                </p>
                <Button variant="outline" size="sm">Use Template</Button>
              </div>

              <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <h3 className="font-medium mb-2">Abandoned Cart Recovery</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Recover lost sales with automated follow-ups
                </p>
                <Button variant="outline" size="sm">Use Template</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BlurPage>
  )
}

export default AutomationsPage
