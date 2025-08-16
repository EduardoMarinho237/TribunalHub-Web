"use client"

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
import { CreditCard, User, Settings, LogOut, Heading1 } from "lucide-react"

export default function UserProfileDropdown({ user }) {
  const initials = user?.name?.split(" ").map(n => n[0]).join("") || ""
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 hover:bg-transparent">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/avatars/01.png" alt={user?.name} />
              <AvatarFallback className="bg-slate-200">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium leading-tight">
                {user?.name}
              </span>
              <span className="text-xs text-slate-500 leading-tight">
                {user?.role}
              </span>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.name}
            </p>
            <p className="text-xs leading-none text-slate-500">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem href="www.google.com">
            <span>Fale diretametne com o responsável</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}