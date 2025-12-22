import DashboardStats from './DashboardStats'

export const metadata = {
  title: 'Dashboard',
  description: 'Author Dashboard Overview',
}

const Page = () => {
  // TODO: Replace with actual user ID from auth
  const userId = 'user-id-placeholder'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back! Here's your blog overview
        </p>
      </div>

      <DashboardStats userId={userId} />
    </div>
  )
}

export default Page
