import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

// Since we have a [locale] layout that renders <html> and <body>,
// the root layout simply passes children through.
export default function RootLayout({ children }: Props) {
  return children
}
