"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo, useEffect } from "react"
import { toast } from 'react-hot-toast'
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Check, MoreVertical, ArrowUp, ArrowDown, Eye, Pencil, User, FileText, Calendar, Phone, Mail, ChevronDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function ClientList() {
  const router = useRouter()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ 
    key: "nome", 
    direction: 'ascending' 
  })
  const [clientsPerPage, setClientsPerPage] = useState(8)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [clientToDelete, setClientToDelete] = useState(null)

  useEffect(() => {
    const checkAuthAndLoadClients = async () => {
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user_data')
      
      if (!token || !userData) {
        router.push('/login')
        return
      }
      
      await loadClients()
    }
    
    checkAuthAndLoadClients()
  }, [router])

  const loadClients = async () => {
    try {
      setLoading(true)
      
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`http://localhost:8080/api/clientes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      const formattedClients = data.map(client => ({
        id: client.id,
        name: client.nome,
        email: client.email,
        phone: client.telefone,
        registrationDate: new Date(client.dataCriacao),
        status: 'Ativo',
        caseCount: 0,
        notes: ''
      }))

      setClients(formattedClients)
    } catch (error) {
      toast.error('Erro ao carregar lista de clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (clientId) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`http://localhost:8080/api/clientes/${clientId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      toast.success('Cliente removido com sucesso!')
      loadClients()
    } catch (error) {
      toast.error('Erro ao remover cliente')
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
    setCurrentPage(1)
  }

  const filteredClients = useMemo(() => {
    let result = [...clients]
    
    if (searchTerm) {
      result = result.filter(client => {
        return (
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phone.includes(searchTerm)
        ) 
      })
    }
    
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === 'registrationDate') {
          const dateA = new Date(a.registrationDate).getTime()
          const dateB = new Date(b.registrationDate).getTime()
          return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA
        }
        
        if (sortConfig.key === 'caseCount') {
          return sortConfig.direction === 'ascending' 
            ? a.caseCount - b.caseCount 
            : b.caseCount - a.caseCount
        }
        
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    
    return result
  }, [clients, searchTerm, sortConfig])

  const indexOfLastClient = currentPage * clientsPerPage
  const indexOfFirstClient = indexOfLastClient - clientsPerPage
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient)
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage)

  const getSortLabel = () => {
    switch(sortConfig.key) {
      case 'name': return 'Nome'
      case 'email': return 'Email'
      case 'phone': return 'Telefone'
      case 'registrationDate': return 'Data de Registro'
      case 'caseCount': return 'Quantidade de Casos'
      default: return 'Ordenar por'
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center w-full md:w-auto">
          <Input
            placeholder="Filtrar clientes..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {getSortLabel()}
                {sortConfig.direction === 'ascending' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => requestSort('name')}>
                <span className="flex items-center gap-2">
                  Nome {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => requestSort('email')}>
                <span className="flex items-center gap-2">
                  Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => requestSort('phone')}>
                <span className="flex items-center gap-2">
                  Telefone {sortConfig.key === 'phone' && (sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => requestSort('registrationDate')}>
                <span className="flex items-center gap-2">
                  Data de Registro {sortConfig.key === 'registrationDate' && (sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => requestSort('caseCount')}>
                <span className="flex items-center gap-2">
                  Quantidade de Casos {sortConfig.key === 'caseCount' && (sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {clientsPerPage} por página
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setClientsPerPage(2)}>2 por página</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setClientsPerPage(4)}>4 por página</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setClientsPerPage(8)}>8 por página</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={() => router.push('/clientes/adicionar')} className="ml-auto">Adicionar Cliente</Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: clientsPerPage }).map((_, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                <div className="flex gap-2 w-full">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {currentClients.map((client) => (
            <div key={client.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{client.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                    <Mail size={14} className="opacity-70" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                    <Phone size={14} className="opacity-70" />
                    <span>{client.phone}</span>
                  </div>
                </div>
                
                <Badge 
                  className={`px-2 py-1 rounded-full text-xs ${
                    client.status === "Ativo" ? "bg-green-100 text-green-800" :
                    client.status === "Inativo" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {client.status}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{client.registrationDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText size={14} />
                    <span>{client.caseCount} casos</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => {
                      setSelectedUser(client)
                      setIsViewModalOpen(true)
                    }}
                    className="h-8 w-8"
                  >
                    <Eye size={16} />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => router.push(`/clientes/editar/${client.id}`)}
                    className="h-8 w-8"
                  >
                    <Pencil size={16} />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => router.push('/clientes/1/casos/adicionar')}>
                        Adicionar caso
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => {
                          setClientToDelete(client) 
                          setIsDeleteDialogOpen(true)
                        }}
                        className="text-red-600 flex items-center gap-2"
                      >
                        <span>Excluir cliente</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-gray-50">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhum cliente encontrado</h3>
          <p className="text-sm text-gray-500 mb-4 text-center">
            {searchTerm ? `Nenhum resultado para "${searchTerm}"` : "Adicione seu primeiro cliente"}
          </p>
          <Button onClick={() => router.push('/clientes/adicionar')}>Adicionar Cliente</Button>
        </div>
      )}

      {filteredClients.length > 0 && !loading && (
        <div className="mt-auto">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="cursor-pointer"
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                if (pageNum > totalPages) return null
                
                return (
                  <PaginationItem key={i}>
                    <Button
                      variant={currentPage === pageNum ? "default" : "ghost"}
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-10 h-10 p-0"
                    >
                      {pageNum}
                    </Button>
                  </PaginationItem>
                )
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || filteredClients.length === 0}
                  className="cursor-pointer"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          
          <div className="text-sm text-gray-500 text-center mt-2">
            Mostrando {indexOfFirstClient + 1} - {Math.min(indexOfLastClient, filteredClients.length)} de {filteredClients.length} clientes
          </div>
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente o cliente {clientToDelete?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                handleDelete(clientToDelete?.id)
                setClientToDelete(null)
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmar exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Cliente
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Nome Completo</div>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p>{selectedUser?.name || 'Não informado'}</p>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Email</div>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p>{selectedUser?.email || 'Não informado'}</p>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Telefone</div>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p>{selectedUser?.phone || 'Não informado'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Data de Cadastro</div>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p>{selectedUser?.registrationDate ? selectedUser.registrationDate.toLocaleDateString() : 'Não informado'}</p>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p>{selectedUser?.status || 'Não informado'}</p>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Quantidade de Casos</div>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p>{selectedUser?.caseCount || '0'}</p>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="text-sm font-medium text-muted-foreground mb-1">Anotações</div>
              <div className="mt-1 p-3 bg-gray-50 rounded-md min-h-[100px]">
                <p className="whitespace-pre-line">
                  {selectedUser?.notes || 'Nenhuma anotação cadastrada'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsViewModalOpen(false)}
            >
              Fechar
            </Button>
            <Button 
              variant="secondary"
              onClick={() => {
                setIsViewModalOpen(false)
                router.push(`/clientes/editar/`+selectedUser?.id)
              }}
            >
              Editar informações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}