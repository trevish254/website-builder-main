import { getClientDocDetails } from '@/lib/client-docs-queries'
import ClientDocEditor from '../_components/client-doc-editor'
import { redirect } from 'next/navigation'

type Props = {
    params: { agencyId: string; docId: string }
}

const ClientDocEditorPage = async ({ params }: Props) => {
    const doc = await getClientDocDetails(params.docId)

    if (!doc) {
        return redirect(`/agency/${params.agencyId}/client-docs`)
    }

    return (
        <ClientDocEditor doc={doc} agencyId={params.agencyId} />
    )
}

export default ClientDocEditorPage
