import React from 'react'
import { PageBuilderReact } from '@/components/external-builder/react'
import '@/components/external-builder/core/styles/main.css'
import { getMedia } from '@/lib/queries'

type Props = {
    params: { subaccountId: string }
}

const DemoPage = async ({ params }: Props) => {
    const mediaFiles = await getMedia(params.subaccountId)
    const dynamicComponents = {
        Basic: [
            { name: 'button' },
            { name: 'header' },
            { name: 'text' },
            { name: 'table' },
        ],
    }

    return (
        <div className="h-full w-full bg-white">
            <PageBuilderReact
                config={dynamicComponents}
                layoutMode="absolute"
                editable={true}
                mediaFiles={mediaFiles}
            />
        </div>
    )
}

export default DemoPage
