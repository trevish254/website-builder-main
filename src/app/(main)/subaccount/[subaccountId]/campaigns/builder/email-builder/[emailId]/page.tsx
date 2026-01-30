import React from 'react'
import { redirect } from 'next/navigation'
import { getEmailCampaign } from '@/lib/email-queries'
import GrapeJsEmailEditor from '@/components/global/grapejs-email-editor'

type Props = {
    params: {
        subaccountId: string
        emailId: string
    }
}

const EmailEditorPage = async ({ params }: Props) => {
    const emailDetails = await getEmailCampaign(params.emailId)

    if (!emailDetails) {
        return redirect(`/subaccount/${params.subaccountId}/campaigns/builder/email-builder`)
    }

    return (
        <div className="fixed inset-0 z-[40] bg-background font-sans">
            <GrapeJsEmailEditor
                subaccountId={params.subaccountId}
                emailId={params.emailId}
                emailDetails={emailDetails}
            />
        </div>
    )
}

export default EmailEditorPage
