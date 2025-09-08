"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ClientList from "@/components/features/clients/client-list"
import UserProfileDropdown from "@/components/common/user-profile-dropdown"
import Logo from "@/components/common/logo"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user_data")
    
    if (!token || !userData) {
      router.push("/login")
      return
    }
    
    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      router.push("/login")
      return
    }
    
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
          <Skeleton className="h-10 w-32" /> {/* Logo skeleton */}
          <Skeleton className="h-7 w-24" /> {/* Title skeleton */}
          <Skeleton className="h-10 w-10 rounded-full" /> {/* Profile skeleton */}
        </header>

        <main className="flex-1 p-6 bg-gray-50">
          <div className="space-y-4">
            {/* Client list skeleton items */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className="bg-white py-4 px-6">
          <Skeleton className="h-4 w-[200px] mx-auto" />
        </footer>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <Logo className="text-center" />
        <h1 className="text-xl font-semibold">Clientes</h1>
        <UserProfileDropdown />
      </header>

      <main className="flex-1 overflow-hidden p-6 bg-gray-50">
        <ClientList />
      </main>
      <footer className="bg-white py-4 px-6 text-center text-sm text-gray-500">
        &copy; 2025 TribunalHub. Todos os direitos reservados.
      </footer>
    </div>
  )
}
