import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

/**
 * Outer category layout — just a passthrough.
 * The inner [handle]/layout.tsx wraps with ApplicationLayout + activeCategory.
 */
const Layout: React.FC<Props> = ({ children }) => {
  return <>{children}</>
}

export default Layout
