import { supabase } from '@/lib/supabase'
import { getDomainContent } from '@/lib/queries'
import EditorProvider from '@/providers/editor/editor-provider'
import { notFound } from 'next/navigation'
import React from 'react'
import FunnelEditorNavigation from '../(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor-navigation'
import FunnelEditor from '../(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor'

const Page = async ({ params }: { params: { domain: string } }) => {
  try {
    const domainData = await getDomainContent(params.domain.slice(0, -1))
    if (!domainData) return notFound()

    const pageData = domainData.FunnelPage.find((page) => !page.pathName)

    if (!pageData) return notFound()

    // Only update visits if database is available
    try {
      await supabase
        .from('FunnelPage')
        .update({ visits: (pageData.visits || 0) + 1 })
        .eq('id', pageData.id)
    } catch (dbError) {
      console.log('Database update failed, continuing without visit tracking:', dbError)
    }

    return (
      <EditorProvider
        subaccountId={domainData.subAccountId}
        pageDetails={pageData}
        funnelId={domainData.id}
      >
        <FunnelEditor
          funnelPageId={pageData.id}
          liveMode={true}
        />
      </EditorProvider>
    )
  } catch (error) {
    console.log('Error loading domain content:', error)
    return notFound()
  }
}

export default Page
