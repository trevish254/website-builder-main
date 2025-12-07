import GrapeJsEditor from '@/components/global/grapejs-editor'
import React from 'react'

type Props = {
    params: { subaccountId: string }
}

const GrapeJsPage = ({ params }: Props) => {
    return <GrapeJsEditor subaccountId={params.subaccountId} />
}

export default GrapeJsPage
