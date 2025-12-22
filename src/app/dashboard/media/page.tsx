import DashboardMediaLibrary from './DashboardMediaLibrary'

export const metadata = {
    title: 'Dashboard - Media',
    description: 'Manage your media library',
}

const Page = () => {
    // TODO: Replace with actual user ID from auth
    const userId = 'user-id-placeholder'

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Media Library</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Upload and manage your media files
                </p>
            </div>

            <DashboardMediaLibrary userId={userId} />
        </div>
    )
}

export default Page
