"use client"

import { useAppStore } from "@/store"
import { Button } from "@/components/ui/button"

export function AuthButton() {
  const user = useAppStore((state) => state.user)
  const isLoading = useAppStore((state) => state.isLoading)
  const loginWithGoogle = useAppStore((state) => state.loginWithGoogle)
  const logout = useAppStore((state) => state.logout)

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
