import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  redirect(`/post/${handle}`)
}
