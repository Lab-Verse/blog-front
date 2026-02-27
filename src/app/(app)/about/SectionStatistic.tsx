import { fetchPosts, fetchCategories, fetchAuthors } from '@/utils/serverApi'

export default async function SectionStatistic() {
  // Fetch real counts from API
  let postCount = 0
  let categoryCount = 0
  let authorCount = 0

  try {
    const [postsData, categoriesData, authorsData] = await Promise.all([
      fetchPosts({ limit: 1 }),
      fetchCategories(),
      fetchAuthors(),
    ])
    postCount = Array.isArray(postsData) ? postsData.length : 0
    categoryCount = Array.isArray(categoriesData) ? categoriesData.length : 0
    authorCount = Array.isArray(authorsData) ? authorsData.length : 0
  } catch {
    // Gracefully handle API failures
  }

  return (
    <div>
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl font-semibold tracking-tight text-pretty sm:text-4xl lg:text-5xl">
          Growing Every Day
        </h2>
        <p className="mt-6 text-base/7 text-neutral-600 dark:text-neutral-400">
          Our community is constantly expanding as more writers share their content and readers
          discover stories that resonate with them.
        </p>
      </div>
      <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
        <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-neutral-50 p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start dark:bg-neutral-800">
          <p className="flex-none text-3xl font-bold tracking-tight">
            {postCount.toLocaleString()}+
          </p>
          <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
            <p className="text-lg font-semibold tracking-tight">Published Articles</p>
            <p className="mt-2 text-base/7 text-neutral-600 dark:text-neutral-400">
              Quality posts covering a wide range of topics and categories.
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-neutral-900 p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44 dark:bg-neutral-700">
          <p className="flex-none text-3xl font-bold tracking-tight text-white">
            {categoryCount.toLocaleString()}+
          </p>
          <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
            <p className="text-lg font-semibold tracking-tight text-white">Content Categories</p>
            <p className="mt-2 text-base/7 text-neutral-400">
              Organized collections spanning diverse interests and expertise.
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-primary-600 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
          <p className="flex-none text-3xl font-bold tracking-tight text-white">
            {authorCount.toLocaleString()}+
          </p>
          <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
            <p className="text-lg font-semibold tracking-tight text-white">Contributing Authors</p>
            <p className="mt-2 text-base/7 text-primary-100">
              Talented writers sharing their knowledge and perspectives.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
