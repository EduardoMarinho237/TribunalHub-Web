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
import { Check, MoreVertical, ArrowUp, ArrowDown, Eye, Pencil, User, FileText, Calendar, Phone, Mail, ChevronDown, Trash2, Lock, Unlock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  const [clientStatus, setClientStatus] = useState({})

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
        caseCount: client.quantidadeCasos,
        acompanhamento: client.acompanhamento || false
      }))

      // Initialize client status based on acompanhamento field
      const initialStatus = {}
      formattedClients.forEach(client => {
        initialStatus[client.id] = client.acompanhamento === false
      })
      setClientStatus(initialStatus)
      
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

  const toggleClientStatus = async (clientId) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        router.push('/login')
        return
      }

      const newStatus = !clientStatus[clientId]
      const client = clients.find(c => c.id === clientId)
      
      if (!client) {
        throw new Error('Cliente não encontrado')
      }

      const response = await fetch(`http://localhost:8080/api/clientes/${clientId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: client.name,
          email: client.email,
          telefone: client.phone,
          acompanhamento: !newStatus
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ${response.status} ao atualizar status de acompanhamento`)
      }

      // Atualiza o estado local apenas após a confirmação da API
      setClientStatus(prev => ({
        ...prev,
        [clientId]: newStatus
      }))
      
      toast.success('Status de acompanhamento atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar status de acompanhamento:', error)
      toast.error(error.message || 'Erro ao atualizar status de acompanhamento')
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
            <Card 
              key={client.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => router.push(`/casos/${client.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <CardDescription className="text-sm">{client.email}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setClientToDelete(client);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500 hover:text-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleClientStatus(client.id);
                      }}
                    >
                      {clientStatus[client.id] ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Unlock className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500 hover:text-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/clientes/editar/${client.id}`)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{client.phone || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Cadastrado em {client.registrationDate.toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant={clientStatus[client.id] ? 'destructive' : 'default'}>
                      {clientStatus[client.id] ? 'Acesso restringido' : 'Acesso liberado'}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileText className="h-4 w-4 mr-1" />
                      {client.caseCount} {client.caseCount === 1 ? 'caso' : 'casos'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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