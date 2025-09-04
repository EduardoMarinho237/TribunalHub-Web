"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut, Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function UserProfileDropdown() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("user_data")
        const authToken = localStorage.getItem("auth_token")
        
        if (storedUser && authToken) {
          const parsedUser = JSON.parse(storedUser)
          
          if (parsedUser && parsedUser.userId && parsedUser.nome) {
            let fotoUrl = null
            
            if (parsedUser.fotoUrl && parsedUser.fotoUrl.startsWith('http')) {
              fotoUrl = parsedUser.fotoUrl
            } else if (parsedUser.fotoUrl && !parsedUser.fotoUrl.startsWith('http')) {
              fotoUrl = `http://localhost:8080${parsedUser.fotoUrl}`
            } else {
              try {
                const fotoResponse = await fetch(`http://localhost:8080/api/usuarios/${parsedUser.userId}/foto`, {
                  headers: {
                    'Authorization': `Bearer ${authToken}`
                  }
                })
                if (fotoResponse.ok) {
                  const fotoData = await fotoResponse.json()
                  const photoPath = fotoData.url || fotoData.fotoUrl || fotoData.path
                  if (photoPath) {
                    fotoUrl = photoPath.startsWith('http') 
                      ? photoPath 
                      : `http://localhost:8080${photoPath}`
                  }
                }
              } catch (fotoError) {
                console.log('Erro ao buscar foto:', fotoError)
              }
            }
            
            console.log('URL da foto final:', fotoUrl)
            
            setUser({
              ...parsedUser,
              fotoUrl
            })
          }
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      toast.success('Logout realizado com sucesso!')
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      toast.error('Erro ao fazer logout')
    }
  }

  if (loading) {
    return (
      <Button variant="ghost" className="h-10 px-2 rounded-full flex items-center gap-2" disabled>
        <Avatar className="h-8 w-8">
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </Button>
    )
  }

  if (!user) {
    return null
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 px-2 rounded-full flex items-center gap-2 focus-visible:ring-0">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={user.fotoUrl}
              alt={user.nome}
              onError={(e) => {
                console.log('Erro ao carregar imagem:', user.fotoUrl)
                e.currentTarget.style.display = 'none'
              }}
              onLoad={() => {
                console.log('Imagem carregada com sucesso:', user.fotoUrl)
              }}
            />
            <AvatarFallback>{getInitials(user.nome)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{user.nome}</span>
            <span className="text-xs text-muted-foreground">{user.cargo}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.nome || 'Usuário'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.cargo || 'Cargo'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/perfil')}>          
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Bell className="mr-2 h-4 w-4" />
          <span>Notificações</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}