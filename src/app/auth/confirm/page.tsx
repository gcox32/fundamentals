'use client'

import { Authenticator } from "@/components/auth/Authenticator"
import { useSearchParams } from "next/navigation"
import { useAuthRedirect } from "@/src/hooks/useAuthRedirect"

export default function ConfirmSignUp() {
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next') || '/'
  useAuthRedirect(nextUrl)

  return (
    <div className="auth-form-container">
      <h2>Confirm Sign Up</h2>
      <Authenticator hideSignUp initialState="signUp" />
    </div>
  )
} 