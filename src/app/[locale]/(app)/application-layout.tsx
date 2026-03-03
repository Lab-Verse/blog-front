import BackToTopButton from '@/components/BackToTopButton'
import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import Header2 from '@/components/Header/Header2'
import TopBar from '@/components/Header/TopBar'
import ReadingProgressBar from '@/components/ReadingProgressBar'
import AsideSidebarNavigation from '@/components/aside-sidebar-navigation'
import Banner from '@/shared/banner'
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
  headerHasBorder?: boolean
  headerStyle?: 'header-1' | 'header-2'
  showBanner?: boolean
  /** CNN-style: slug of the active category to show subcategories in header */
  activeCategory?: string
}

const ApplicationLayout: React.FC<Props> = ({
  children,
  headerHasBorder,
  headerStyle = 'header-2',
  showBanner = false,
  activeCategory,
}) => {
  return (
    <>
      {/* Reading progress indicator */}
      <ReadingProgressBar />

      {/* Top utility bar with logo, language, date/time */}
      <TopBar />
      
      {/* header - Chose header style here / header 1 or header 2*/}
      {showBanner && <Banner />}
      {headerStyle === 'header-2' && (
        <Header2 bottomBorder={headerHasBorder} activeCategory={activeCategory} />
      )}
      {headerStyle === 'header-1' && (
        <Header bottomBorder={headerHasBorder} activeCategory={activeCategory} />
      )}

      {children}

      {/* footer - Chose footer style here / footer 1 or footer 2 or footer 3 or footer 4 */}
      <Footer />
      {/* aside sidebar navigation */}
      <AsideSidebarNavigation />
      {/* Floating back to top button */}
      <BackToTopButton />
    </>
  )
}

export { ApplicationLayout }
