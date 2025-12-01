import { getAuthUserDetails } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import AgencyNetworkChart from '@/components/global/agency-network-chart'
import AgencySubaccountStreamChart from '@/components/global/agency-subaccount-stream-chart'

type Props = {
    params: { agencyId: string }
}

const SubaccountsMetricsPage = async ({ params }: Props) => {
    const user = await getAuthUserDetails()
    if (!user) return null

    let agencyDetails: any = null
    let subaccounts: any[] = []

    try {
        const { data: agencyData } = await supabase
            .from('Agency')
            .select('*')
            .eq('id', params.agencyId)
            .single()

        const { data: subaccountsData } = await supabase
            .from('SubAccount')
            .select('*')
            .eq('agencyId', params.agencyId)

        agencyDetails = agencyData
        subaccounts = subaccountsData || []

        // Fetch funnels and their pages for each subaccount
        if (subaccounts.length > 0) {
            const subaccountIds = subaccounts.map((sub) => sub.id)

            const { data: funnelsData } = await supabase
                .from('Funnel')
                .select(`
          *,
          FunnelPage (*)
        `)
                .in('subAccountId', subaccountIds)

            // Attach funnels to their respective subaccounts
            subaccounts = subaccounts.map((subaccount) => ({
                ...subaccount,
                funnels: funnelsData?.filter((funnel) => funnel.subAccountId === subaccount.id) || [],
            }))
        }
    } catch (error) {
        console.error('Database connection failed:', error)
        agencyDetails = {
            id: params.agencyId,
            name: 'Your Agency',
        }
        subaccounts = []
    }

    return (
        <div className="flex flex-col gap-4 p-6">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Subaccounts Metrics</h1>
                    <p className="text-muted-foreground">
                        Performance analytics and network overview for all subaccounts
                    </p>
                </div>
                <Link href={`/agency/${params.agencyId}/all-subaccounts`}>
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Subaccounts
                    </Button>
                </Link>
            </div>

            {/* Metrics Charts */}
            <div className="flex gap-4 flex-col lg:!flex-row">
                {/* Stream Chart - 70% width */}
                <Card className="flex-[0.7]">
                    <CardHeader>
                        <CardTitle>Subaccount Activity Performance</CardTitle>
                        <CardDescription>
                            Activity trends across all subaccounts over time
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AgencySubaccountStreamChart subaccounts={subaccounts} />
                    </CardContent>
                </Card>

                {/* Network Chart - 30% width */}
                <Card className="flex-[0.3]">
                    <CardHeader>
                        <CardTitle>Network Overview</CardTitle>
                        <CardDescription>
                            Visual representation of your agency network showing subaccounts and funnel visitors
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AgencyNetworkChart
                            agencyName={agencyDetails?.name || 'Agency'}
                            subaccounts={subaccounts}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default SubaccountsMetricsPage
