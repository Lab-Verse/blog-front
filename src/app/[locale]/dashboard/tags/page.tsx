import DashboardTagsManager from './DashboardTagsManager'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export const metadata = {
    title: 'Dashboard - Tags',
    description: 'Manage your blog tags',
}

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
    const { locale } = await params
    setRequestLocale(locale)
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
