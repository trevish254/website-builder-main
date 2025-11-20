import { getAuthUserDetails } from '@/lib/queries'
import { redirect } from 'next/navigation'
import SubAccountDetails from '@/components/forms/subaccount-details'

type Props = {
  params: { agencyId: string }
}

const CreateSubaccountPage = async ({ params }: Props) => {
  const user = await getAuthUserDetails()
  if (!user) redirect('/sign-in')

  const agencyDetails = (user as any).Agency

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Create New Subaccount
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add a new subaccount to your agency
          </p>
        </div>
        
        <SubAccountDetails
          agencyDetails={agencyDetails}
          userId={user.id}
          userName={user.name}
        />
      </div>
    </div>
  )
}

export default CreateSubaccountPage
