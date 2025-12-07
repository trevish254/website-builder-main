import { supabase } from '@/lib/supabase'
import { getDomainContent } from '@/lib/queries'
import { getWebsiteByDomain } from '@/lib/website-queries'
import EditorProvider from '@/providers/editor/editor-provider'
import { notFound } from 'next/navigation'
import React from 'react'
import FunnelEditor from '../(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor'

const Page = async ({ params }: { params: { domain: string } }) => {
  try {
    const domainData = await getDomainContent(params.domain.slice(0, -1))

    if (domainData) {
      const pageData = domainData.FunnelPage.find((page) => !page.pathName)
      if (!pageData) return notFound()

      await supabase
        .from('FunnelPage')
        .update({ visits: (pageData.visits || 0) + 1 })
        .eq('id', pageData.id)

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
    }

    // If no funnel found, try Website
    const website = await getWebsiteByDomain(params.domain)
    if (website) {
      // Find the index page or the first page
      const page = website.WebsitePage.find(p => p.pathName === 'index') || website.WebsitePage[0]
      if (!page) return notFound()

      // Track visits (optional, similar to funnels)
      // await supabase.from('WebsitePage').update(...)

      return (
        <main>
          <title>{page.name} - {website.name}</title>

          {/* Inject CSS */}
          <style dangerouslySetInnerHTML={{ __html: page.cssContent || '' }} />
          <style dangerouslySetInnerHTML={{
            __html: `
                 .gjs-block { min-height: 50px; }
               `}} />

          {/* Custom Head (Scripts/Styles) */}
          {website.customHead && <div dangerouslySetInnerHTML={{ __html: website.customHead }} />}
          {page.customHead && <div dangerouslySetInnerHTML={{ __html: page.customHead }} />}

          {/* Main Content */}
          <div dangerouslySetInnerHTML={{ __html: page.htmlContent || '' }} />

          {/* Custom Body */}
          {website.customBody && <div dangerouslySetInnerHTML={{ __html: website.customBody }} />}
          {page.customBody && <div dangerouslySetInnerHTML={{ __html: page.customBody }} />}
        </main>
      )
    }

    return notFound()

  } catch (error) {
    console.log('Error loading domain content:', error)
    return notFound()
  }
}

export default Page
