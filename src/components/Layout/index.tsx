import React from 'react'
import { Navigation } from './Navigation'
import { PageHeader } from './PageHeader'

interface LayoutProps {
  className?: string
  children: React.ReactNode
}

/**
 * Layout component includes page header & navigation
 * @param props
 * @returns
 */
const Layout: React.FC<LayoutProps> = (props) => {
  const { children, className } = props

  return (
    <>
      <PageHeader />
      <Navigation />
      <main>{children}</main>
    </>
  )
}

export default Layout
