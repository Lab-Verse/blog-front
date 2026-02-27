import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Write a Post',
  description: 'Create and publish a new article.',
  robots: { index: false, follow: false },
}

export default function SubmissionLayout({ children }: { children: React.ReactNode }) {
  return children
}
