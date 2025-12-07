import { getClientDocs } from '@/lib/client-docs-queries'
import { Button } from '@/components/ui/button'
import { Plus, LayoutGrid, List } from 'lucide-react'
import Link from 'next/link'
import ClientDocsList from './_components/client-docs-list'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

type Props = {
    params: { agencyId: string }
    searchParams: { view?: 'grid' | 'list' }
}

const ClientDocsPage = async ({ params, searchParams }: Props) => {
    const docs = await getClientDocs(params.agencyId)
    const viewMode = searchParams.view || 'grid'

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-background">
                <div>
                    <h1 className="text-2xl font-bold">Client Documents</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage agreements, invoices, and client communications
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* View Toggle */}
                    <ToggleGroup type="single" value={viewMode} className="border rounded-lg">
                        <ToggleGroupItem value="grid" aria-label="Grid view" asChild>
                            <Link href={`/agency/${params.agencyId}/client-docs?view=grid`}>
                                <LayoutGrid className="h-4 w-4" />
                            </Link>
                        </ToggleGroupItem>
                        <ToggleGroupItem value="list" aria-label="List view" asChild>
                            <Link href={`/agency/${params.agencyId}/client-docs?view=list`}>
                                <List className="h-4 w-4" />
                            </Link>
                        </ToggleGroupItem>
                    </ToggleGroup>

                    <Button asChild>
                        <Link href={`/agency/${params.agencyId}/client-docs/new`}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Document
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                {docs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="text-6xl mb-4">📄</div>
                        <h2 className="text-xl font-semibold mb-2">No documents yet</h2>
                        <p className="text-muted-foreground mb-6">
                            Create your first client document to get started
                        </p>
                        <Button asChild>
                            <Link href={`/agency/${params.agencyId}/client-docs/new`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Document
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <ClientDocsList
                        docs={docs}
                        agencyId={params.agencyId}
                        viewMode={viewMode}
                    />
                )}
            </div>
        </div>
    )
}

export default ClientDocsPage
