import React from 'react'

type Props = {
  children: React.ReactNode
}

const BlurPage = ({ children }: Props) => {
  return (
    <div
      className="min-h-[calc(100vh-64px)] flex flex-col backdrop-blur-[35px] dark:bg-muted/40 bg-muted/60 dark:shadow-2xl dark:shadow-black p-4 relative z-[11] w-full"
      id="blur-page"
    >
      {children}
    </div>
  )
}

export default BlurPage
