import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

interface PageWrapperProps {
  children: React.ReactNode
  showNavbar?: boolean
  showFooter?: boolean
}

const PageWrapper: React.FC<PageWrapperProps> = ({ 
  children, 
  showNavbar = true, 
  showFooter = true 
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  )
}

export default PageWrapper