"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ClientList from "@/components/client-list"
import UserProfileDropdown from "@/components/user-profile-dropdown"
import Logo from "@/components/logo"

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const baseURL = "http://localhost:8080"

  useEffect(() => {
    const storedUser = localStorage.getItem("usuarioLogado")
    if (!storedUser) {
      router.push("/login")
    } else {
      const parsedUser = JSON.parse(storedUser)
      if (parsedUser.fotoUrl && !parsedUser.fotoUrl.startsWith("http")) {
        parsedUser.fotoUrl = `${baseURL}${parsedUser.fotoUrl}`
      }
      setUser(parsedUser)
    }
  }, [router])

  if (!user) return null

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
