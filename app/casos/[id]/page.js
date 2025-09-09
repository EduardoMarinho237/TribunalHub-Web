"use client"

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Eye, FileText, ArrowLeft, Calendar, Search } from "lucide-react"

export default function ClientCasesPage() {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Dados mockados - substituir por chamada à API
  const mockClient = {
    id: id,
    name: 'Cliente de Exemplo',
    email: 'cliente@exemplo.com',
    phone: '(11) 99999-9999',
    status: 'Ativo',
    registrationDate: new Date('2023-01-15')
  }

  const mockCases = [
    { 
      id: 1, 
      title: 'Processo 1234567-89.2023.8.26.0001', 
      status: 'Em andamento', 
      lastUpdate: '2023-10-15',
      description: 'Processo trabalhista referente a horas extras não pagas.'
    },
    { 
      id: 2, 
      title: 'Processo 9876543-21.2023.8.26.0002', 
      status: 'Concluído', 
      lastUpdate: '2023-09-28',
      description: 'Ação de cobrança de dívida trabalhista.'
    },
    { 
      id: 3, 
      title: 'Processo 4567891-23.2023.8.26.0003', 
      status: 'Aguardando documentos', 
      lastUpdate: '2023-10-01',
      description: 'Reclamação trabalhista por assédio moral.'
    },
  ]

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // Aqui viria a chamada à API para buscar os dados do cliente
        // const response = await fetch(`/api/clientes/${id}`)
        // const data = await response.json()
        setClient(mockClient)
      } catch (error) {
        toast.error('Erro ao carregar dados do cliente')
      } finally {
        setLoading(false)
      }
    }

    fetchClientData()
  }, [id])

  const filteredCases = mockCases.filter(caseItem => 
    caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.back()}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{client?.name}</h1>
            <p className="text-muted-foreground">Lista de Casos</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar casos..."
              className="pl-9 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => router.push(`/casos/adicionar?clienteId=${id}`)}>
            Novo Caso
          </Button>
        </div>
      </div>

      {filteredCases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((caseItem) => (
            <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-1">{caseItem.title}</CardTitle>
                  <Badge 
                    variant={
                      caseItem.status === 'Em andamento' ? 'default' : 
                      caseItem.status === 'Concluído' ? 'secondary' : 'outline'
                    }
                    className="whitespace-nowrap"
                  >
                    {caseItem.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {caseItem.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Última atualização: {new Date(caseItem.lastUpdate).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push(`/casos/${caseItem.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push(`/casos/${caseItem.id}/formularios`)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Formulários
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">Nenhum caso encontrado</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm ? 'Nenhum caso corresponde à sua busca.' : 'Este cliente ainda não possui casos cadastrados.'}
          </p>
          <Button onClick={() => router.push(`/casos/adicionar?clienteId=${id}`)}>
            Adicionar Caso
          </Button>
        </div>
      )}
    </div>
  )
}
