'use client'
import React from 'react'
import { PageBuilderReact } from '@/components/external-builder/react'
import '@/components/external-builder/core/styles/main.css'

const DemoPage = () => {
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
                layoutMode="grid"
                editable={true}
            />
        </div>
    )
}

export default DemoPage
