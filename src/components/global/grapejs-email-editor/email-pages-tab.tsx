'use client'
import React from 'react'
import { Files } from 'lucide-react'

const EmailPagesTab = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
            <Files className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm font-medium">Campaign Pages</p>
            <p className="text-xs opacity-60">Emails are single-page documents. All your content belongs here.</p>
        </div>
    )
}

export default EmailPagesTab
