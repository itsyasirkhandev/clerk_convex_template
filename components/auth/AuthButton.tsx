"use client"

import useFirebaseAuth from "@/hooks/useFirebaseAuth"
import { Button } from "@/components/ui/button"

export function AuthButton() {
  const { user, isLoading, loginWithGoogle, logout } = useFirebaseAuth()

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">
          {user.displayName || user.email}
        </span>
        <Button variant="outline" onClick={() => logout()} disabled={isLoading}>
          {isLoading ? "Wait..." : "Logout"}
        </Button>
      </div>
    )
  }

  return (
    <Button variant="default" onClick={() => loginWithGoogle()} disabled={isLoading}>
      {isLoading ? "Loading..." : "Sign in with Google"}
    </Button>
  )
}

