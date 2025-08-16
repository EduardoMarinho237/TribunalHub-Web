"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreditCard, User, LogOut } from "lucide-react"

export default function UserProfileDropdown() {
  const [user, setUser] = useState(null)
  const router = useRouter()
  const baseURL = "http://localhost:8080" // base do backend

  useEffect(() => {
    const storedUser = localStorage.getItem("usuarioLogado")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      if (parsedUser.fotoUrl && !parsedUser.fotoUrl.startsWith("http")) {
        parsedUser.fotoUrl = `${baseURL}${parsedUser.fotoUrl}`
      }
      setUser(parsedUser)
    }
  }, [])

  const initials = user?.nome?.split(" ").map(n => n[0]).join("") || ""

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 hover:bg-transparent">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {user?.fotoUrl ? (
                <AvatarImage src={user.fotoUrl} alt={user?.nome} />
              ) : (
                <AvatarFallback className="bg-slate-200">{initials}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium leading-tight">
                {user?.nome || "Carregando..."}
              </span>
              <span className="text-xs text-slate-500 leading-tight">
                {user?.cargo || "-"}
              </span>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.nome || "-"}</p>
            <p className="text-xs leading-none text-slate-500">{user?.email || "-"}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/perfil")}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/pagamentos")}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Pagamentos</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

      <DropdownMenuItem onClick={() => {
        localStorage.removeItem("usuarioLogado")
        router.push("/login")
      }}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Sair</span>
      </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
