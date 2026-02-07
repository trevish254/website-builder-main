
import React from 'react'
import { ReportsClient } from '@/app/(main)/agency/[agencyId]/reports/_components/reports-client'
import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'

const Page = async ({ params }: { params: { subaccountId: string } }) => {
    // Get subaccount details to find agencyId
    const { data: subaccount, error } = await supabase
        .from('SubAccount')
        .select('id, name, agencyId')
        .eq('id', params.subaccountId)
        .single()

    if (error || !subaccount) {
        return redirect('/dashboards')
    }

    return (
        <div className="w-full h-full relative">
            <ReportsClient
                agencyId={subaccount.agencyId}
                subaccounts={[subaccount]}
                defaultSubaccountId={subaccount.id}
            />
        </div>
    )
}

export default Page
