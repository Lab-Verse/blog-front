import DashboardProfileEditor from './DashboardProfileEditor'

export const metadata = {
  title: 'Dashboard - Edit Profile',
  description: 'Edit your profile information',
}

const Page = () => {
  // TODO: Replace with actual user ID from auth
  const userId = 'user-id-placeholder'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Update your profile information and settings
        </p>
      </div>

      <DashboardProfileEditor userId={userId} />
    </div>
  )
}

export default Page
