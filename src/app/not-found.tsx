import React from 'react'
import Link from 'next/link'

const Page404: React.FC = () => (
  <html lang="en">
    <body>
      <div className="nc-Page404">
        <div className="relative container py-16 lg:py-20">
          <header className="mx-auto max-w-2xl space-y-7 text-center">
            <h2 className="text-7xl md:text-8xl">🪔</h2>
            <h1 className="text-8xl font-semibold tracking-widest md:text-9xl">404</h1>
            <span className="block text-sm font-medium tracking-wider text-neutral-800 sm:text-base dark:text-neutral-200">
              {`THE PAGE YOU WERE LOOKING FOR DOESN'T EXIST.`}
            </span>
            <Link
              href="/"
              className="mt-4 inline-block rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
            >
              Return Home Page
            </Link>
          </header>
        </div>
      </div>
    </body>
  </html>
)

export default Page404
