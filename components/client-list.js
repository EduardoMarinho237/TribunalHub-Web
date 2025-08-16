"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Check, MoreVertical, ArrowUpDown, ArrowUp, ArrowDown, Eye, Pencil, User, FileText, Calendar, Phone, Mail, ChevronDown } from "lucide-react"
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

// Gerar 20 clientes mockados com mais campos
const generateMockClients = () => {
  const statuses = ["Ativo", "Inativo", "Pendente"]
  const names = [
    "João Silva", "Maria Souza", "Carlos Oliveira", "Ana Santos", "Pedro Costa",
    "Fernanda Lima", "Ricardo Alves", "Patrícia Nunes", "Gabriel Martins", "Juliana Castro",
    "Roberto Fernandes", "Amanda Rocha", "Lucas Mendes", "Beatriz Carvalho", "Felipe Ramos",
    "Camila Dias", "Rodrigo Gonçalves", "Tatiana Ribeiro", "Marcos Pereira", "Isabela Almeida"
  ]
  
  const clients = []
  for (let i = 1; i <= 20; i++) {
    const name = names[i - 1]
    const email = name.toLowerCase().replace(' ', '.') + "@exemplo.com"
    const phone = `(${Math.floor(10 + Math.random() * 90)}) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const registrationDate = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000))
    const caseCount = Math.floor(Math.random() * 15)
    
    clients.push({
      id: i,
      name,
      email,
      phone,
      status,
      registrationDate,
      caseCount,
      notes: i % 3 === 0 ? "Cliente importante com vários casos em andamento" : ""
    })
  }
  return clients
}

const clients = generateMockClients()

const ClientList = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ 
    key: "name", 
    direction: 'ascending' 
  })
  const [clientsPerPage, setClientsPerPage] = useState(8) // Variável para controlar quantos aparecem por página
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isMonitoringEnabled, setIsMonitoringEnabled] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [clientToDelete, setClientToDelete] = useState(null)

  const handleDelete = async (clientId) => {
    try {
      // Substitua por sua chamada à API
      // await fetch(`/api/clients/${clientId}`, { method: 'DELETE' })
      console.log(`Cliente ${clientId} excluído`)
      // Atualize a lista de clientes após exclusão
    } catch (error) {
      console.error("Erro ao excluir cliente:", error)
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
        // Tratar diferentes tipos de ordenação
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
        
        // Ordenação padrão para strings
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
  }, [searchTerm, sortConfig])

  const indexOfLastClient = currentPage * clientsPerPage
  const indexOfFirstClient = indexOfLastClient - clientsPerPage
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient)
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage)

  const casosMock = [
    { id: 1, name: "Caso Trabalhista - Empresa X" },
    { id: 2, name: "Processo Criminal - Acusação Y" },
    { id: 3, name: "Ação Civil - Indenização Z" }
  ];

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
          
          <Button onClick={() => router.push('/clientes/add')} className="ml-auto">Adicionar Cliente</Button>
        </div>
      </div>

      {filteredClients.length > 0 ? (
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
                    onClick={() => router.push(`/clientes/${client.id}/edit`)}
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
                      <DropdownMenuItem onClick={() => router.push('/clientes/1/casos/add')}>
                        Adicionar caso
                      </DropdownMenuItem>

                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center justify-between">
                          Gerenciar casos
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {/* Opção Editar Caso */}
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Editar caso</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {casosMock.map((caso) => (
                                <DropdownMenuItem 
                                  key={`edit-${caso.id}`}
                                  onClick={() => router.push(`/clientes/1/casos/editar?casoId=${caso.id}`)}
                                >
                                  {caso.name}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>

                          {/* Opção Gerar Link de Formulário */}
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Gerar link de formulário</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {casosMock.map((caso) => (
                                <DropdownMenuItem 
                                  key={`link-${caso.id}`}
                                  onClick={() => router.push(`/clientes/1/casos/gerarlink?casoId=${caso.id}`)}
                                >
                                  {caso.name}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      
                      <DropdownMenuItem 
                        className="flex justify-between items-center"
                        onSelect={(e) => e.preventDefault()}
                        onClick={() => setIsMonitoringEnabled(!isMonitoringEnabled)}
                      >
                        <span className="flex items-center gap-2">
                          Disponibilizar acompanhamento
                        </span>
                        <div className={`w-4 h-4 border rounded-sm flex items-center justify-center 
                          ${isMonitoringEnabled ? 'bg-primary border-primary' : 'border-gray-300'}`}
                        >
                          {isMonitoringEnabled && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
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
          <Button onClick={() => router.push('/clientes/add')}>Adicionar Cliente</Button>
        </div>
      )}

      {filteredClients.length > 0 && (
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
                // Calcular página baseada na posição atual
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
            {/* Seção de Informações Básicas */}
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

            {/* Seção de Informações Adicionais */}
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
                router.push(`/clientes/${selectedUser?.id}/edit`)
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

export default ClientList