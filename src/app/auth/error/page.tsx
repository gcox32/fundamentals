'use client'

import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'An unknown error occurred'
  const returnUrl = searchParams.get('return') || '/auth/sign-in'

  return (
    <main className="auth-page">
      <div className="auth-error">
        <h1>Authentication Error</h1>
        <p>{error}</p>
        <Link href={returnUrl}>
          Return to Sign In
        </Link>
      </div>
    </main>
  )
} 