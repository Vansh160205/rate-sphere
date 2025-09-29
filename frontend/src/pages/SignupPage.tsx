import React from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import SignupForm from '../features/auth/components/SignupForm'

const SignupPage: React.FC = () => {
  return (
    <PageWrapper showNavbar={false} showFooter={false}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <SignupForm />
      </div>
    </PageWrapper>
  )
}

export default SignupPage