import DashboardTagsManager from './DashboardTagsManager'
import { getTranslations } from 'next-intl/server'

export const metadata = {
    title: 'Dashboard - Tags',
    description: 'Manage your blog tags',
}

const Page = async () => {
    const t = await getTranslations('tags')

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{t('manageTags')}</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {t('manageTagsDescription')}
                </p>
            </div>

            <DashboardTagsManager />
        </div>
    )
}

export default Page
