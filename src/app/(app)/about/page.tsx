import SectionHero from '@/components/SectionHero'
import rightImg from '@/images/about-hero-right.png'
import { Divider } from '@/shared/divider'
import SectionStatistic from './SectionStatistic'
import { Metadata } from 'next'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog'

export const metadata: Metadata = {
  title: `About Us`,
  description: `Learn more about ${SITE_NAME} — our mission, values, and what drives us to deliver quality content.`,
}

const PageAbout = () => {
  return (
    <div className="nc-PageAbout relative">
      <div className="container relative space-y-16 py-16 lg:space-y-28 lg:py-28">
        <SectionHero
          rightImg={rightImg}
          heading={`About ${SITE_NAME}`}
          btnText="Get in touch"
          btnHref="/contact"
          subHeading={`${SITE_NAME} is a platform dedicated to sharing insightful articles, stories, and perspectives. We believe in the power of words to inform, inspire, and connect communities around the world.`}
        />

        <Divider />

        {/* Mission Section */}
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Our Mission
          </h2>
          <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400">
            We strive to create a space where writers and readers come together to explore ideas,
            share knowledge, and engage in meaningful conversations. Our goal is to make quality
            content accessible to everyone.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-700">
              <h3 className="text-lg font-semibold">Quality Content</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Every article is crafted with care, ensuring accuracy and depth on topics that matter.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-700">
              <h3 className="text-lg font-semibold">Community Driven</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Our platform empowers writers to share their voice and readers to discover new perspectives.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-700">
              <h3 className="text-lg font-semibold">Open Platform</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Anyone can contribute, comment, and engage — because great ideas can come from anywhere.
              </p>
            </div>
          </div>
        </div>

        <Divider />
        <SectionStatistic />
      </div>
    </div>
  )
}

export default PageAbout
