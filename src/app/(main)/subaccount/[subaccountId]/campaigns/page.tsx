import BlurPage from '@/components/global/blur-page'
import React from 'react'

type Props = {}

const CampaignsPage = (props: Props) => {
    return (
        <BlurPage>
            <div className="flex flex-col gap-4 relative">
                <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center justify-between border-b">
                    Campaigns
                </h1>
                <div className="flex items-center justify-center p-20">
                    <span className="text-muted-foreground">Select a campaign or create a new one to get started.</span>
                </div>
            </div>
        </BlurPage>
    )
}

export default CampaignsPage
