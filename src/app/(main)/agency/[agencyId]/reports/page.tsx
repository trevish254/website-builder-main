
import React from 'react'
import { ReportsClient } from './_components/reports-client'
import { supabase } from '@/lib/supabase'

const Page = async ({ params }: { params: { agencyId: string } }) => {
    let subaccounts: any[] = []

    try {
        const { data } = await supabase
            .from('SubAccount')
            .select('id, name, address, agencyId')
            .eq('agencyId', params.agencyId)

        if (data) subaccounts = data
    } catch (error) {
        console.error('Error fetching subaccounts:', error)
    }

    return (
        <div className="w-full h-full relative">
            <ReportsClient agencyId={params.agencyId} subaccounts={subaccounts} />
        </div>
    )
}

export default Page
