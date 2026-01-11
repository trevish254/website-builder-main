import React from 'react'
import GrapeJsEditor from '@/components/global/grapejs-editor'
import { FunnelPage } from '@prisma/client'
import { redirect } from 'next/navigation'
import { upsertWebsite, getWebsite, getWebsitePages } from '@/lib/website-queries'
import { getUser } from '@/lib/supabase/server'

type Props = {
    params: {
        subaccountId: string
        websiteId: string
    }
    searchParams: {
        template?: string
        pageId?: string
    }
}

const WebsiteEditorPage = async ({ params, searchParams }: Props) => {
    // Get authenticated user
    const user = await getUser()
    if (!user) {
        redirect('/sign-in')
    }

    // Fetch real data
    const website = await getWebsite(params.websiteId)
    const websitePages = await getWebsitePages(params.websiteId)

    if (!website) {
        return <div className="p-20 text-center">Website not found</div>
    }

    // Determine which page to load
    // 1. Check searchParams for specific pageId
    // 2. If we have pages, try finding 'Home' or '/'
    // 3. Fallback to the first ordered page

    let pageToLoad = searchParams.pageId
        ? websitePages.find(page => page.id === searchParams.pageId)
        : websitePages.find(page => page.pathName === '/' || page.name === 'Home') || websitePages[0]

    // If still no page, we might want to create one on the fly or show error?
    // But our create flow ensures a page. 
    // If somehow empty, we could pass a partial mock or redirect.
    if (!pageToLoad) {
        // Fallback mock if completely empty
        pageToLoad = {
            id: 'new', // Logic in editor might need adjustment if id is new but website exists
            websiteId: website.id,
            name: 'Home',
            pathName: 'index',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            content: null,
            order: 0,
            previewImage: null,
        } as any
    }

    return (
        <div className="fixed inset-0 z-[40] bg-background font-sans">
            <GrapeJsEditor
                subaccountId={params.subaccountId}
                funnelId={website.id}
                pageDetails={pageToLoad}
                websitePages={websitePages}
                userId={user.id}
                websiteName={website.name}
                currentDomain={website.domain || undefined}
                website={website}
            />
        </div>
    )
}

export default WebsiteEditorPage
