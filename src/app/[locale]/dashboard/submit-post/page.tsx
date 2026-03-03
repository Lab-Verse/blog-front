'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import '@/styles/_tiptap-keyframe-animations.scss'
import '@/styles/_tiptap-variables.scss'

const SimpleEditor = dynamic(
  () =>
    import('@/components/tiptap-templates/simple/simple-editor').then(
      (m) => m.SimpleEditor
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-pulse text-neutral-500">Loading editor...</div>
      </div>
    ),
  }
)

const Page = () => {
  return (
    <div className="-mx-4 -mt-8 sm:-mx-6 lg:-mx-8">
      <Suspense fallback={<div className="flex h-[60vh] items-center justify-center"><div className="animate-pulse text-neutral-500">Loading editor...</div></div>}>
        <SimpleEditor />
      </Suspense>
    </div>
  )
}

export default Page
