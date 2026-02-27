'use client'

import dynamic from 'next/dynamic'
import '@/styles/_tiptap-keyframe-animations.scss'
import '@/styles/_tiptap-variables.scss'

const SimpleEditor = dynamic(
  () => import('@/components/tiptap-templates/simple/simple-editor').then((m) => m.SimpleEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-neutral-500">Loading editor...</div>
      </div>
    ),
  }
)

const Page = () => {
  return (
    <>
      <SimpleEditor />
    </>
  )
}

export default Page
