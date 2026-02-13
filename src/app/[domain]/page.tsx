import { getDomainContent } from '@/lib/queries'
import { getWebsiteByDomain } from '@/lib/website-queries'
import EditorProvider from '@/providers/editor/editor-provider'
import { notFound } from 'next/navigation'
import React from 'react'
import FunnelEditor from '../(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor'
import { createClient } from '@/lib/supabase/server'

const Page = async ({ params }: { params: { domain: string } }) => {
  try {
    const mainDomain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000'
    const decodedDomain = decodeURIComponent(params.domain)
    const decodedMain = decodeURIComponent(mainDomain)

    let subdomainPart = decodedDomain

    console.log(`[DomainPage] Starting load:
  - Raw Domain: ${params.domain}
  - Decoded: ${decodedDomain}
  - Main Domain: ${mainDomain}
  - Decoded Main: ${decodedMain}`)

    // Extract the actual subdomain if it's on our main app domain
    const mainDomainWithoutPort = decodedMain.split(':')[0]
    const domainWithoutPort = decodedDomain.split(':')[0]

    if (domainWithoutPort.endsWith(mainDomainWithoutPort)) {
      subdomainPart = domainWithoutPort.replace(new RegExp(`\\.?${mainDomainWithoutPort}$`), '')
      console.log(`[DomainPage] Host matched main domain. subdomainPart: "${subdomainPart}"`)
    }

    console.log(`[DomainPage] Calling getDomainContent(subdomainPart: "${subdomainPart}")`)
    const domainData = await getDomainContent(subdomainPart)

    if (domainData) {
      console.log(`[DomainPage] Found Funnel: ${domainData.id}`)
      const pageData = domainData.FunnelPage.find((page) => !page.pathName || page.pathName === 'index')

      if (!pageData) {
        console.warn(`[DomainPage] Funnel found but no index page found for path "/"`)
        return notFound()
      }

      // Track visits
      const supabase = createClient()
      await supabase
        .from('FunnelPage')
        .update({ visits: (pageData.visits || 0) + 1 })
        .eq('id', pageData.id)

      return (
        <EditorProvider
          subaccountId={domainData.subAccountId}
          funnelId={domainData.id}
          pageDetails={pageData}
        >
          <FunnelEditor
            funnelPageId={pageData.id}
            liveMode={true}
          />
        </EditorProvider>
      )
    }

    // If no funnel found, try Website
    console.log(`[DomainPage] No Funnel found. Testing Website lookup for: "${decodedDomain}"`)
    const website = await getWebsiteByDomain(decodedDomain)

    if (website) {
      console.log(`[DomainPage] Website found: ${website.id} (${website.name})`)
      // Find the index page or the first page
      const page = website.WebsitePage.find(p => p.pathName === 'index') || website.WebsitePage[0]
      if (!page) {
        console.warn(`[DomainPage] Website found but has no pages.`)
        return notFound()
      }

      return (
        <main>
          <title>{page.name} - {website.name}</title>

          {/* Inject CSS */}
          <style dangerouslySetInnerHTML={{ __html: page.cssContent || '' }} />
          <style dangerouslySetInnerHTML={{
            __html: `
              .gjs-block { min-height: 50px; }
            `
          }} />

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

    console.warn(`[DomainPage] No Funnel or Website found matching domain. Returning 404.`)
    return notFound()

  } catch (error) {
    console.log('Error loading domain content:', error)
    return notFound()
  }
}

export default Page
