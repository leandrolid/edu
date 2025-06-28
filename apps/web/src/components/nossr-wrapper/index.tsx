'use client'

import dynamic from 'next/dynamic'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export const NoSSRWrapper = dynamic(() => Promise.resolve(Wrapper), {
  ssr: false,
})
