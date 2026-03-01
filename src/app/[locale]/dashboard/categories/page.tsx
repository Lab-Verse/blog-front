import DashboardCategoriesManager from './DashboardCategoriesManager'

export const metadata = {
    title: 'Dashboard - Categories',
    description: 'Manage your blog categories',
}

const Page = () => {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Manage Categories</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Create and organize your blog categories
                </p>
            </div>

            <DashboardCategoriesManager />
        </div>
    )
}

export default Page
