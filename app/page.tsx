"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

/**
 * Root page handles initial redirection via AuthGuard.
 * We'll just show a loading state here while the Guard does its job.
 */
export default function RootPage() {
  const { isChecking } = useAuth()

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent animate-spin rounded-full shadow-block" />
        <div className="text-xl font-black uppercase tracking-widest text-primary animate-pulse">
          Redirigiendo...
        </div>
      </div>
    </div>
  )
}
