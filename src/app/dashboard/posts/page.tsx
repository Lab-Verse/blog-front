import DashboardPostsManager from './DashboardPostsManager'

export const metadata = {
  title: 'Dashboard - Posts',
  description: 'Manage your blog posts',
}

const Page = () => {
  // TODO: Replace with actual user ID from auth
  const userId = 'user-id-placeholder'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Posts</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create, edit, and manage your blog posts
        </p>
      </div>

      <DashboardPostsManager userId={userId} />
    </div>
  )
}

export default Page
