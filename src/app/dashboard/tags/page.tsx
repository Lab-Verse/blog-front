import DashboardTagsManager from './DashboardTagsManager'

export const metadata = {
    title: 'Dashboard - Tags',
    description: 'Manage your blog tags',
}

const Page = () => {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Manage Tags</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Create and organize tags for your blog posts
                </p>
            </div>

            <DashboardTagsManager />
        </div>
    )
}

export default Page
