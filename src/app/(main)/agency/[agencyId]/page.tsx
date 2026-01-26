import CircleProgress from '@/components/global/circle-progress'
import AgencyNetworkChart from '@/components/global/agency-network-chart'
import AgencySubaccountStreamChart from '@/components/global/agency-subaccount-stream-chart'
import AgencyTeamTreeChart from '@/components/global/agency-team-tree-chart'
import VisaAccountCard from '@/components/global/dashboard-cards/visa-account-card'
import TotalIncomeCard from '@/components/global/dashboard-cards/total-income-card'
import TotalPaidCard from '@/components/global/dashboard-cards/total-paid-card'
import SystemLockCard from '@/components/global/dashboard-cards/system-lock-card'
import TimeRemainingCard from '@/components/global/dashboard-cards/time-remaining-card'
import ActivityChartCard from '@/components/global/dashboard-cards/activity-chart-card'
import ActivityManagerCard from '@/components/global/dashboard-cards/activity-manager-card'
import TotalSalesChart from '@/components/global/dashboard-cards/total-sales-chart'
import AnimatedCardChart from '@/components/global/dashboard-cards/animated-card-chart'
import ClientHealthScoreCard from '@/components/global/dashboard-cards/client-health-score-card'
import SubaccountTableCard from '@/components/global/dashboard-cards/subaccount-table-card'

import CalendarCard from '@/components/global/dashboard-cards/calendar-card'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { AreaChart } from '@tremor/react'
import {
  ClipboardIcon,
  Contact2,
  DollarSign,
  Goal,
  ShoppingCart,
  Users,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Page = async ({
  params,
}: {
  params: { agencyId: string }
  searchParams: { code: string }
}) => {
  let currency = 'USD'
  let sessions = []
  let totalClosedSessions = []
  let totalPendingSessions = []
  let net = 0
  let potentialIncome = 0
  let closingRate = 0
  const currentYear = new Date().getFullYear()

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

      // Fetch employees for each subaccount
      const { data: employeesData } = await supabase
        .from('SubAccountEmployee')
        .select('*')
        .in('subAccountId', subaccountIds)
        .eq('isActive', true)

      // Fetch user details for employees
      let employeesWithUsers: any[] = []
      if (employeesData && employeesData.length > 0) {
        const userIds = employeesData.map((emp) => emp.userId)
        const { data: usersData } = await supabase
          .from('User')
          .select('id, name, email')
          .in('id', userIds)

        employeesWithUsers = employeesData.map((emp) => {
          const user = usersData?.find((u) => u.id === emp.userId)
          return {
            ...emp,
            userName: user?.name || `User ${emp.userId.slice(0, 8)}`,
            userEmail: user?.email || '',
          }
        })
      }

      // Attach funnels and employees to their respective subaccounts
      subaccounts = subaccounts.map((subaccount) => ({
        ...subaccount,
        funnels: funnelsData?.filter((funnel) => funnel.subAccountId === subaccount.id) || [],
        employees: employeesWithUsers.filter((emp) => emp.subAccountId === subaccount.id) || [],
      }))
    }
  } catch (error) {
    console.error('Database connection failed, using mock data:', error)
    // Use mock data when database is not set up
    agencyDetails = {
      id: params.agencyId,
      name: 'Your Agency',
      goal: 5,
      connectAccountId: null,
    }
    subaccounts = []
  }

  if (!agencyDetails) return

  // M-Pesa integration (Stripe disabled)
  currency = 'KES' // Kenyan Shilling
  sessions = []
  totalClosedSessions = []
  totalPendingSessions = []
  net = 0
  potentialIncome = 0
  closingRate = 0

  // Mock transaction data for Recent Transactions
  const recentTransactions = [
    { id: 'SPD-0051', amount: '137.000', status: 'Paid' },
    { id: 'SPD-0046', amount: '432.100', status: 'Pending' },
    { id: 'SPD-0165', amount: '200.000', status: 'Paid' },
    { id: 'SPD-6390', amount: '365.000', status: 'Paid' },
  ]



  // Mock cash flow data
  const cashFlowData = [
    { month: 'May', income: 520, expense: 380 },
    { month: 'Jun', income: 580, expense: 420 },
    { month: 'Jul', income: 640, expense: 450 },
    { month: 'Aug', income: 692, expense: 374 },
    { month: 'Sep', income: 750, expense: 520 },
    { month: 'Oct', income: 820, expense: 580 },
    { month: 'Nov', income: 890, expense: 620 },
  ]

  return (
    <div className="relative h-full">
      <h1 className="text-4xl">Dashboard</h1>
      <Separator className="my-6" />
      <div className="flex flex-col gap-4 pb-6">
        {/* Summary Cards Row */}
        <div className="flex gap-4 flex-col lg:!flex-row">
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Income</CardDescription>
              <CardTitle className="text-4xl">
                {net ? `${currency} ${net.toFixed(2)}` : `$0.00`}
              </CardTitle>
              <small className="text-xs text-muted-foreground">
                For the year {currentYear}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Total revenue generated through transactions.
            </CardContent>
            <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Potential Income</CardDescription>
              <CardTitle className="text-4xl">
                {potentialIncome
                  ? `${currency} ${potentialIncome.toFixed(2)}`
                  : `$0.00`}
              </CardTitle>
              <small className="text-xs text-muted-foreground">
                For the year {currentYear}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              This is how much you can close.
            </CardContent>
            <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Active Clients</CardDescription>
              <CardTitle className="text-4xl">{subaccounts.length}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Reflects the number of sub accounts you own and manage.
            </CardContent>
            <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
          <Card className="flex-1 relative">
            <CardTitle>Agency Goal</CardTitle>
            <CardDescription>
              <p className="mt-2">
                Reflects the number of sub accounts you want to own and
                manage.
              </p>
            </CardDescription>
            <CardFooter>
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    Current: {subaccounts.length}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Goal: {agencyDetails.goal}
                  </span>
                </div>
                <Progress
                  value={(subaccounts.length / agencyDetails.goal) * 100}
                />
              </div>
            </CardFooter>
            <Goal className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
        </div>

        {/* Dashboard Cards Row 1 */}
        <div className="flex gap-4 flex-col lg:!flex-row">
          <VisaAccountCard />

          {/* Total Income, Total Paid, and System Lock Container */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Total Income and Total Paid - Side by Side */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <TotalIncomeCard />
              <TotalPaidCard />
            </div>

            {/* System Lock - Below Income/Paid */}
            <SystemLockCard />
          </div>

          {/* Calendar - Fourth position */}
          <CalendarCard />
        </div>

        {/* Dashboard Cards Split Layout */}
        <div className="flex gap-4 flex-col xl:!flex-row">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Row 1 in Left Column */}
            <div className="flex gap-4 flex-col lg:!flex-row">
              <div className="lg:flex-[0.4]">
                <TimeRemainingCard />
              </div>
              <div className="lg:flex-[0.6]">
                <ActivityChartCard />
              </div>
            </div>

            {/* Row 2 in Left Column */}
            <div className="flex gap-4 flex-col lg:!flex-row">
              <div className="lg:flex-[0.6]">
                <TotalSalesChart />
              </div>
              <div className="lg:flex-[0.4]">
                <AnimatedCardChart />
              </div>
            </div>

            {/* Row 3 in Left Column (Cash Flow & Financial Balance) */}
            <Card className="flex-1">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Cash Flow Analytics</CardTitle>
                  <select className="text-sm border rounded-md px-2 py-1">
                    <option>Monthly</option>
                    <option>Weekly</option>
                    <option>Yearly</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <AreaChart
                  className="h-72"
                  data={cashFlowData}
                  index="month"
                  categories={['income', 'expense']}
                  colors={['emerald', 'blue']}
                  showLegend
                  yAxisWidth={60}
                />
              </CardContent>
            </Card>

            {/* Row 4 in Left Column (Client Health Score Dashboard) */}
            <ClientHealthScoreCard />

          </div>
        </div>



        {/* New Section: Activity Manager & Financial Balance + Subaccount Table */}
        <div className="flex gap-4 flex-col xl:!flex-row">
          {/* Left Side: Activity Manager & Financial Balance */}
          <div className="xl:w-[400px] w-full flex flex-col gap-4">
            <ActivityManagerCard />
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Financial Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <CircleProgress
                    value={48}
                    description={
                      <div className="text-center">
                        <p className="text-2xl font-bold">48%</p>
                        <p className="text-xs text-muted-foreground">
                          from yesterday
                        </p>
                      </div>
                    }
                  />
                </div>
                <div className="flex justify-between mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground">Total Profit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                    <span className="text-muted-foreground">Profit Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-600" />
                    <span className="text-muted-foreground">For Week</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Subaccount Table List */}
          <div className="flex-1">
            <SubaccountTableCard className="h-full" />
          </div>
        </div>


        {/* Bottom Row - Recent Transactions and Tax Liabilities */}
        <div className="flex gap-4 flex-col lg:!flex-row">
          {/* Recent Transactions */}
          <Card className="flex-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Transactions</CardTitle>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="text-sm border rounded-md px-3 py-1 w-48"
                  />
                  <Button variant="outline" size="sm">
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">ORDER ID</th>
                      <th className="pb-3 pr-4 font-medium">AMOUNT</th>
                      <th className="pb-3 font-medium">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="py-3 pr-4 text-sm">{transaction.id}</td>
                        <td className="py-3 pr-4 text-sm">
                          ${transaction.amount}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${transaction.status === 'Paid'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                              }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card >


        </div>
      </div>
    </div>

  )
}

export default Page