import { auth } from '@/auth'
import DashboardPostsManager from './DashboardPostsManager'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Dashboard - Posts',
  description: 'Manage your blog posts',
}

const Page = async () => {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Posts</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create, edit, and manage your blog posts
        </p>
      </div>

      <DashboardPostsManager userId={session.user.id} />
    </div>
  )
}

export default Page
