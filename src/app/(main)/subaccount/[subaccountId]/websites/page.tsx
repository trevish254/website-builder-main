import { getFunnels } from '@/lib/queries'
import React from 'react'
import WebsitesDataTable from './data-table'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import FunnelForm from '@/components/forms/funnel-form'
import BlurPage from '@/components/global/blur-page'

const Websites = async ({ params }: { params: { subaccountId: string } }) => {
    const funnels = await getFunnels(params.subaccountId)

    if (!funnels) {
        return (
            <BlurPage>
                <div className="text-center py-8">
                    <h2 className="text-2xl font-bold mb-4">No Websites Found</h2>
                    <p className="text-muted-foreground mb-4">
                        Create your first website to get started
                    </p>
                    <div className="flex flex-col gap-4 items-center">
                        <WebsitesDataTable
                            actionButtonText={
                                <>
                                    <Plus size={15} />
                                    Create Website
                                </>
                            }
                            modalChildren={
                                <FunnelForm subAccountId={params.subaccountId}></FunnelForm>
                            }
                            filterValue="name"
                            columns={columns}
                            data={[]}
                        />
                        <a
                            href={`/subaccount/${params.subaccountId}/websites/demo`}
                            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center text-sm font-medium"
                        >
                            Try New Builder (Demo)
                        </a>
                    </div>
                </div>
            </BlurPage>
        )
    }

    return (
        <BlurPage>
            <div className="mb-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Websites</h1>
                    <p className="text-muted-foreground">
                        Manage your websites and landing pages
                    </p>
                </div>
                <div className="flex gap-2">
                    <a
                        href={`/subaccount/${params.subaccountId}/websites/demo`}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center text-sm font-medium"
                    >
                        Try New Builder (Demo)
                    </a>
                </div>
            </div>
            <WebsitesDataTable
                actionButtonText={
                    <>
                        <Plus size={15} />
                        Create Website
                    </>
                }
                modalChildren={
                    <FunnelForm subAccountId={params.subaccountId}></FunnelForm>
                }
                filterValue="name"
                columns={columns}
                data={funnels}
            />
        </BlurPage>
    )
}

export default Websites
