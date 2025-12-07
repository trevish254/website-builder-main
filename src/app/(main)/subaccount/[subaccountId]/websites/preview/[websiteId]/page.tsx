import { getWebsite, getWebsitePages } from '@/lib/website-queries'
import { notFound } from 'next/navigation'
import React from 'react'

type Props = {
    params: {
        subaccountId: string
        websiteId: string
    }
}

const WebsitePreviewPage = async ({ params }: Props) => {
    try {
        const website = await getWebsite(params.websiteId)
        if (!website) return notFound()

        const pages = await getWebsitePages(params.websiteId)
        // Default to Home or first page
        const page = pages.find(p => p.pathName === '/' || p.name === 'Home') || pages[0]

        if (!page) {
            return <div className="text-center p-20">No pages to preview</div>
        }

        return (
            <main>
                <style dangerouslySetInnerHTML={{ __html: page.cssContent || '' }} />
                {/* Basic GrapesJS Reset Styles if needed, though usually included in cssContent if proper build */}

                {/* Custom Head */}
                {website.customHead && <div dangerouslySetInnerHTML={{ __html: website.customHead }} />}
                {page.customHead && <div dangerouslySetInnerHTML={{ __html: page.customHead }} />}

                {/* Content */}
                <div dangerouslySetInnerHTML={{ __html: page.htmlContent || '' }} />

                {/* Custom Body */}
                {website.customBody && <div dangerouslySetInnerHTML={{ __html: website.customBody }} />}
                {page.customBody && <div dangerouslySetInnerHTML={{ __html: page.customBody }} />}
            </main>
        )

    } catch (error) {
        console.error('Error loading full preview:', error)
        return notFound()
    }
}

export default WebsitePreviewPage
