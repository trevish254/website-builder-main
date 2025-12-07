
import { getClientDocDetails } from '@/lib/client-docs-queries'
import EditorWrapper from '@/app/(main)/agency/[agencyId]/client-docs/_components/editor-wrapper'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

type Props = {
    params: { agencyId: string; docId: string }
}

const ClientDocPreviewPage = async ({ params }: Props) => {
    const doc = await getClientDocDetails(params.docId)

    if (!doc) {
        return redirect(`/agency/${params.agencyId}/client-docs`)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link href={`/agency/${params.agencyId}/client-docs/${params.docId}`}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Editor
                        </Button>
                    </Link>
                    <div className="text-sm text-muted-foreground">
                        Preview Mode
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-zinc-900 min-h-[500px] p-8 md:p-12 rounded-lg shadow-sm border">
                    <h1 className="text-3xl font-bold mb-4">{doc.title}</h1>
                    <EditorWrapper
                        data={doc.content}
                        readOnly={true}
                    />
                </div>
            </div>
        </div>
    )
}

export default ClientDocPreviewPage
